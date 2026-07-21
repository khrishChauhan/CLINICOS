import type { SupabaseClient } from '@supabase/supabase-js'
import type { AppointmentRescheduleRow } from '@/types/appointments'

export const appointmentRescheduleRepository = {
  async createRescheduleRecord(supabase: SupabaseClient, payload: Omit<AppointmentRescheduleRow, 'id' | 'rescheduled_at'>) {
    const { data, error } = await supabase
      .from('appointment_reschedule')
      .insert([payload])
      .select()
      .single()
    if (error) throw new Error(error.message)
    return data as AppointmentRescheduleRow
  },

  async getReschedulesByAppointmentId(supabase: SupabaseClient, appointmentId: string) {
    const { data, error } = await supabase
      .from('appointment_reschedule')
      .select('*')
      .eq('appointment_id', appointmentId)
      .order('rescheduled_at', { ascending: false })
    if (error) throw new Error(error.message)
    return data as AppointmentRescheduleRow[]
  }
}
