import type { SupabaseClient } from '@supabase/supabase-js'
import type { AppointmentReminderRow } from '@/types/appointments'

export const appointmentReminderRepository = {
  async createReminder(supabase: SupabaseClient, payload: Omit<AppointmentReminderRow, 'id' | 'created_at' | 'updated_at'>) {
    const { data, error } = await supabase
      .from('appointment_reminders')
      .insert([payload])
      .select()
      .single()
    if (error) throw new Error(error.message)
    return data as AppointmentReminderRow
  },

  async getRemindersByAppointmentId(supabase: SupabaseClient, appointmentId: string) {
    const { data, error } = await supabase
      .from('appointment_reminders')
      .select('*')
      .eq('appointment_id', appointmentId)
      .order('scheduled_time', { ascending: true })
    if (error) throw new Error(error.message)
    return data as AppointmentReminderRow[]
  },

  async updateReminderStatus(supabase: SupabaseClient, id: string, status: string, sentTime?: string) {
    const { data, error } = await supabase
      .from('appointment_reminders')
      .update({ delivery_status: status, sent_time: sentTime || null, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single()
    if (error) throw new Error(error.message)
    return data as AppointmentReminderRow
  }
}
