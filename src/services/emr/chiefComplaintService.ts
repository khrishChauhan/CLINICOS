import type { SupabaseClient } from '@supabase/supabase-js'
import { chiefComplaintRepository } from '@/repositories/emr/chiefComplaintRepository'
import type { ChiefComplaintRow } from '@/types/emr'

export const chiefComplaintService = {
  async getAll(supabase: SupabaseClient, visitId: string): Promise<ChiefComplaintRow[]> {
    return await chiefComplaintRepository.getByVisitId(supabase, visitId)
  },

  async add(
    supabase: SupabaseClient,
    clinicId: string,
    visitId: string,
    payload: { complaint: string; duration?: string; severity?: 'Mild' | 'Moderate' | 'Severe'; remarks?: string }
  ): Promise<ChiefComplaintRow> {
    if (!payload.complaint?.trim()) throw new Error('Complaint text is required')
    return await chiefComplaintRepository.create(supabase, {
      clinic_id: clinicId,
      visit_id: visitId,
      complaint: payload.complaint.trim(),
      duration: payload.duration ?? null,
      severity: payload.severity ?? null,
      remarks: payload.remarks ?? null
    })
  },

  async remove(supabase: SupabaseClient, id: string): Promise<void> {
    await chiefComplaintRepository.delete(supabase, id)
  }
}
