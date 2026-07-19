import type { SupabaseClient } from '@supabase/supabase-js'
import type { LabResultRow, LabResultValueRow } from '@/types/laboratory'

export async function createLabResult(
  supabase: SupabaseClient,
  labOrderId: string,
  enteredBy: string
): Promise<LabResultRow> {
  const { data, error } = await supabase
    .from('lab_results')
    .insert([{ lab_order_id: labOrderId, entered_by: enteredBy }])
    .select()
    .single()
  if (error) throw new Error(`Failed to create lab result: ${error.message}`)
  return data as LabResultRow
}

export async function upsertResultValues(
  supabase: SupabaseClient,
  values: Omit<LabResultValueRow, 'id' | 'created_at'>[]
): Promise<void> {
  const { error } = await supabase.from('lab_result_values').insert(values)
  if (error) throw new Error(`Failed to save result values: ${error.message}`)
}

export async function verifyLabResult(
  supabase: SupabaseClient,
  labResultId: string,
  remarks: string | null
): Promise<void> {
  const { error } = await supabase
    .from('lab_results')
    .update({ is_verified: true, remarks })
    .eq('id', labResultId)
  if (error) throw new Error(`Failed to verify result: ${error.message}`)
}
