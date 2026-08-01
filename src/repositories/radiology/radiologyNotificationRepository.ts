import type { SupabaseClient } from '@supabase/supabase-js'
import type { RadiologyNotificationRow } from '@/types/radiology'

export const radiologyNotificationRepository = {
  async getNotificationsByClinic(supabase: SupabaseClient, clinicId: string) {
    const { data, error } = await supabase
      .from('radiology_notifications')
      .select('*, order:radiology_orders(order_number, patient:patients(first_name, last_name))')
      .eq('clinic_id', clinicId)
      .is('deleted_at', null)
      .order('created_at', { ascending: false })

    if (error) throw new Error(error.message)
    return data as (RadiologyNotificationRow & { order: any })[]
  },

  async logNotification(
    supabase: SupabaseClient,
    payload: Omit<RadiologyNotificationRow, 'id' | 'created_at' | 'updated_at' | 'deleted_at'>
  ) {
    const { data, error } = await supabase
      .from('radiology_notifications')
      .insert([payload])
      .select()
      .single()

    if (error) throw new Error(error.message)
    return data as RadiologyNotificationRow
  }
}
