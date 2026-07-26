import type { SupabaseClient } from '@supabase/supabase-js'
import { clinicalAttachmentRepository } from '@/repositories/emr/clinicalAttachmentRepository'
import type { ClinicalAttachmentRow } from '@/types/emr'

const MAX_FILE_SIZE = 50 * 1024 * 1024 // 50MB
const ALLOWED_MIME_TYPES = [
  'image/jpeg',
  'image/png',
  'application/pdf',
  'application/dicom',
  'image/dicom'
]

export const clinicalAttachmentService = {
  async getAll(supabase: SupabaseClient, visitId: string): Promise<ClinicalAttachmentRow[]> {
    return await clinicalAttachmentRepository.getByVisit(supabase, visitId)
  },

  async uploadFile(
    supabase: SupabaseClient,
    clinicId: string,
    visitId: string,
    userId: string,
    file: File,
    attachmentType: string,
    remarks?: string
  ): Promise<ClinicalAttachmentRow> {
    // 1. Validate File Size
    if (file.size > MAX_FILE_SIZE) {
      throw new Error(`File size exceeds the 50MB limit. Uploaded size: ${(file.size / 1024 / 1024).toFixed(2)}MB`)
    }

    // 2. Validate MIME Type (Server Action level safety)
    const mime = file.type || 'application/octet-stream'
    
    // We allow explicit valid types or file extensions matching our rules if MIME is empty/generic (e.g., .dcm)
    const isDicomExt = file.name.toLowerCase().endsWith('.dcm')
    
    if (!ALLOWED_MIME_TYPES.includes(mime) && !isDicomExt) {
      throw new Error(`Invalid file type. Only JPEG, PNG, PDF, and DICOM are allowed. Received: ${mime}`)
    }

    // 3. Upload to Supabase Storage (reusing 'patient-documents' bucket)
    const ext = file.name.split('.').pop() || ''
    const storagePath = `emr_attachments/${visitId}/${Date.now()}_${Math.random().toString(36).substring(7)}.${ext}`

    const { error: uploadError } = await supabase.storage
      .from('patient-documents')
      .upload(storagePath, file, { upsert: false })

    if (uploadError) {
      throw new Error(`Storage upload failed: ${uploadError.message}`)
    }

    // 4. Record metadata in DB
    return await clinicalAttachmentRepository.create(supabase, {
      clinic_id: clinicId,
      visit_id: visitId,
      attachment_path: storagePath,
      attachment_type: attachmentType,
      file_name: file.name,
      file_size: file.size,
      mime_type: isDicomExt ? 'application/dicom' : mime,
      remarks: remarks || null,
      uploaded_by: userId
    })
  },

  async remove(supabase: SupabaseClient, id: string): Promise<void> {
    const attachment = await clinicalAttachmentRepository.getById(supabase, id)
    if (!attachment) throw new Error('Attachment not found')

    // Remove from storage
    const { error: deleteError } = await supabase.storage
      .from('patient-documents')
      .remove([attachment.attachment_path])
      
    if (deleteError) {
      console.warn(`Failed to delete storage file ${attachment.attachment_path}: ${deleteError.message}`)
      // Proceed to delete DB record anyway to avoid orphaned DB rows if storage file was already deleted manually
    }

    await clinicalAttachmentRepository.delete(supabase, id)
  }
}
