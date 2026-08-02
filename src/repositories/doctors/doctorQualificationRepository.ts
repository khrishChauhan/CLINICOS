import type { SupabaseClient } from '@supabase/supabase-js'
import type { DoctorQualificationRow } from '@/types/doctors'

export const doctorQualificationRepository = {
  async getQualificationsByDoctor(supabase: SupabaseClient, clinicId: string, doctorId: string): Promise<DoctorQualificationRow[]> {
    const { data, error } = await supabase
      .schema('doctor').from('doctor_qualifications')
      .select('*')
      .eq('clinic_id', clinicId)
      .eq('doctor_id', doctorId)
      .order('passing_year', { ascending: false })

    if (error) throw new Error(`Failed to fetch qualifications: ${error.message}`)
    return data as DoctorQualificationRow[]
  },

  async createQualification(supabase: SupabaseClient, payload: Partial<DoctorQualificationRow>): Promise<DoctorQualificationRow> {
    const { data, error } = await supabase
      .schema('doctor').from('doctor_qualifications')
      .insert([payload])
      .select()
      .single()

    if (error) throw new Error(`Failed to create qualification: ${error.message}`)
    return data as DoctorQualificationRow
  },

  async deleteQualification(supabase: SupabaseClient, id: string): Promise<void> {
    const { error } = await supabase
      .schema('doctor').from('doctor_qualifications')
      .delete()
      .eq('id', id)

    if (error) throw new Error(`Failed to delete qualification: ${error.message}`)
  }
}
