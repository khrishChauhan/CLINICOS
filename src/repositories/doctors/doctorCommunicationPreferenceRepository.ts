import type { SupabaseClient } from '@supabase/supabase-js'
import type { DoctorCommunicationPreferenceRow } from '@/types/doctors'

export const doctorCommunicationPreferenceRepository = {
  async getPreferencesByDoctor(supabase: SupabaseClient, clinicId: string, doctorId: string): Promise<DoctorCommunicationPreferenceRow | null> {
    const { data, error } = await supabase
      .schema('doctor').from('doctor_communication_preferences')
      .select('*')
      .eq('clinic_id', clinicId)
      .eq('doctor_id', doctorId)
      .single()

    if (error && error.code !== 'PGRST116') throw new Error(`Failed to fetch preferences: ${error.message}`)
    return data as DoctorCommunicationPreferenceRow | null
  },

  async upsertPreferences(supabase: SupabaseClient, payload: Partial<DoctorCommunicationPreferenceRow>): Promise<DoctorCommunicationPreferenceRow> {
    const { data, error } = await supabase
      .schema('doctor').from('doctor_communication_preferences')
      .upsert(payload, { onConflict: 'doctor_id' })
      .select()
      .single()

    if (error) throw new Error(`Failed to update preferences: ${error.message}`)
    return data as DoctorCommunicationPreferenceRow
  }
}
