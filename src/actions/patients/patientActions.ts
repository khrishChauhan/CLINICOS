'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { patientService } from '@/services/patients/patientService'
import type { PatientListItem } from '@/types/patients'
import { z } from 'zod'

// ─────────────────────────────────────────────────────────────────────────────
// Auth & Permission helper
// ─────────────────────────────────────────────────────────────────────────────

async function getAuthContext() {
  const supabase = await createClient()
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) return { ok: false as const, error: 'UNAUTHENTICATED' as const, supabase, user: null, ctx: null }

  const { data: ctx } = await supabase.rpc('get_session_context')
  return { ok: true as const, supabase, user, ctx }
}

function hasPermission(ctx: any, ...perms: string[]): boolean {
  if (!ctx) return true
  const role = ctx.role_name ?? ''
  if (role === 'Super Admin' || role === 'Clinic Admin' || role.toLowerCase().includes('admin') || role.toLowerCase().includes('doctor') || role.toLowerCase().includes('reception')) return true
  const permissions: string[] = ctx.permissions ?? []
  if (permissions.length === 0) return true
  return perms.some(p => permissions.includes(p))
}

// ─────────────────────────────────────────────────────────────────────────────
// GET PATIENT BY ID
// ─────────────────────────────────────────────────────────────────────────────

export type GetPatientResult =
  | { ok: true; patient: PatientListItem }
  | { ok: false; error: 'UNAUTHENTICATED' | 'FORBIDDEN' | 'NOT_FOUND' | 'QUERY_ERROR'; message?: string }

export async function getPatientByIdAction(id: string): Promise<GetPatientResult> {
  const auth = await getAuthContext()
  if (!auth.ok) return { ok: false, error: 'UNAUTHENTICATED' }
  if (!hasPermission(auth.ctx, 'patients.read')) return { ok: false, error: 'FORBIDDEN' }

  try {
    const patient = await patientService.getPatientById(auth.supabase, id)
    if (!patient) return { ok: false, error: 'NOT_FOUND' }
    return { ok: true, patient }
  } catch (err) {
    return { ok: false, error: 'QUERY_ERROR', message: err instanceof Error ? err.message : 'Unknown error' }
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// UPDATE PATIENT
// ─────────────────────────────────────────────────────────────────────────────

const updatePatientSchema = z.object({
  first_name: z.string().min(1, 'First name is required').max(100),
  middle_name: z.string().max(100).optional().nullable(),
  last_name: z.string().max(100).optional().nullable(),
  title: z.string().max(20).optional().nullable(),
  gender: z.string().max(50).optional().nullable(),
  date_of_birth: z.string().optional().nullable(),
  age: z.coerce.number().int().min(0).max(150).optional().nullable(),
  age_unit: z.enum(['Years', 'Months', 'Days']).optional().nullable(),
  blood_group: z.string().max(10).optional().nullable(),
  mobile_number: z.string().min(10, 'Valid mobile number required').max(20),
  alternate_mobile: z.string().max(20).optional().nullable(),
  email: z.string().email('Enter a valid email').optional().nullable().or(z.literal('')),
  occupation: z.string().max(100).optional().nullable(),
  marital_status: z.string().max(50).optional().nullable(),
  nationality: z.string().max(100).optional().nullable(),
  religion: z.string().max(100).optional().nullable(),
  remarks: z.string().max(1000).optional().nullable(),
})

export type UpdatePatientInput = z.infer<typeof updatePatientSchema>

export type UpdatePatientResult =
  | { ok: true }
  | { ok: false; error: 'UNAUTHENTICATED' | 'FORBIDDEN' | 'VALIDATION_ERROR' | 'DB_ERROR'; message?: string; fieldErrors?: Record<string, string[]> }

export async function updatePatientAction(id: string, formData: UpdatePatientInput): Promise<UpdatePatientResult> {
  const auth = await getAuthContext()
  if (!auth.ok) return { ok: false, error: 'UNAUTHENTICATED' }
  if (!hasPermission(auth.ctx, 'patients.edit', 'patients.update')) return { ok: false, error: 'FORBIDDEN' }

  const parsed = updatePatientSchema.safeParse(formData)
  if (!parsed.success) {
    const fieldErrors: Record<string, string[]> = {}
    for (const [k, v] of Object.entries(parsed.error.flatten().fieldErrors)) {
      fieldErrors[k] = v as string[]
    }
    return { ok: false, error: 'VALIDATION_ERROR', fieldErrors }
  }

  const { data: updateData, error } = await auth.supabase
    .from('patients')
    .update({
      ...parsed.data,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)
    .eq('is_deleted', false)

  if (error) return { ok: false, error: 'DB_ERROR', message: error.message }

  revalidatePath(`/patients/${id}`)
  revalidatePath('/patients')
  return { ok: true }
}

// ─────────────────────────────────────────────────────────────────────────────
// UPDATE PATIENT STATUS
// ─────────────────────────────────────────────────────────────────────────────

export type UpdatePatientStatusResult =
  | { ok: true }
  | { ok: false; error: 'UNAUTHENTICATED' | 'FORBIDDEN' | 'DB_ERROR'; message?: string }

export async function updatePatientStatusAction(id: string, status: 'Active' | 'Inactive'): Promise<UpdatePatientStatusResult> {
  const auth = await getAuthContext()
  if (!auth.ok) return { ok: false, error: 'UNAUTHENTICATED' }
  if (!hasPermission(auth.ctx, 'patients.edit', 'patients.update')) return { ok: false, error: 'FORBIDDEN' }

  const { error } = await auth.supabase
    .from('patients')
    .update({ status, updated_at: new Date().toISOString() })
    .eq('id', id)
    .eq('is_deleted', false)

  if (error) return { ok: false, error: 'DB_ERROR', message: error.message }

  revalidatePath(`/patients/${id}`)
  revalidatePath('/patients')
  return { ok: true }
}

// ─────────────────────────────────────────────────────────────────────────────
// DELETE (SOFT) PATIENT
// ─────────────────────────────────────────────────────────────────────────────

export type DeletePatientResult =
  | { ok: true }
  | { ok: false; error: 'UNAUTHENTICATED' | 'FORBIDDEN' | 'DB_ERROR'; message?: string }

export async function deletePatientAction(id: string): Promise<DeletePatientResult> {
  const auth = await getAuthContext()
  if (!auth.ok) return { ok: false, error: 'UNAUTHENTICATED' }
  // Only Super Admin or those with patients.delete permission
  if (!hasPermission(auth.ctx, 'patients.delete')) return { ok: false, error: 'FORBIDDEN' }

  const { error } = await auth.supabase
    .from('patients')
    .update({ is_deleted: true, deleted_at: new Date().toISOString() })
    .eq('id', id)

  if (error) return { ok: false, error: 'DB_ERROR', message: error.message }

  revalidatePath('/patients')
  return { ok: true }
}
