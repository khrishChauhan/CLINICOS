import type { SupabaseClient } from '@supabase/supabase-js'
import type { DispenseRecordRow, DispenseItemRow } from '@/types/pharmacy'

export async function createDispenseRecord(
  supabase: SupabaseClient,
  clinicId: string,
  patientId: string,
  prescriptionId: string | null,
  userId: string
): Promise<DispenseRecordRow> {
  const { data, error } = await supabase
    .from('dispense_records')
    .insert([{
      clinic_id: clinicId,
      patient_id: patientId,
      prescription_id: prescriptionId,
      dispensed_by: userId
    }])
    .select()
    .single()
    
  if (error) throw new Error(`Failed to create dispense record: ${error.message}`)
  return data as DispenseRecordRow
}

export async function createDispenseItem(
  supabase: SupabaseClient,
  payload: Omit<DispenseItemRow, 'id' | 'created_at'>
): Promise<void> {
  const { error } = await supabase
    .from('dispense_items')
    .insert([payload])
    
  if (error) throw new Error(`Failed to save dispense item: ${error.message}`)
}
