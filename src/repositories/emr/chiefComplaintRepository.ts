import type { SupabaseClient } from '@supabase/supabase-js'
import type { ChiefComplaintRow } from '@/types/emr'

export const chiefComplaintRepository = {
  async getByVisitId(supabase: SupabaseClient, visitId: string): Promise<ChiefComplaintRow[]> {
    const { data, error } = await supabase
      .schema('emr')
      .from('chief_complaints')
      .select('*')
      .eq('visit_id', visitId)
      .order('created_at', { ascending: true })
    if (error) throw new Error(`Failed to fetch chief complaints: ${error.message}`)
    return data as ChiefComplaintRow[]
  },

  async create(supabase: SupabaseClient, payload: Partial<ChiefComplaintRow>): Promise<ChiefComplaintRow> {
    const { data, error } = await supabase
      .schema('emr')
      .from('chief_complaints')
      .insert([payload])
      .select()
      .single()
    if (error) throw new Error(`Failed to create chief complaint: ${error.message}`)
    return data as ChiefComplaintRow
  },

  async delete(supabase: SupabaseClient, id: string): Promise<void> {
    const { error } = await supabase
      .schema('emr')
      .from('chief_complaints')
      .delete()
      .eq('id', id)
    if (error) throw new Error(`Failed to delete chief complaint: ${error.message}`)
  }
}
