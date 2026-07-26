import type { SupabaseClient } from '@supabase/supabase-js'
import { soapNoteRepository } from '@/repositories/emr/soapNoteRepository'
import type { SoapNoteRow } from '@/types/emr'

export const soapNoteService = {
  async getOrInit(supabase: SupabaseClient, clinicId: string, visitId: string, userId: string): Promise<SoapNoteRow> {
    const existing = await soapNoteRepository.getByVisitId(supabase, visitId)
    if (existing) return existing

    // Initialize empty SOAP note on first access
    return await soapNoteRepository.upsert(supabase, {
      clinic_id: clinicId,
      visit_id: visitId,
      created_by: userId,
      subjective: null,
      objective: null,
      assessment: null,
      plan: null
    })
  },

  async save(
    supabase: SupabaseClient,
    clinicId: string,
    visitId: string,
    userId: string,
    content: { subjective?: string; objective?: string; assessment?: string; plan?: string }
  ): Promise<SoapNoteRow> {
    return await soapNoteRepository.upsert(supabase, {
      clinic_id: clinicId,
      visit_id: visitId,
      created_by: userId,
      ...content
    })
  }
}
