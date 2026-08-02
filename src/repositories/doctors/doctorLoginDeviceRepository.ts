import type { SupabaseClient } from '@supabase/supabase-js'
import type { DoctorLoginDeviceRow } from '@/types/doctors'

export const doctorLoginDeviceRepository = {
  async getDevicesByDoctor(supabase: SupabaseClient, clinicId: string, doctorId: string): Promise<DoctorLoginDeviceRow[]> {
    const { data, error } = await supabase
      .schema('doctor').from('doctor_login_devices')
      .select('*')
      .eq('clinic_id', clinicId)
      .eq('doctor_id', doctorId)
      .order('last_login', { ascending: false })

    if (error) throw new Error(`Failed to fetch devices: ${error.message}`)
    return data as DoctorLoginDeviceRow[]
  },

  async upsertDevice(supabase: SupabaseClient, payload: Partial<DoctorLoginDeviceRow>): Promise<DoctorLoginDeviceRow> {
    // We match on doctor_id + some device identifier if we wanted to true upsert,
    // but here we might just insert a new record for tracking if no device matching logic exists.
    // For simplicity, we just insert.
    const { data, error } = await supabase
      .schema('doctor').from('doctor_login_devices')
      .insert([payload])
      .select()
      .single()

    if (error) throw new Error(`Failed to save device: ${error.message}`)
    return data as DoctorLoginDeviceRow
  },

  async revokeDevice(supabase: SupabaseClient, id: string): Promise<void> {
    const { error } = await supabase
      .schema('doctor').from('doctor_login_devices')
      .update({ trusted_device: false })
      .eq('id', id)

    if (error) throw new Error(`Failed to revoke device: ${error.message}`)
  }
}
