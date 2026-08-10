import type { SupabaseClient } from '@supabase/supabase-js'
import type { VitalsRow } from '@/types/emr'

export const vitalsRepository = {
  async getByVisitId(supabase: SupabaseClient, visitId: string): Promise<VitalsRow[]> {
    const { data, error } = await supabase
      
      .from('vitals')
      .select('*')
      .eq('visit_id', visitId)
      .order('recorded_at', { ascending: false })
    if (error) throw new Error(`Failed to fetch vitals: ${error.message}`)
    return data as VitalsRow[]
  },

  async create(supabase: SupabaseClient, payload: Partial<VitalsRow>): Promise<VitalsRow> {
    const { data, error } = await supabase
      
      .from('vitals')
      .insert([payload])
      .select()
      .single()
    if (error) throw new Error(`Failed to record vitals: ${error.message}`)
    return data as VitalsRow
  },

  async getLatestByVisitId(supabase: SupabaseClient, visitId: string): Promise<VitalsRow | null> {
    const { data, error } = await supabase
      
      .from('vitals')
      .select('*')
      .eq('visit_id', visitId)
      .order('recorded_at', { ascending: false })
      .limit(1)
      .maybeSingle()
    if (error) throw new Error(`Failed to fetch latest vitals: ${error.message}`)
    return data as VitalsRow | null
  }
}
