import type { SupabaseClient } from '@supabase/supabase-js'
import type { AppointmentNotificationRow } from '@/types/appointments'

export const appointmentNotificationRepository = {
  async createNotification(supabase: SupabaseClient, payload: Omit<AppointmentNotificationRow, 'id' | 'created_at' | 'updated_at'>) {
    const { data, error } = await supabase
      .from('appointment_notifications')
      .insert([payload])
      .select()
      .single()
    if (error) throw new Error(error.message)
    return data as AppointmentNotificationRow
  },

  async getNotificationsByAppointmentId(supabase: SupabaseClient, appointmentId: string) {
    const { data, error } = await supabase
      .from('appointment_notifications')
      .select('*')
      .eq('appointment_id', appointmentId)
      .order('created_at', { ascending: false })
    if (error) throw new Error(error.message)
    return data as AppointmentNotificationRow[]
  },

  async updateNotificationStatus(supabase: SupabaseClient, id: string, status: string, deliveredAt?: string) {
    const { data, error } = await supabase
      .from('appointment_notifications')
      .update({ notification_status: status, delivered_at: deliveredAt || null, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single()
    if (error) throw new Error(error.message)
    return data as AppointmentNotificationRow
  }
}
