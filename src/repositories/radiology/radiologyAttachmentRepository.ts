import type { SupabaseClient } from '@supabase/supabase-js'
import type { RadiologyAttachmentRow } from '@/types/radiology'

export const radiologyAttachmentRepository = {
  async getAttachmentsByOrderId(supabase: SupabaseClient, clinicId: string, orderId: string) {
    const { data, error } = await supabase
      .from('radiology_attachments')
      .select('*, attachment:file_attachments(*)')
      .eq('clinic_id', clinicId)
      .eq('radiology_order_id', orderId)
      .is('deleted_at', null)
      .order('uploaded_at', { ascending: false })

    if (error) throw new Error(error.message)
    return data as RadiologyAttachmentRow[]
  },

  async createAttachmentRecord(
    supabase: SupabaseClient,
    payload: Omit<RadiologyAttachmentRow, 'id' | 'uploaded_at' | 'created_at' | 'updated_at' | 'deleted_at' | 'attachment'>
  ) {
    const { data, error } = await supabase
      .from('radiology_attachments')
      .insert([payload])
      .select('*, attachment:file_attachments(*)')
      .single()

    if (error) throw new Error(error.message)
    return data as RadiologyAttachmentRow
  },

  async deleteAttachmentRecord(
    supabase: SupabaseClient,
    clinicId: string,
    attachmentId: string
  ) {
    // Soft delete strategy
    const { error } = await supabase
      .from('radiology_attachments')
      .update({ deleted_at: new Date().toISOString() })
      .eq('clinic_id', clinicId)
      .eq('id', attachmentId)

    if (error) throw new Error(error.message)
    return true
  }
}
