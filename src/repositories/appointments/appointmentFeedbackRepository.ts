import type { SupabaseClient } from '@supabase/supabase-js'
import type { AppointmentFeedbackRow } from '@/types/appointments'

export const appointmentFeedbackRepository = {
  async submitFeedback(supabase: SupabaseClient, payload: Omit<AppointmentFeedbackRow, 'id' | 'submitted_at' | 'created_at'>) {
    const { data, error } = await supabase
      .from('appointment_feedback')
      .insert([payload])
      .select()
      .single()
    if (error) throw new Error(error.message)
    return data as AppointmentFeedbackRow
  },

  async getFeedbackByAppointment(supabase: SupabaseClient, appointmentId: string) {
    const { data, error } = await supabase
      .from('appointment_feedback')
      .select('*')
      .eq('appointment_id', appointmentId)
      .single()
    if (error && error.code !== 'PGRST116') throw new Error(error.message)
    return data as AppointmentFeedbackRow | null
  },

  async getFeedbackByClinic(supabase: SupabaseClient, clinicId: string) {
    const { data, error } = await supabase
      .from('appointment_feedback')
      .select('*')
      .eq('clinic_id', clinicId)
      .order('submitted_at', { ascending: false })
      .limit(100)
    if (error) throw new Error(error.message)
    return data as AppointmentFeedbackRow[]
  }
}
