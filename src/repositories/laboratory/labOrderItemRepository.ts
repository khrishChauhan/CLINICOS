import type { SupabaseClient } from '@supabase/supabase-js'
import type { LabOrderItemRow } from '@/types/laboratory'

export const labOrderItemRepository = {
  async getLabOrderItems(supabase: SupabaseClient, labOrderId: string) {
    const { data, error } = await supabase
      .from('lab_order_items')
      .select('*')
      .eq('lab_order_id', labOrderId)
      .order('test_name', { ascending: true })

    if (error) throw new Error(error.message)
    return data as LabOrderItemRow[]
  },

  async addLabOrderItem(supabase: SupabaseClient, payload: Omit<LabOrderItemRow, 'id'>) {
    const { data, error } = await supabase
      .from('lab_order_items')
      .insert([payload])
      .select()
      .single()

    if (error) throw new Error(error.message)
    return data as LabOrderItemRow
  },

  async removeLabOrderItem(supabase: SupabaseClient, itemId: string) {
    const { error } = await supabase
      .from('lab_order_items')
      .delete()
      .eq('id', itemId)

    if (error) throw new Error(error.message)
    return true
  }
}
