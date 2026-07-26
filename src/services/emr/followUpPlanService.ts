import type { SupabaseClient } from '@supabase/supabase-js'
import { followUpPlanRepository } from '@/repositories/emr/followUpPlanRepository'
import type { FollowUpPlanRow } from '@/types/emr'

export const followUpPlanService = {
  async get(supabase: SupabaseClient, visitId: string): Promise<FollowUpPlanRow | null> {
    return await followUpPlanRepository.getByVisit(supabase, visitId)
  },

  async save(
    supabase: SupabaseClient,
    clinicId: string,
    visitId: string,
    payload: {
      followup_date: string
      followup_reason?: string
      instructions?: string
      reminder_required?: boolean
    }
  ): Promise<FollowUpPlanRow> {
    if (!payload.followup_date) throw new Error('Follow up date is required')

    return await followUpPlanRepository.upsert(supabase, {
      clinic_id: clinicId,
      visit_id: visitId,
      followup_date: payload.followup_date,
      followup_reason: payload.followup_reason || null,
      instructions: payload.instructions || null,
      reminder_required: payload.reminder_required ?? false
    })
  }
}
