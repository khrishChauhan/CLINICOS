import type { SupabaseClient } from '@supabase/supabase-js'
import type { ProcedureRow } from '@/types/emr'

export const procedureRepository = {
  async getByVisit(supabase: SupabaseClient, visitId: string): Promise<ProcedureRow[]> {
    const { data, error } = await supabase
      .schema('emr')
      .from('procedures')
      .select('*')
      .eq('visit_id', visitId)
      .order('created_at', { ascending: true })
    if (error) throw new Error(`Failed to fetch procedures: ${error.message}`)
    return data as ProcedureRow[]
  },

  async create(supabase: SupabaseClient, payload: Partial<ProcedureRow>): Promise<ProcedureRow> {
    const { data, error } = await supabase
      .schema('emr')
      .from('procedures')
      .insert([payload])
      .select()
      .single()
    if (error) throw new Error(`Failed to create procedure: ${error.message}`)
    return data as ProcedureRow
  },

  async update(supabase: SupabaseClient, id: string, updates: Partial<ProcedureRow>): Promise<ProcedureRow> {
    const { data, error } = await supabase
      .schema('emr')
      .from('procedures')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single()
    if (error) throw new Error(`Failed to update procedure: ${error.message}`)
    return data as ProcedureRow
  },

  async delete(supabase: SupabaseClient, id: string): Promise<void> {
    const { error } = await supabase
      .schema('emr')
      .from('procedures')
      .delete()
      .eq('id', id)
    if (error) throw new Error(`Failed to delete procedure: ${error.message}`)
  }
}
