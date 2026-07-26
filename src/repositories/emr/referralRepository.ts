import type { SupabaseClient } from '@supabase/supabase-js'
import type { ReferralRow } from '@/types/emr'

export const referralRepository = {
  async getByVisit(supabase: SupabaseClient, visitId: string): Promise<ReferralRow[]> {
    const { data, error } = await supabase
      .schema('emr')
      .from('referrals')
      .select('*')
      .eq('visit_id', visitId)
      .order('referral_date', { ascending: false })
    if (error) throw new Error(`Failed to fetch referrals: ${error.message}`)
    return data as ReferralRow[]
  },

  async create(supabase: SupabaseClient, payload: Partial<ReferralRow>): Promise<ReferralRow> {
    const { data, error } = await supabase
      .schema('emr')
      .from('referrals')
      .insert([payload])
      .select()
      .single()
    if (error) throw new Error(`Failed to create referral: ${error.message}`)
    return data as ReferralRow
  }
}
