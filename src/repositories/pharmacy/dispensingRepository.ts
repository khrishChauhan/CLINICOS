import type { SupabaseClient } from '@supabase/supabase-js'

export async function dispenseMedicinesFEFO(
  supabase: SupabaseClient,
  clinicId: string,
  patientId: string,
  userId: string,
  visitId: string | null,
  prescriptionId: string | null,
  items: Array<{
    medicine_id: string
    quantity: number
    original_medicine_id: string | null
    substitution_reason: string | null
  }>
): Promise<string> {
  const { data, error } = await supabase.rpc('dispense_medicines_fefo', {
    p_clinic_id: clinicId,
    p_patient_id: patientId,
    p_user_id: userId,
    p_visit_id: visitId,
    p_prescription_id: prescriptionId,
    p_items: items
  })

  if (error) throw new Error(`FEFO Dispense Failed: ${error.message}`)
  return data as string // returns the dispense_id
}
