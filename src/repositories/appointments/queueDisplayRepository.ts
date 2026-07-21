import type { SupabaseClient } from '@supabase/supabase-js'
import type { QueueDisplayRow } from '@/types/appointments'

export const queueDisplayRepository = {
  async upsertQueueDisplay(supabase: SupabaseClient, payload: Omit<QueueDisplayRow, 'id' | 'created_at' | 'updated_at'>) {
    // Upsert based on doctor_id and clinic_id. First try to find existing.
    const { data: existing } = await supabase
      .from('queue_display')
      .select('id')
      .eq('clinic_id', payload.clinic_id)
      .eq('doctor_id', payload.doctor_id)
      .single()
      
    if (existing) {
      const { data, error } = await supabase
        .from('queue_display')
        .update(payload)
        .eq('id', existing.id)
        .select()
        .single()
      if (error) throw new Error(error.message)
      return data as QueueDisplayRow
    } else {
      const { data, error } = await supabase
        .from('queue_display')
        .insert([payload])
        .select()
        .single()
      if (error) throw new Error(error.message)
      return data as QueueDisplayRow
    }
  },

  async getQueueDisplayForDoctor(supabase: SupabaseClient, clinicId: string, doctorId: string) {
    const { data, error } = await supabase
      .from('queue_display')
      .select('*')
      .eq('clinic_id', clinicId)
      .eq('doctor_id', doctorId)
      .single()
    if (error && error.code !== 'PGRST116') throw new Error(error.message)
    return data as QueueDisplayRow | null
  }
}
