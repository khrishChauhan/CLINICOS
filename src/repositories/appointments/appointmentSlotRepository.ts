import type { SupabaseClient } from '@supabase/supabase-js'
import type { AppointmentSlotRow } from '@/types/appointments'

export async function createSlot(
  supabase: SupabaseClient,
  payload: Partial<AppointmentSlotRow>
): Promise<AppointmentSlotRow> {
  const { data, error } = await supabase
    .from('appointment_slots')
    .insert([payload])
    .select()
    .single()

  if (error) throw new Error(`Failed to create slot: ${error.message}`)
  return data as AppointmentSlotRow
}

export async function getSlotsByDoctor(
  supabase: SupabaseClient,
  clinicId: string,
  doctorId: string,
  dayOfWeek?: number
): Promise<AppointmentSlotRow[]> {
  let query = supabase
    .from('appointment_slots')
    .select('*')
    .eq('clinic_id', clinicId)
    .eq('doctor_id', doctorId)
    .eq('status', 'Active')

  if (dayOfWeek !== undefined) {
    query = query.eq('day_of_week', dayOfWeek)
  }

  const { data, error } = await query.order('slot_start_time', { ascending: true })

  if (error) throw new Error(`Failed to fetch slots: ${error.message}`)
  return data as AppointmentSlotRow[]
}

export async function updateSlotStatus(
  supabase: SupabaseClient,
  slotId: string,
  status: string
): Promise<AppointmentSlotRow> {
  const { data, error } = await supabase
    .from('appointment_slots')
    .update({ status, updated_at: new Date().toISOString() })
    .eq('id', slotId)
    .select()
    .single()

  if (error) throw new Error(`Failed to update slot: ${error.message}`)
  return data as AppointmentSlotRow
}

export async function deleteSlot(
  supabase: SupabaseClient,
  slotId: string
): Promise<void> {
  const { error } = await supabase
    .from('appointment_slots')
    .delete()
    .eq('id', slotId)

  if (error) throw new Error(`Failed to delete slot: ${error.message}`)
}
