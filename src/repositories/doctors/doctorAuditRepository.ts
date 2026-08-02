import type { SupabaseClient } from '@supabase/supabase-js'
import type { DoctorAuditRow } from '@/types/doctors'

export const doctorAuditRepository = {
  async getAuditTimeline(supabase: SupabaseClient, clinicId: string, doctorId: string): Promise<DoctorAuditRow[]> {
    const { data, error } = await supabase
      .schema('doctor').from('doctor_audit')
      .select('*')
      .eq('clinic_id', clinicId)
      .eq('doctor_id', doctorId)
      .order('action_time', { ascending: false })

    if (error) throw new Error(`Failed to fetch audit logs: ${error.message}`)
    return data as DoctorAuditRow[]
  },

  async logAction(supabase: SupabaseClient, payload: Partial<DoctorAuditRow>): Promise<DoctorAuditRow> {
    const { data, error } = await supabase
      .schema('doctor').from('doctor_audit')
      .insert([payload])
      .select()
      .single()

    if (error) throw new Error(`Failed to write audit log: ${error.message}`)
    return data as DoctorAuditRow
  }
}
