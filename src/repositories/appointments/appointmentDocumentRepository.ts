import type { SupabaseClient } from '@supabase/supabase-js'
import type { AppointmentDocumentRow } from '@/types/appointments'

export const appointmentDocumentRepository = {
  async createDocumentRecord(supabase: SupabaseClient, payload: Omit<AppointmentDocumentRow, 'id' | 'uploaded_at'>) {
    const { data, error } = await supabase
      .from('appointment_documents')
      .insert([payload])
      .select()
      .single()
    if (error) throw new Error(error.message)
    return data as AppointmentDocumentRow
  },

  async getDocumentsByAppointmentId(supabase: SupabaseClient, appointmentId: string) {
    const { data, error } = await supabase
      .from('appointment_documents')
      .select('*')
      .eq('appointment_id', appointmentId)
      .order('uploaded_at', { ascending: false })
    if (error) throw new Error(error.message)
    return data as AppointmentDocumentRow[]
  },

  async deleteDocumentRecord(supabase: SupabaseClient, id: string) {
    const { error } = await supabase
      .from('appointment_documents')
      .delete()
      .eq('id', id)
    if (error) throw new Error(error.message)
  }
}
