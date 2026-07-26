import type { SupabaseClient } from '@supabase/supabase-js'
import { doctorDigitalSignatureRepository } from '@/repositories/doctors/doctorDigitalSignatureRepository'

export const doctorDigitalSignatureService = {
  async getSignaturesWithUrls(supabase: SupabaseClient, clinicId: string, doctorId: string) {
    const signatures = await doctorDigitalSignatureRepository.getSignaturesByDoctor(supabase, clinicId, doctorId)
    
    // Convert direct file_path into short-lived Signed URLs
    const signaturesWithUrls = await Promise.all(signatures.map(async (sig) => {
      if (!sig.file_path) return { ...sig, signedUrl: null }
      const { data } = await supabase.storage.from('clinicos-assets').createSignedUrl(sig.file_path, 3600) // 1 hour expiry
      return {
        ...sig,
        signedUrl: data?.signedUrl || null
      }
    }))

    return signaturesWithUrls
  }
}
