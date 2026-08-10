import type { SupabaseClient } from '@supabase/supabase-js'
import type { ClinicalOrderRow } from '@/types/emr'

export const clinicalOrderRepository = {
  async getByVisit(supabase: SupabaseClient, visitId: string): Promise<ClinicalOrderRow[]> {
    const { data, error } = await supabase
      
      .from('clinical_orders')
      .select('*')
      .eq('visit_id', visitId)
      .order('order_date', { ascending: false })
    if (error) throw new Error(`Failed to fetch clinical orders: ${error.message}`)
    return data as ClinicalOrderRow[]
  },

  async create(supabase: SupabaseClient, payload: Partial<ClinicalOrderRow>): Promise<ClinicalOrderRow> {
    const { data, error } = await supabase
      
      .from('clinical_orders')
      .insert([payload])
      .select()
      .single()
    if (error) throw new Error(`Failed to create clinical order: ${error.message}`)
    return data as ClinicalOrderRow
  }
}
