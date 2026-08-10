import type { SupabaseClient } from '@supabase/supabase-js'
import type { EMRAuditRow } from '@/types/emr'

export const emrAuditRepository = {
  async getByPatient(supabase: SupabaseClient, patientId: string): Promise<EMRAuditRow[]> {
    const { data, error } = await supabase
      
      .from('emr_audit')
      .select('*')
      .eq('patient_id', patientId)
      .order('action_time', { ascending: false })
    if (error) throw new Error(`Failed to fetch audit logs: ${error.message}`)
    return data as EMRAuditRow[]
  },

  async insert(supabase: SupabaseClient, payload: Partial<EMRAuditRow>): Promise<EMRAuditRow> {
    const { data, error } = await supabase
      
      .from('emr_audit')
      .insert([payload])
      .select()
      .single()
    if (error) throw new Error(`Failed to insert audit log: ${error.message}`)
    return data as EMRAuditRow
  }
}
