import type { SupabaseClient } from '@supabase/supabase-js'
import { doctorAuditRepository } from '@/repositories/doctors/doctorAuditRepository'

export const doctorAuditService = {
  async log(
    supabase: SupabaseClient, 
    clinicId: string, 
    doctorId: string, 
    actionBy: string, 
    action: string, 
    previousValue?: any, 
    newValue?: any, 
    ipAddress?: string, 
    metadata?: any
  ) {
    return await doctorAuditRepository.logAction(supabase, {
      clinic_id: clinicId,
      doctor_id: doctorId,
      action,
      action_by: actionBy,
      previous_value: previousValue,
      new_value: newValue,
      ip_address: ipAddress,
      metadata
    })
  }
}
