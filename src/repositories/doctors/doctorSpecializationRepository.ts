import type { SupabaseClient } from '@supabase/supabase-js'
import type { DoctorSpecializationRow } from '@/types/doctors'

export const doctorSpecializationRepository = {
  async getSpecializationsByDoctor(supabase: SupabaseClient, clinicId: string, doctorId: string): Promise<DoctorSpecializationRow[]> {
    const { data, error } = await supabase
      .schema('doctor').from('doctor_specializations')
      .select('*')
      .eq('clinic_id', clinicId)
      .eq('doctor_id', doctorId)
      .order('primary_specialization', { ascending: false })

    if (error) throw new Error(`Failed to fetch specializations: ${error.message}`)
    return data as DoctorSpecializationRow[]
  },

  async createSpecialization(supabase: SupabaseClient, payload: Partial<DoctorSpecializationRow>): Promise<DoctorSpecializationRow> {
    const { data, error } = await supabase
      .schema('doctor').from('doctor_specializations')
      .insert([payload])
      .select()
      .single()

    if (error) throw new Error(`Failed to create specialization: ${error.message}`)
    return data as DoctorSpecializationRow
  },

  async deleteSpecialization(supabase: SupabaseClient, id: string): Promise<void> {
    const { error } = await supabase
      .schema('doctor').from('doctor_specializations')
      .delete()
      .eq('id', id)

    if (error) throw new Error(`Failed to delete specialization: ${error.message}`)
  }
}
