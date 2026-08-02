import type { SupabaseClient } from '@supabase/supabase-js'
import type { DoctorDocumentRow } from '@/types/doctors'

export const doctorDocumentRepository = {
  async getDocumentsByDoctor(supabase: SupabaseClient, clinicId: string, doctorId: string): Promise<DoctorDocumentRow[]> {
    const { data, error } = await supabase
      .schema('doctor').from('doctor_documents')
      .select('*')
      .eq('clinic_id', clinicId)
      .eq('doctor_id', doctorId)
      .order('uploaded_at', { ascending: false })

    if (error) throw new Error(`Failed to fetch documents: ${error.message}`)
    return data as DoctorDocumentRow[]
  },

  async createDocument(supabase: SupabaseClient, payload: Partial<DoctorDocumentRow>): Promise<DoctorDocumentRow> {
    const { data, error } = await supabase
      .schema('doctor').from('doctor_documents')
      .insert([payload])
      .select()
      .single()

    if (error) throw new Error(`Failed to save document metadata: ${error.message}`)
    return data as DoctorDocumentRow
  },

  async deleteDocument(supabase: SupabaseClient, id: string): Promise<void> {
    const { error } = await supabase
      .schema('doctor').from('doctor_documents')
      .delete()
      .eq('id', id)

    if (error) throw new Error(`Failed to delete document: ${error.message}`)
  }
}
