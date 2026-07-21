import type { SupabaseClient } from '@supabase/supabase-js'
import type { AppointmentStatusHistoryRow } from '@/types/appointments'

export const appointmentHistoryRepository = {
  async createHistoryRecord(supabase: SupabaseClient, payload: Omit<AppointmentStatusHistoryRow, 'id' | 'changed_at'>) {
    const { data, error } = await supabase
      .from('appointment_status_history')
      .insert([payload])
      .select()
      .single()
    if (error) throw new Error(error.message)
    return data as AppointmentStatusHistoryRow
  },

  async getHistoryByAppointmentId(supabase: SupabaseClient, appointmentId: string) {
    const { data, error } = await supabase
      .from('appointment_status_history')
      .select('*')
      .eq('appointment_id', appointmentId)
      .order('changed_at', { ascending: true })
    if (error) throw new Error(error.message)
    return data as AppointmentStatusHistoryRow[]
  }
}
