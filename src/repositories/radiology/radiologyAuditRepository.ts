import type { SupabaseClient } from '@supabase/supabase-js'
import type { RadiologyAuditRow } from '@/types/radiology'

export const radiologyAuditRepository = {
  async getAuditLogs(supabase: SupabaseClient, clinicId: string, limit = 500) {
    const { data, error } = await supabase
      .from('radiology_audit')
      .select('*, user:users!action_by(first_name, last_name, role), order:radiology_orders(order_number)')
      .eq('clinic_id', clinicId)
      .order('action_time', { ascending: false })
      .limit(limit)

    if (error) throw new Error(error.message)
    return data as (RadiologyAuditRow & { order: any })[]
  },

  async logAction(
    supabase: SupabaseClient,
    payload: Omit<RadiologyAuditRow, 'id' | 'created_at' | 'updated_at' | 'deleted_at' | 'action_time' | 'user'>
  ) {
    // Audit records are strictly insert-only based on RLS
    const { data, error } = await supabase
      .from('radiology_audit')
      .insert([{
        ...payload,
        action_time: new Date().toISOString()
      }])
      .select()
      .single()

    if (error) throw new Error(error.message)
    return data as RadiologyAuditRow
  }
}
