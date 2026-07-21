import type { SupabaseClient } from '@supabase/supabase-js'
import { appointmentDocumentRepository } from '@/repositories/appointments/appointmentDocumentRepository'

export const appointmentDocumentService = {
  /**
   * The actual file upload (to Supabase Storage) must be done by the client-side component using createClient().
   * This service just writes the database record after a successful upload.
   * Assuming bucket is 'patient-documents'.
   */
  async linkDocument(
    supabase: SupabaseClient,
    clinicId: string,
    appointmentId: string,
    storagePath: string, // the path returned by supabase.storage.from('bucket').upload()
    documentType: string,
    remarks?: string
  ) {
    return await appointmentDocumentRepository.createDocumentRecord(supabase, {
      clinic_id: clinicId,
      appointment_id: appointmentId,
      attachment_id: storagePath,
      document_type: documentType,
      remarks: remarks || null
    })
  },

  async getDocuments(supabase: SupabaseClient, appointmentId: string) {
    return await appointmentDocumentRepository.getDocumentsByAppointmentId(supabase, appointmentId)
  },

  /**
   * Deletes the DB record and removes the file from Supabase Storage
   */
  async deleteDocument(supabase: SupabaseClient, documentId: string, storagePath: string) {
    // 1. Delete from storage bucket
    const { error: storageError } = await supabase.storage.from('patient-documents').remove([storagePath])
    if (storageError) {
      console.error('Failed to delete file from storage:', storageError.message)
      // Keep going to delete DB record anyway, or throw error based on strictness
    }

    // 2. Delete from DB
    await appointmentDocumentRepository.deleteDocumentRecord(supabase, documentId)
  }
}
