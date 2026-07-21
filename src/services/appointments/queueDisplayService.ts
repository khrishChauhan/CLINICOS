import type { SupabaseClient } from '@supabase/supabase-js'
import { queueDisplayRepository } from '@/repositories/appointments/queueDisplayRepository'

export const queueDisplayService = {
  async updateQueueDisplay(
    supabase: SupabaseClient, 
    clinicId: string, 
    doctorId: string, 
    tokenNumber: string | null,
    status: string,
    estimatedWait: number | null
  ) {
    return await queueDisplayRepository.upsertQueueDisplay(supabase, {
      clinic_id: clinicId,
      doctor_id: doctorId,
      token_number: tokenNumber,
      current_status: status,
      display_order: 1,
      estimated_wait: estimatedWait,
      last_updated: new Date().toISOString()
    })
  }
}
