import type { SupabaseClient } from '@supabase/supabase-js'
import type { TreatmentPlanRow } from '@/types/emr'

export const treatmentPlanRepository = {
  async getByPatient(supabase: SupabaseClient, patientId: string): Promise<TreatmentPlanRow[]> {
    const { data, error } = await supabase
      .schema('emr')
      .from('treatment_plans')
      .select('*')
      .eq('patient_id', patientId)
      .order('created_at', { ascending: false })
    if (error) throw new Error(`Failed to fetch treatment plans: ${error.message}`)
    return data as TreatmentPlanRow[]
  },

  async create(supabase: SupabaseClient, payload: Partial<TreatmentPlanRow>): Promise<TreatmentPlanRow> {
    const { data, error } = await supabase
      .schema('emr')
      .from('treatment_plans')
      .insert([payload])
      .select()
      .single()
    if (error) throw new Error(`Failed to create treatment plan: ${error.message}`)
    return data as TreatmentPlanRow
  },

  async update(supabase: SupabaseClient, id: string, updates: Partial<TreatmentPlanRow>): Promise<TreatmentPlanRow> {
    const { data, error } = await supabase
      .schema('emr')
      .from('treatment_plans')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single()
    if (error) throw new Error(`Failed to update treatment plan: ${error.message}`)
    return data as TreatmentPlanRow
  }
}
