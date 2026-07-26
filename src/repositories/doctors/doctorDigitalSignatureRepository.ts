import type { SupabaseClient } from '@supabase/supabase-js'
import type { DoctorDigitalSignatureRow } from '@/types/doctors'

export const doctorDigitalSignatureRepository = {
  async getSignaturesByDoctor(supabase: SupabaseClient, clinicId: string, doctorId: string): Promise<DoctorDigitalSignatureRow[]> {
    const { data, error } = await supabase
      .schema('doctor')
      .from('doctor_digital_signature')
      .select('*')
      .eq('clinic_id', clinicId)
      .eq('doctor_id', doctorId)
      .order('created_at', { ascending: false })

    if (error) throw new Error(`Failed to fetch signatures: ${error.message}`)
    return data as DoctorDigitalSignatureRow[]
  },

  async createSignature(supabase: SupabaseClient, payload: Partial<DoctorDigitalSignatureRow>): Promise<DoctorDigitalSignatureRow> {
    const { data, error } = await supabase
      .schema('doctor')
      .from('doctor_digital_signature')
      .insert([payload])
      .select()
      .single()

    if (error) throw new Error(`Failed to save signature metadata: ${error.message}`)
    return data as DoctorDigitalSignatureRow
  },

  async deleteSignature(supabase: SupabaseClient, id: string): Promise<void> {
    const { error } = await supabase
      .schema('doctor')
      .from('doctor_digital_signature')
      .delete()
      .eq('id', id)

    if (error) throw new Error(`Failed to delete signature: ${error.message}`)
  }
}
