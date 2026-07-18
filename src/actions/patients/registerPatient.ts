'use server'

import { createClient } from '@/lib/supabase/server'
import { patientRegistrationSchema } from '@/services/patients/validation'
import type { PatientRegistrationInput } from '@/services/patients/validation'

export type RegisterPatientResult =
  | { ok: true; patientId: string; uhid: string }
  | { ok: false; error: 'UNAUTHENTICATED' | 'FORBIDDEN' | 'VALIDATION_ERROR' | 'DB_ERROR'; message?: string; fieldErrors?: Record<string, string[]> }

/**
 * Server Action: Register Patient
 * Validates → permission-checks → calls atomic Postgres RPC
 */
export async function registerPatient(
  formData: PatientRegistrationInput
): Promise<RegisterPatientResult> {
  const supabase = await createClient()

  // 1. Auth
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) return { ok: false, error: 'UNAUTHENTICATED' }

  // 2. Permission
  const { data: ctx } = await supabase.rpc('get_session_context')
  const permissions: string[] = ctx?.permissions ?? []
  if (ctx?.role_name !== 'Super Admin' && !permissions.includes('patients.create')) {
    return { ok: false, error: 'FORBIDDEN' }
  }

  // 3. Server-side Zod validation (security gate — never trust client)
  const parsed = patientRegistrationSchema.safeParse(formData)
  if (!parsed.success) {
    const fieldErrors: Record<string, string[]> = {}
    for (const [key, errs] of Object.entries(parsed.error.flatten().fieldErrors)) {
      fieldErrors[key] = errs as string[]
    }
    return { ok: false, error: 'VALIDATION_ERROR', fieldErrors }
  }

  const data = parsed.data
  const clinicId: string = ctx?.clinic_id

  // 4. Call the atomic Postgres transaction RPC
  const payload = {
    clinic_id: clinicId,
    created_by: user.id,
    created_by_name: ctx?.full_name ?? ctx?.username ?? 'Staff',
    ...data,
    // Serialize nested arrays
    addresses: data.addresses ?? [],
    emergency_contacts: data.emergency_contacts ?? [],
    insurance: data.insurance ?? [],
    medical_history: data.medical_history ?? [],
    // Coerce numbers to strings for JSONB
    age: data.age != null ? String(data.age) : null,
    coverage_amount: undefined, // handled per-item in the RPC
  }

  const { data: result, error: rpcError } = await supabase.rpc(
    'register_patient_transaction',
    { p_payload: payload }
  )

  if (rpcError) {
    return { ok: false, error: 'DB_ERROR', message: rpcError.message }
  }

  return {
    ok: true,
    patientId: result.patient_id,
    uhid: result.uhid,
  }
}
