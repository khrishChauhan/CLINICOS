import type { SupabaseClient } from '@supabase/supabase-js'
import type { PatientRow, PatientFilters, PaginatedResult } from '@/types/patients'

// Columns we actually need — never SELECT *
const PATIENT_LIST_COLUMNS = [
  'id',
  'uhid',
  'title',
  'first_name',
  'middle_name',
  'last_name',
  'gender',
  'age',
  'age_unit',
  'blood_group',
  'mobile_number',
  'status',
  'registration_date',
  'patient_type',
].join(', ')

/**
 * Fetches a paginated, filtered list of patients for the authenticated clinic.
 * RLS on `patients` table enforces clinic_id isolation automatically —
 * the server Supabase client passes the user's session cookie.
 */
export async function findPatients(
  supabase: SupabaseClient,
  filters: PatientFilters
): Promise<PaginatedResult<PatientRow>> {
  const page = Math.max(1, filters.page ?? 1)
  const pageSize = Math.min(50, Math.max(1, filters.pageSize ?? 15))
  const offset = (page - 1) * pageSize

  // Base query with exact count for pagination
  let query = supabase
    .from('patients')
    .select(PATIENT_LIST_COLUMNS, { count: 'exact' })
    .eq('is_deleted', false)

  // Search: OR across uhid, first_name, last_name, mobile_number
  if (filters.search) {
    const q = filters.search.trim().replace(/[%_]/g, '') // sanitize wildcards
    query = query.or(
      `uhid.ilike.%${q}%,first_name.ilike.%${q}%,last_name.ilike.%${q}%,mobile_number.ilike.%${q}%`
    )
  }

  // Exact-match filters
  if (filters.gender)     query = query.eq('gender', filters.gender)
  if (filters.bloodGroup) query = query.eq('blood_group', filters.bloodGroup)
  if (filters.status)     query = query.eq('status', filters.status)

  // Sort newest registrations first, apply pagination window
  query = query
    .order('registration_date', { ascending: false })
    .range(offset, offset + pageSize - 1)

  const { data, error, count } = await query

  if (error) throw new Error(`Patient list query failed: ${error.message}`)

  const totalCount = count ?? 0

  return {
    data: (data ?? []) as unknown as PatientRow[],
    totalCount,
    page,
    pageSize,
    totalPages: Math.max(1, Math.ceil(totalCount / pageSize)),
  }
}
