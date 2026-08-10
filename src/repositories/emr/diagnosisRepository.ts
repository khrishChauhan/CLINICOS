import type { SupabaseClient } from '@supabase/supabase-js'
import type { DiagnosisRow, DiagnosisType, DiagnosisStatus } from '@/types/emr'

export const diagnosisRepository = {
  async getByVisit(supabase: SupabaseClient, visitId: string): Promise<DiagnosisRow[]> {
    const { data, error } = await supabase
      
      .from('diagnoses')
      .select('*')
      .eq('visit_id', visitId)
      .order('created_at', { ascending: true })
    if (error) throw new Error(`Failed to fetch diagnoses: ${error.message}`)
    return data as DiagnosisRow[]
  },

  async create(supabase: SupabaseClient, payload: Partial<DiagnosisRow>): Promise<DiagnosisRow> {
    const { data, error } = await supabase
      
      .from('diagnoses')
      .insert([payload])
      .select()
      .single()
    if (error) throw new Error(`Failed to create diagnosis: ${error.message}`)
    return data as DiagnosisRow
  },

  async update(supabase: SupabaseClient, id: string, updates: Partial<DiagnosisRow>): Promise<DiagnosisRow> {
    const { data, error } = await supabase
      
      .from('diagnoses')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single()
    if (error) throw new Error(`Failed to update diagnosis: ${error.message}`)
    return data as DiagnosisRow
  },

  async delete(supabase: SupabaseClient, id: string): Promise<void> {
    const { error } = await supabase
      
      .from('diagnoses')
      .delete()
      .eq('id', id)
    if (error) throw new Error(`Failed to delete diagnosis: ${error.message}`)
  },

  /** Demote all existing Primary diagnoses for this visit to Secondary */
  async demoteExistingPrimary(supabase: SupabaseClient, visitId: string): Promise<void> {
    const { error } = await supabase
      
      .from('diagnoses')
      .update({ diagnosis_type: 'Secondary', updated_at: new Date().toISOString() })
      .eq('visit_id', visitId)
      .eq('diagnosis_type', 'Primary')
    if (error) throw new Error(`Failed to demote primary diagnoses: ${error.message}`)
  }
}
