import type { SupabaseClient } from '@supabase/supabase-js'
import { doctorDocumentRepository } from '@/repositories/doctors/doctorDocumentRepository'

export const doctorDocumentService = {
  async getDocumentsWithUrls(supabase: SupabaseClient, clinicId: string, doctorId: string) {
    const documents = await doctorDocumentRepository.getDocumentsByDoctor(supabase, clinicId, doctorId)
    
    // Convert direct file_path into short-lived Signed URLs
    const documentsWithUrls = await Promise.all(documents.map(async (doc) => {
      if (!doc.file_path) return { ...doc, signedUrl: null }
      const { data } = await supabase.storage.from('clinicos-assets').createSignedUrl(doc.file_path, 3600) // 1 hour expiry
      return {
        ...doc,
        signedUrl: data?.signedUrl || null
      }
    }))

    return documentsWithUrls
  }
}
