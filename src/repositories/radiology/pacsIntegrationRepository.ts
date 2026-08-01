import type { SupabaseClient } from '@supabase/supabase-js'
import type { PACSIntegrationRow } from '@/types/radiology'

export const pacsIntegrationRepository = {
  async getIntegrationRecord(supabase: SupabaseClient, studyId: string) {
    const { data, error } = await supabase
      .from('pacs_integration')
      .select('*')
      .eq('imaging_study_id', studyId)
      .single()

    if (error && error.code !== 'PGRST116') throw new Error(error.message)
    return data as PACSIntegrationRow | null
  },

  async upsertIntegrationRecord(
    supabase: SupabaseClient,
    payload: Omit<PACSIntegrationRow, 'id' | 'created_at' | 'updated_at'>
  ) {
    // Check if exists
    const existing = await this.getIntegrationRecord(supabase, payload.imaging_study_id)
    
    if (existing) {
      const { data, error } = await supabase
        .from('pacs_integration')
        .update({
          transfer_status: payload.transfer_status,
          transfer_date: payload.transfer_date,
          retry_count: payload.retry_count,
          error_log: payload.error_log
        })
        .eq('imaging_study_id', payload.imaging_study_id)
        .select()
        .single()
      if (error) throw new Error(error.message)
      return data as PACSIntegrationRow
    } else {
      const { data, error } = await supabase
        .from('pacs_integration')
        .insert([payload])
        .select()
        .single()
      if (error) throw new Error(error.message)
      return data as PACSIntegrationRow
    }
  }
}
