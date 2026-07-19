import type { SupabaseClient } from '@supabase/supabase-js'
import type { LabSampleRow } from '@/types/laboratory'

export async function createSample(
  supabase: SupabaseClient,
  labOrderId: string,
  specimenType: string,
  collectedBy: string
): Promise<LabSampleRow> {
  const { data, error } = await supabase
    .from('lab_samples')
    .insert([{
      lab_order_id: labOrderId,
      specimen_type: specimenType,
      collected_by: collectedBy,
      collected_at: new Date().toISOString()
    }])
    .select()
    .single()
  if (error) throw new Error(`Failed to create sample: ${error.message}`)
  return data as LabSampleRow
}
