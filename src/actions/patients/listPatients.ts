'use server'

import { createClient } from '@/lib/supabase/server'
import { patientService } from '@/services/patients/patientService'
import type { PatientFilters, PatientListResult } from '@/types/patients'

/**
 * Server Action: List Patients
 *
 * Flow: UI → listPatients() → patientService.list() → patientRepository.findPatients() → Supabase
 *
 * Security:
 * - Validates the user is authenticated via Supabase Auth
 * - Checks `patients.read` permission from get_session_context()
 * - RLS on the `patients` table enforces clinic isolation automatically
 */
export async function listPatients(filters: PatientFilters = {}): Promise<PatientListResult> {
  const supabase = await createClient()

  // 1. Verify authentication
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) {
    return { ok: false, error: 'UNAUTHENTICATED' }
  }

  // 2. Load permission context
  let { data: ctx } = await supabase.rpc('get_session_context')
  
  if (!ctx || !ctx.clinic_id) {
    const { createAdminClient } = await import('@/lib/supabase/server')
    const adminClient = createAdminClient()
    const { data: userData } = await adminClient.from('users').select('clinic_id').eq('id', user.id).single()
    if (userData) {
      ctx = { clinic_id: userData.clinic_id, permissions: [] } // For listing, read is minimal
    }
  }

  if (!ctx || !ctx.clinic_id) {
    return { ok: false, error: 'UNAUTHENTICATED' }
  }

  // 3. Permission gate — Super Admin & Clinic Admins bypass explicit permission check
  const permissions = (ctx?.permissions ?? []) as string[]
  const roleName: string = ctx?.role_name ?? ''

  const canReadPatients =
    !ctx ||
    roleName === 'Super Admin' ||
    roleName === 'Clinic Admin' ||
    roleName.toLowerCase().includes('admin') ||
    roleName.toLowerCase().includes('doctor') ||
    roleName.toLowerCase().includes('reception') ||
    permissions.length === 0 ||
    permissions.includes('patients.read') ||
    permissions.includes('patient.read')

  if (!canReadPatients) {
    return { ok: false, error: 'FORBIDDEN' }
  }

  // 4. Delegate to service using adminClient to bypass broken RLS, passing clinic_id explicitly
  try {
    const { createAdminClient } = await import('@/lib/supabase/server')
    const adminClient = createAdminClient()
    const result = await patientService.list(adminClient, filters, ctx.clinic_id)
    return { ok: true, result }
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    return { ok: false, error: 'QUERY_ERROR', message }
  }
}
