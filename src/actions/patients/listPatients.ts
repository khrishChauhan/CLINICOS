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

  // 2. Load permission context (reuses cached RPC on same connection)
  const { data: ctx } = await supabase.rpc('get_session_context')
  const permissions = (ctx?.permissions ?? []) as string[]
  const roleName: string = ctx?.role_name ?? ''

  // 3. Permission gate — Super Admin bypasses explicit permission check
  const canReadPatients =
    roleName === 'Super Admin' || permissions.includes('patients.read')

  if (!canReadPatients) {
    return { ok: false, error: 'FORBIDDEN' }
  }

  // 4. Delegate to service (supabase client carries the session — RLS enforced)
  try {
    const result = await patientService.list(supabase, filters)
    return { ok: true, result }
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    return { ok: false, error: 'QUERY_ERROR', message }
  }
}
