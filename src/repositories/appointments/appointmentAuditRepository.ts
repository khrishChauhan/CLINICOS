import type { SupabaseClient } from '@supabase/supabase-js'
import type { AppointmentAuditRow } from '@/types/appointments'

export const appointmentAuditRepository = {
  async createAuditLog(supabase: SupabaseClient, payload: Omit<AppointmentAuditRow, 'id' | 'timestamp' | 'created_at'>) {
    // Note: Due to RLS, this table ONLY allows inserts and selects. Updates and Deletes are explicitly denied.
    const { data, error } = await supabase
      .from('appointment_audit')
      .insert([payload])
      .select()
      .single()
    if (error) throw new Error(error.message)
    return data as AppointmentAuditRow
  },

  async getAuditLogsByAppointment(supabase: SupabaseClient, appointmentId: string) {
    const { data, error } = await supabase
      .from('appointment_audit')
      .select('*, performed_by:users(first_name, last_name, role)') // join for UI display
      .eq('appointment_id', appointmentId)
      .order('timestamp', { ascending: false })
    if (error) throw new Error(error.message)
    return data as (AppointmentAuditRow & { performed_by: any })[]
  }
}
