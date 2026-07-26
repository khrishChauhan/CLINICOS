import type { SupabaseClient } from '@supabase/supabase-js'
import type { ClinicalAlertRow } from '@/types/emr'

export const clinicalAlertRepository = {
  async getByPatient(supabase: SupabaseClient, patientId: string): Promise<ClinicalAlertRow[]> {
    const { data, error } = await supabase
      .schema('emr')
      .from('clinical_alerts')
      .select('*')
      .eq('patient_id', patientId)
      .order('created_at', { ascending: false })
    if (error) throw new Error(`Failed to fetch alerts: ${error.message}`)
    return data as ClinicalAlertRow[]
  },

  async getActiveByPatient(supabase: SupabaseClient, patientId: string): Promise<ClinicalAlertRow[]> {
    const { data, error } = await supabase
      .schema('emr')
      .from('clinical_alerts')
      .select('*')
      .eq('patient_id', patientId)
      .eq('resolved', false)
      .order('created_at', { ascending: false })
    if (error) throw new Error(`Failed to fetch active alerts: ${error.message}`)
    return data as ClinicalAlertRow[]
  },

  async create(supabase: SupabaseClient, payload: Partial<ClinicalAlertRow>): Promise<ClinicalAlertRow> {
    const { data, error } = await supabase
      .schema('emr')
      .from('clinical_alerts')
      .insert([payload])
      .select()
      .single()
    if (error) throw new Error(`Failed to create alert: ${error.message}`)
    return data as ClinicalAlertRow
  },

  async resolve(supabase: SupabaseClient, id: string): Promise<ClinicalAlertRow> {
    const { data, error } = await supabase
      .schema('emr')
      .from('clinical_alerts')
      .update({ resolved: true, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single()
    if (error) throw new Error(`Failed to resolve alert: ${error.message}`)
    return data as ClinicalAlertRow
  }
}
