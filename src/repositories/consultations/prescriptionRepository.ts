import type { SupabaseClient } from '@supabase/supabase-js'
import type { PrescriptionRow, PrescriptionItemRow } from '@/types/consultations'

export async function getPrescription(
  supabase: SupabaseClient,
  consultationId: string
): Promise<{ prescription: PrescriptionRow | null; items: PrescriptionItemRow[] }> {
  const { data: rx, error: rxErr } = await supabase
    .from('prescriptions')
    .select('*').limit(100)
    .eq('consultation_id', consultationId)
    .maybeSingle()

  if (rxErr) throw new Error(`Failed to fetch prescription: ${rxErr.message}`)
  if (!rx) return { prescription: null, items: [] }

  const { data: items, error: itemsErr } = await supabase
    .from('prescription_items')
    .select('*').limit(100)
    .eq('prescription_id', rx.id)
    .order('created_at', { ascending: true })

  if (itemsErr) throw new Error(`Failed to fetch prescription items: ${itemsErr.message}`)

  return { prescription: rx as PrescriptionRow, items: items as PrescriptionItemRow[] }
}

export async function ensurePrescriptionExists(
  supabase: SupabaseClient,
  consultationId: string,
  clinicId: string,
  patientId: string,
  doctorId: string
): Promise<PrescriptionRow> {
  const existing = await supabase
    .from('prescriptions')
    .select('*').limit(100)
    .eq('consultation_id', consultationId)
    .maybeSingle()

  if (existing.data) return existing.data as PrescriptionRow

  const { data, error } = await supabase
    .from('prescriptions')
    .insert([{
      consultation_id: consultationId,
      clinic_id: clinicId,
      patient_id: patientId,
      doctor_id: doctorId
    }])
    .select()
    .single()

  if (error) throw new Error(`Failed to create prescription: ${error.message}`)
  return data as PrescriptionRow
}

export async function addPrescriptionItem(
  supabase: SupabaseClient,
  prescriptionId: string,
  item: Omit<PrescriptionItemRow, 'id' | 'prescription_id' | 'created_at'>
): Promise<PrescriptionItemRow> {
  const { data, error } = await supabase
    .from('prescription_items')
    .insert([{ ...item, prescription_id: prescriptionId }])
    .select()
    .single()

  if (error) throw new Error(`Failed to add item: ${error.message}`)
  return data as PrescriptionItemRow
}

export async function removePrescriptionItem(
  supabase: SupabaseClient,
  itemId: string
): Promise<void> {
  const { error } = await supabase
    .from('prescription_items')
    .delete()
    .eq('id', itemId)

  if (error) throw new Error(`Failed to remove item: ${error.message}`)
}
