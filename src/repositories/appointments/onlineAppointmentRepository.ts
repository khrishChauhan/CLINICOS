import type { SupabaseClient } from '@supabase/supabase-js'
import type { OnlineAppointmentRow } from '@/types/appointments'

export const onlineAppointmentRepository = {
  async createOnlineAppointment(supabase: SupabaseClient, payload: Omit<OnlineAppointmentRow, 'id' | 'created_at' | 'updated_at'>) {
    const { data, error } = await supabase
      .from('online_appointments')
      .insert([payload])
      .select()
      .single()
    if (error) throw new Error(error.message)
    return data as OnlineAppointmentRow
  },

  async getOnlineAppointment(supabase: SupabaseClient, appointmentId: string) {
    const { data, error } = await supabase
      .from('online_appointments')
      .select('*')
      .eq('appointment_id', appointmentId)
      .single()
    if (error && error.code !== 'PGRST116') throw new Error(error.message)
    return data as OnlineAppointmentRow | null
  },

  async confirmBooking(supabase: SupabaseClient, id: string) {
    const { data, error } = await supabase
      .from('online_appointments')
      .update({ confirmation_status: 'Confirmed', confirmed_at: new Date().toISOString(), updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single()
    if (error) throw new Error(error.message)
    return data as OnlineAppointmentRow
  }
}
