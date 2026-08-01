import type { SupabaseClient } from '@supabase/supabase-js'
import { radiologyScheduleRepository } from '@/repositories/radiology/radiologyScheduleRepository'
import type { ScheduleRadiologyPayload } from '@/types/radiology'

export const radiologyScheduleService = {
  async getScheduleByDate(supabase: SupabaseClient, clinicId: string, date: string) {
    return radiologyScheduleRepository.getScheduleByDate(supabase, clinicId, date)
  },

  async scheduleOrder(
    supabase: SupabaseClient,
    clinicId: string,
    payload: ScheduleRadiologyPayload
  ) {
    // Transactional conflict check and insertion via RPC
    const { data, error } = await supabase.rpc('schedule_radiology_transaction', {
      p_radiology_order_item_id: payload.radiology_order_item_id,
      p_scheduled_date: payload.scheduled_date,
      p_scheduled_time: payload.scheduled_time,
      p_room_id: payload.room_id || null,
      p_technician_id: payload.technician_id || null,
      p_estimated_duration: payload.estimated_duration || 30
    })

    if (error) throw new Error(error.message)
    return data
  },

  async updateScheduleStatus(
    supabase: SupabaseClient,
    clinicId: string,
    scheduleId: string,
    status: string
  ) {
    return radiologyScheduleRepository.updateScheduleStatus(supabase, scheduleId, status)
  }
}
