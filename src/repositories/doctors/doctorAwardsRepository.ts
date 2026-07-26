import type { SupabaseClient } from '@supabase/supabase-js'
import type { DoctorAwardRow } from '@/types/doctors'

export const doctorAwardsRepository = {
  async getAwardsByDoctor(supabase: SupabaseClient, clinicId: string, doctorId: string): Promise<DoctorAwardRow[]> {
    const { data, error } = await supabase
      .schema('doctor')
      .from('doctor_awards')
      .select('*')
      .eq('clinic_id', clinicId)
      .eq('doctor_id', doctorId)
      .order('award_date', { ascending: false })

    if (error) throw new Error(`Failed to fetch awards: ${error.message}`)
    return data as DoctorAwardRow[]
  },

  async createAward(supabase: SupabaseClient, payload: Partial<DoctorAwardRow>): Promise<DoctorAwardRow> {
    const { data, error } = await supabase
      .schema('doctor')
      .from('doctor_awards')
      .insert([payload])
      .select()
      .single()

    if (error) throw new Error(`Failed to save award: ${error.message}`)
    return data as DoctorAwardRow
  },

  async deleteAward(supabase: SupabaseClient, id: string): Promise<void> {
    const { error } = await supabase
      .schema('doctor')
      .from('doctor_awards')
      .delete()
      .eq('id', id)

    if (error) throw new Error(`Failed to delete award: ${error.message}`)
  }
}
