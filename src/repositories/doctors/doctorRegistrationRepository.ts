import type { SupabaseClient } from '@supabase/supabase-js'
import type { DoctorRegistrationRow } from '@/types/doctors'

export const doctorRegistrationRepository = {
  async getRegistrationsByDoctor(supabase: SupabaseClient, clinicId: string, doctorId: string): Promise<DoctorRegistrationRow[]> {
    const { data, error } = await supabase
      .from('doctor_registrations')
      .select('*')
      .eq('clinic_id', clinicId)
      .eq('doctor_id', doctorId)

    if (error) throw new Error(`Failed to fetch registrations: ${error.message}`)
    return data as DoctorRegistrationRow[]
  },

  async createRegistration(supabase: SupabaseClient, payload: Partial<DoctorRegistrationRow>): Promise<DoctorRegistrationRow> {
    const { data, error } = await supabase
      .from('doctor_registrations')
      .insert([payload])
      .select()
      .single()

    if (error) throw new Error(`Failed to create registration: ${error.message}`)
    return data as DoctorRegistrationRow
  },

  async deleteRegistration(supabase: SupabaseClient, id: string): Promise<void> {
    const { error } = await supabase
      .from('doctor_registrations')
      .delete()
      .eq('id', id)

    if (error) throw new Error(`Failed to delete registration: ${error.message}`)
  }
}
