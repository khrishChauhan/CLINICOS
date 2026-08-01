import type { SupabaseClient } from '@supabase/supabase-js'

export const radiologyScheduleRepository = {
  async getScheduleByDate(supabase: SupabaseClient, clinicId: string, date: string) {
    const { data, error } = await supabase
      .from('radiology_schedule')
      .select(`
        *,
        order_item:radiology_order_items!inner(
          *,
          order:radiology_orders!inner(
            clinic_id,
            patient:patients(first_name, last_name, gender, date_of_birth),
            doctor:doctors(first_name, last_name)
          )
        )
      `)
      .eq('order_item.order.clinic_id', clinicId)
      .eq('scheduled_date', date)
      .neq('status', 'Cancelled')
      .order('scheduled_time', { ascending: true })

    if (error) throw new Error(error.message)
    return data
  },

  async updateScheduleStatus(supabase: SupabaseClient, scheduleId: string, status: string) {
    const { data, error } = await supabase
      .from('radiology_schedule')
      .update({ status })
      .eq('id', scheduleId)
      .select()
      .single()

    if (error) throw new Error(error.message)
    return data
  }
}
