import type { SupabaseClient } from '@supabase/supabase-js'
import type { FollowUpPlanRow } from '@/types/emr'

export const followUpPlanRepository = {
  async getByVisit(supabase: SupabaseClient, visitId: string): Promise<FollowUpPlanRow | null> {
    const { data, error } = await supabase
      .schema('emr')
      .from('follow_up_plans')
      .select('*')
      .eq('visit_id', visitId)
      .maybeSingle()
    if (error) throw new Error(`Failed to fetch follow up plan: ${error.message}`)
    return data as FollowUpPlanRow | null
  },

  async upsert(supabase: SupabaseClient, payload: Partial<FollowUpPlanRow>): Promise<FollowUpPlanRow> {
    const { data, error } = await supabase
      .schema('emr')
      .from('follow_up_plans')
      .upsert([{ ...payload, updated_at: new Date().toISOString() }], { onConflict: 'visit_id' })
      .select()
      .single()
    if (error) throw new Error(`Failed to save follow up plan: ${error.message}`)
    return data as FollowUpPlanRow
  }
}
