import type { SupabaseClient } from '@supabase/supabase-js'
import { radiologyAttachmentRepository } from '@/repositories/radiology/radiologyAttachmentRepository'
import { radiologyAuditRepository } from '@/repositories/radiology/radiologyAuditRepository'

export const radiologyAttachmentService = {
  async getAttachments(supabase: SupabaseClient, clinicId: string, orderId: string) {
    return radiologyAttachmentRepository.getAttachmentsByOrderId(supabase, clinicId, orderId)
  },

  async uploadAttachment(
    supabase: SupabaseClient,
    clinicId: string,
    orderId: string,
    uploaderId: string,
    file: File,
    documentType: string,
    remarks?: string
  ) {
    // 1. Upload to Supabase Storage (Private radiology_attachments bucket)
    const storagePath = `${clinicId}/${orderId}/${Date.now()}_${file.name}`
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('radiology_attachments')
      .upload(storagePath, file, { contentType: file.type, upsert: false })

    if (uploadError) throw new Error(`Upload failed: ${uploadError.message}`)

    // 2. Create Global file_attachments record
    const { data: fileAttachment, error: dbError } = await supabase
      .from('file_attachments')
      .insert([{
        clinic_id: clinicId,
        module_name: 'Radiology',
        reference_table: 'radiology_orders',
        reference_id: orderId,
        file_name: file.name,
        original_file_name: file.name,
        mime_type: file.type,
        file_size_bytes: file.size,
        storage_provider: 'supabase',
        file_path: uploadData.path,
        uploaded_by: uploaderId
      }])
      .select()
      .single()

    if (dbError) throw new Error(`File mapping failed: ${dbError.message}`)

    // 3. Create Radiology Attachment Reference
    const attachment = await radiologyAttachmentRepository.createAttachmentRecord(supabase, {
      clinic_id: clinicId,
      radiology_order_id: orderId,
      attachment_id: fileAttachment.id,
      document_type: documentType,
      remarks
    })

    // 4. Audit Log
    await radiologyAuditRepository.logAction(supabase, {
      clinic_id: clinicId,
      radiology_order_id: orderId,
      action: 'Attachment Uploaded',
      action_by: uploaderId,
      new_value: { document_type: documentType, file_name: file.name }
    })

    return attachment
  },

  async getSignedUrl(supabase: SupabaseClient, storagePath: string) {
    const { data, error } = await supabase.storage
      .from('radiology_attachments')
      .createSignedUrl(storagePath, 60 * 5) // 5 minutes

    if (error) throw new Error(error.message)
    return data.signedUrl
  },

  async deleteAttachment(supabase: SupabaseClient, clinicId: string, attachmentId: string, orderId: string, userId: string) {
    await radiologyAttachmentRepository.deleteAttachmentRecord(supabase, clinicId, attachmentId)
    
    // Audit Log
    await radiologyAuditRepository.logAction(supabase, {
      clinic_id: clinicId,
      radiology_order_id: orderId,
      action: 'Attachment Deleted',
      action_by: userId,
      previous_value: { attachment_id: attachmentId }
    })
    return true
  }
}
