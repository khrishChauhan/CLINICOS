import type { SupabaseClient } from '@supabase/supabase-js'
import type { DoctorLanguageRow } from '@/types/doctors'

export const doctorLanguagesRepository = {
  async getLanguagesByDoctor(supabase: SupabaseClient, clinicId: string, doctorId: string): Promise<DoctorLanguageRow[]> {
    const { data, error } = await supabase
      .schema('doctor')
      .from('doctor_languages')
      .select('*')
      .eq('clinic_id', clinicId)
      .eq('doctor_id', doctorId)

    if (error) throw new Error(`Failed to fetch languages: ${error.message}`)
    return data as DoctorLanguageRow[]
  },

  async addLanguage(supabase: SupabaseClient, payload: Partial<DoctorLanguageRow>): Promise<DoctorLanguageRow> {
    const { data, error } = await supabase
      .schema('doctor')
      .from('doctor_languages')
      .insert([payload])
      .select()
      .single()

    if (error) throw new Error(`Failed to add language: ${error.message}`)
    return data as DoctorLanguageRow
  },

  async removeLanguage(supabase: SupabaseClient, id: string): Promise<void> {
    const { error } = await supabase
      .schema('doctor')
      .from('doctor_languages')
      .delete()
      .eq('id', id)

    if (error) throw new Error(`Failed to remove language: ${error.message}`)
  }
}
