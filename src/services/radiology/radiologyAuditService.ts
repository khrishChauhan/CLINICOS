import type { SupabaseClient } from '@supabase/supabase-js'
import { radiologyAuditRepository } from '@/repositories/radiology/radiologyAuditRepository'
import type { RadiologyAuditRow } from '@/types/radiology'

export const radiologyAuditService = {
  async getAuditTimeline(supabase: SupabaseClient, clinicId: string) {
    return radiologyAuditRepository.getAuditLogs(supabase, clinicId, 1000)
  },

  async logEvent(
    supabase: SupabaseClient,
    clinicId: string,
    orderId: string,
    action: string,
    actionBy: string,
    previousValue?: any,
    newValue?: any
  ) {
    return radiologyAuditRepository.logAction(supabase, {
      clinic_id: clinicId,
      radiology_order_id: orderId,
      action,
      action_by: actionBy,
      previous_value: previousValue,
      new_value: newValue
    })
  }
}
