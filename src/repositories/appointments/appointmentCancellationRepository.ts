import type { SupabaseClient } from '@supabase/supabase-js'
import type { AppointmentCancellationRow } from '@/types/appointments'

export const appointmentCancellationRepository = {
  async createCancellationRecord(supabase: SupabaseClient, payload: Omit<AppointmentCancellationRow, 'id' | 'cancelled_at'>) {
    const { data, error } = await supabase
      .from('appointment_cancellation')
      .insert([payload])
      .select()
      .single()
    if (error) throw new Error(error.message)
    return data as AppointmentCancellationRow
  },

  async getCancellationByAppointmentId(supabase: SupabaseClient, appointmentId: string) {
    const { data, error } = await supabase
      .from('appointment_cancellation')
      .select('*')
      .eq('appointment_id', appointmentId)
      .single()
    if (error && error.code !== 'PGRST116') throw new Error(error.message)
    return data as AppointmentCancellationRow | null
  }
}
