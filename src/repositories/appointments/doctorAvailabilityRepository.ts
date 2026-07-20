import type { SupabaseClient } from '@supabase/supabase-js'
import type { DoctorAvailabilityRow } from '@/types/appointments'

export async function createAvailability(
  supabase: SupabaseClient,
  payload: Partial<DoctorAvailabilityRow>
): Promise<DoctorAvailabilityRow> {
  const { data, error } = await supabase
    .from('doctor_availability')
    .insert([payload])
    .select()
    .single()

  if (error) throw new Error(`Failed to create availability: ${error.message}`)
  return data as DoctorAvailabilityRow
}

export async function getAvailabilityByDoctor(
  supabase: SupabaseClient,
  clinicId: string,
  doctorId: string
): Promise<DoctorAvailabilityRow[]> {
  const { data, error } = await supabase
    .from('doctor_availability')
    .select('*')
    .eq('clinic_id', clinicId)
    .eq('doctor_id', doctorId)
    .eq('status', 'Active')

  if (error) throw new Error(`Failed to fetch availability: ${error.message}`)
  return data as DoctorAvailabilityRow[]
}

export async function updateAvailability(
  supabase: SupabaseClient,
  availabilityId: string,
  payload: Partial<DoctorAvailabilityRow>
): Promise<DoctorAvailabilityRow> {
  const { data, error } = await supabase
    .from('doctor_availability')
    .update({ ...payload, updated_at: new Date().toISOString() })
    .eq('id', availabilityId)
    .select()
    .single()

  if (error) throw new Error(`Failed to update availability: ${error.message}`)
  return data as DoctorAvailabilityRow
}
