import type { SupabaseClient } from '@supabase/supabase-js'
import type { DoctorRow } from '@/types/doctors'

export const doctorRepository = {
  async getDoctors(supabase: SupabaseClient, clinicId: string): Promise<DoctorRow[]> {
    const { data, error } = await supabase
      .schema('doctor').from('doctors')
      .select('*')
      .eq('clinic_id', clinicId)
      .order('first_name', { ascending: true })

    if (error) throw new Error(`Failed to fetch doctors: ${error.message}`)
    return data as DoctorRow[]
  },

  async getDoctorById(supabase: SupabaseClient, clinicId: string, doctorId: string): Promise<DoctorRow | null> {
    const { data, error } = await supabase
      .schema('doctor').from('doctors')
      .select('*')
      .eq('clinic_id', clinicId)
      .eq('id', doctorId)
      .single()

    if (error) {
      if (error.code === 'PGRST116') return null
      throw new Error(`Failed to fetch doctor: ${error.message}`)
    }
    return data as DoctorRow
  },

  async createDoctor(supabase: SupabaseClient, payload: Partial<DoctorRow>): Promise<DoctorRow> {
    const { data, error } = await supabase
      .schema('doctor').from('doctors')
      .insert([payload])
      .select()
      .single()

    if (error) throw new Error(`Failed to create doctor: ${error.message}`)
    return data as DoctorRow
  },

  async updateDoctor(supabase: SupabaseClient, doctorId: string, payload: Partial<DoctorRow>): Promise<DoctorRow> {
    const { data, error } = await supabase
      .schema('doctor').from('doctors')
      .update({ ...payload, updated_at: new Date().toISOString() })
      .eq('id', doctorId)
      .select()
      .single()

    if (error) throw new Error(`Failed to update doctor: ${error.message}`)
    return data as DoctorRow
  }
}
