import type { SupabaseClient } from '@supabase/supabase-js'
import type { LabTestRow, LabTestCategoryRow, ReferenceRangeRow } from '@/types/laboratory'

export async function getLabTests(supabase: SupabaseClient, clinicId: string): Promise<LabTestRow[]> {
  const { data, error } = await supabase
    .from('lab_tests')
    .select('*').limit(100)
    .eq('clinic_id', clinicId)
    .eq('is_active', true)
    .order('name', { ascending: true })
  if (error) throw new Error(`Failed to fetch lab tests: ${error.message}`)
  return data as LabTestRow[]
}

export async function createLabTest(
  supabase: SupabaseClient,
  payload: Omit<LabTestRow, 'id' | 'created_at'>
): Promise<LabTestRow> {
  const { data, error } = await supabase
    .from('lab_tests')
    .insert([payload])
    .select()
    .single()
  if (error) throw new Error(`Failed to create lab test: ${error.message}`)
  return data as LabTestRow
}

export async function getReferenceRangesForTest(
  supabase: SupabaseClient,
  labTestId: string
): Promise<ReferenceRangeRow[]> {
  const { data, error } = await supabase
    .from('reference_ranges')
    .select('*').limit(100)
    .eq('lab_test_id', labTestId)
  if (error) throw new Error(`Failed to fetch reference ranges: ${error.message}`)
  return data as ReferenceRangeRow[]
}

export async function upsertReferenceRange(
  supabase: SupabaseClient,
  payload: Omit<ReferenceRangeRow, 'id' | 'created_at'>
): Promise<void> {
  const { error } = await supabase
    .from('reference_ranges')
    .insert([payload])
  if (error) throw new Error(`Failed to save reference range: ${error.message}`)
}
