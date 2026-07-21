import type { SupabaseClient } from '@supabase/supabase-js'
import type { FollowUpAppointmentRow } from '@/types/appointments'

export const followUpRepository = {
  async createFollowUp(supabase: SupabaseClient, payload: Omit<FollowUpAppointmentRow, 'id' | 'created_at'>) {
    const { data, error } = await supabase
      .from('follow_up_appointments')
      .insert([payload])
      .select()
      .single()
    if (error) throw new Error(error.message)
    return data as FollowUpAppointmentRow
  },

  async getFollowUpsByParentAppointment(supabase: SupabaseClient, parentAppointmentId: string) {
    const { data, error } = await supabase
      .from('follow_up_appointments')
      .select('*')
      .eq('parent_appointment_id', parentAppointmentId)
    if (error) throw new Error(error.message)
    return data as FollowUpAppointmentRow[]
  },

  async getFollowUpsForDoctor(supabase: SupabaseClient, clinicId: string, doctorId: string, limit = 50) {
    const { data, error } = await supabase
      .from('follow_up_appointments')
      .select('*, parent:appointments(patient_id)')
      .eq('clinic_id', clinicId)
      .eq('doctor_id', doctorId)
      .order('followup_date', { ascending: true })
      .limit(limit)
    if (error) throw new Error(error.message)
    return data as FollowUpAppointmentRow[]
  }
}
