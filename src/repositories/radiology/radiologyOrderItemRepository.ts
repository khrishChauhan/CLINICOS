import type { SupabaseClient } from '@supabase/supabase-js'
import type { RadiologyOrderItemRow } from '@/types/radiology'

export const radiologyOrderItemRepository = {
  async getOrderItems(supabase: SupabaseClient, orderId: string) {
    const { data, error } = await supabase
      .from('radiology_order_items')
      .select('*, schedule:radiology_schedule(*)')
      .eq('radiology_order_id', orderId)
      .order('created_at', { ascending: true })

    if (error) throw new Error(error.message)
    return data
  },

  async addOrderItem(
    supabase: SupabaseClient,
    payload: Omit<RadiologyOrderItemRow, 'id' | 'created_at' | 'updated_at'>
  ) {
    const { data, error } = await supabase
      .from('radiology_order_items')
      .insert([payload])
      .select()
      .single()

    if (error) throw new Error(error.message)
    return data
  },

  async removeOrderItem(supabase: SupabaseClient, itemId: string) {
    const { error } = await supabase
      .from('radiology_order_items')
      .delete()
      .eq('id', itemId)

    if (error) throw new Error(error.message)
    return true
  },

  async updateOrderItemStatus(
    supabase: SupabaseClient,
    itemId: string,
    status: string
  ) {
    const { data, error } = await supabase
      .from('radiology_order_items')
      .update({ status })
      .eq('id', itemId)
      .select()
      .single()

    if (error) throw new Error(error.message)
    return data
  }
}
