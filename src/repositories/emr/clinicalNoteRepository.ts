import type { SupabaseClient } from '@supabase/supabase-js'
import type { ClinicalNoteRow } from '@/types/emr'

export const clinicalNoteRepository = {
  async getByVisit(supabase: SupabaseClient, visitId: string): Promise<ClinicalNoteRow[]> {
    const { data, error } = await supabase
      .schema('emr')
      .from('clinical_notes')
      .select('*')
      .eq('visit_id', visitId)
      .order('entered_at', { ascending: true })
    if (error) throw new Error(`Failed to fetch clinical notes: ${error.message}`)
    return data as ClinicalNoteRow[]
  },

  async create(supabase: SupabaseClient, payload: Partial<ClinicalNoteRow>): Promise<ClinicalNoteRow> {
    const { data, error } = await supabase
      .schema('emr')
      .from('clinical_notes')
      .insert([{ ...payload, edit_history: [] }])
      .select()
      .single()
    if (error) throw new Error(`Failed to create clinical note: ${error.message}`)
    return data as ClinicalNoteRow
  },

  async update(supabase: SupabaseClient, id: string, updates: Partial<ClinicalNoteRow>): Promise<ClinicalNoteRow> {
    const { data, error } = await supabase
      .schema('emr')
      .from('clinical_notes')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single()
    if (error) throw new Error(`Failed to update clinical note: ${error.message}`)
    return data as ClinicalNoteRow
  },

  async getById(supabase: SupabaseClient, id: string): Promise<ClinicalNoteRow | null> {
    const { data, error } = await supabase
      .schema('emr')
      .from('clinical_notes')
      .select('*')
      .eq('id', id)
      .maybeSingle()
    if (error) throw new Error(`Failed to fetch note: ${error.message}`)
    return data as ClinicalNoteRow | null
  }
}
