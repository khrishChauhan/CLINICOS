import type { SupabaseClient } from '@supabase/supabase-js'
import type { RadiologyOrderRow } from '@/types/radiology'

export const radiologyOrderRepository = {
  async getOrders(supabase: SupabaseClient, clinicId: string) {
    const { data, error } = await supabase
      .from('radiology_orders')
      .select(`
        *,
        patient:patients(first_name, last_name, gender, date_of_birth),
        doctor:doctors(first_name, last_name),
        items:radiology_order_items(
          *,
          schedule:radiology_schedule(*)
        )
      `)
      .eq('clinic_id', clinicId)
      .is('deleted_at', null)
      .order('created_at', { ascending: false })

    if (error) throw new Error(error.message)
    return data
  },

  async getOrderById(supabase: SupabaseClient, clinicId: string, orderId: string) {
    const { data, error } = await supabase
      .from('radiology_orders')
      .select(`
        *,
        patient:patients(first_name, last_name, gender, date_of_birth, mobile_number),
        doctor:doctors(first_name, last_name),
        items:radiology_order_items(
          *,
          schedule:radiology_schedule(*)
        )
      `)
      .eq('clinic_id', clinicId)
      .eq('id', orderId)
      .is('deleted_at', null)
      .single()

    if (error) throw new Error(error.message)
    return data
  },

  async updateOrder(
    supabase: SupabaseClient,
    clinicId: string,
    orderId: string,
    payload: Partial<Omit<RadiologyOrderRow, 'id' | 'clinic_id' | 'created_at'>>
  ) {
    const { data, error } = await supabase
      .from('radiology_orders')
      .update(payload)
      .eq('id', orderId)
      .eq('clinic_id', clinicId)
      .select()
      .single()

    if (error) throw new Error(error.message)
    return data
  }
}
