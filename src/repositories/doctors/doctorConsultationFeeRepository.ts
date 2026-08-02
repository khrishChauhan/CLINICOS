import type { SupabaseClient } from '@supabase/supabase-js'
import type { DoctorConsultationFeeRow } from '@/types/doctors'

export const doctorConsultationFeeRepository = {
  async getFeesByDoctor(supabase: SupabaseClient, clinicId: string, doctorId: string): Promise<DoctorConsultationFeeRow[]> {
    const { data, error } = await supabase
      .from('doctor_consultation_fees')
      .select('*')
      .eq('clinic_id', clinicId)
      .eq('doctor_id', doctorId)
      .order('effective_from', { ascending: false })

    if (error) throw new Error(`Failed to fetch fees: ${error.message}`)
    return data as DoctorConsultationFeeRow[]
  },

  async createFee(supabase: SupabaseClient, payload: Partial<DoctorConsultationFeeRow>): Promise<DoctorConsultationFeeRow> {
    const { data, error } = await supabase
      .from('doctor_consultation_fees')
      .insert([payload])
      .select()
      .single()

    if (error) throw new Error(`Failed to create fee: ${error.message}`)
    return data as DoctorConsultationFeeRow
  },

  async updateFeeStatus(supabase: SupabaseClient, id: string, status: string): Promise<void> {
    const { error } = await supabase
      .from('doctor_consultation_fees')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', id)

    if (error) throw new Error(`Failed to update fee status: ${error.message}`)
  }
}
