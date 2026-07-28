import type { SupabaseClient } from '@supabase/supabase-js'
import type { LabOrderRow } from '@/types/laboratory'

export const labOrderRepository = {
  async getLabOrders(supabase: SupabaseClient, clinicId: string) {
    const { data, error } = await supabase
      .from('lab_orders')
      .select('*, patient:patients(id, first_name, last_name), doctor:doctors(id, first_name, last_name)')
      .eq('clinic_id', clinicId)
      .order('created_at', { ascending: false })

    if (error) throw new Error(error.message)
    return data
  },

  async getLabOrderById(supabase: SupabaseClient, clinicId: string, orderId: string) {
    const { data, error } = await supabase
      .from('lab_orders')
      .select(`
        *,
        patient:patients(id, first_name, last_name),
        doctor:doctors(id, first_name, last_name),
        items:lab_order_items(*)
      `)
      .eq('clinic_id', clinicId)
      .eq('id', orderId)
      .single()

    if (error) throw new Error(error.message)
    return data
  },

  async updateLabOrder(
    supabase: SupabaseClient,
    clinicId: string,
    orderId: string,
    payload: Partial<Omit<LabOrderRow, 'id' | 'clinic_id' | 'order_number' | 'created_at'>>
  ) {
    const { data, error } = await supabase
      .from('lab_orders')
      .update({ ...payload, updated_at: new Date().toISOString() })
      .eq('clinic_id', clinicId)
      .eq('id', orderId)
      .select()
      .single()

    if (error) throw new Error(error.message)
    return data as LabOrderRow
  }
}
