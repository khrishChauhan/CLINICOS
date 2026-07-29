import type { SupabaseClient } from '@supabase/supabase-js'
import type { SampleTrackingRow } from '@/types/laboratory'

export const sampleTrackingRepository = {
  async getTrackingHistory(supabase: SupabaseClient, sampleId: string) {
    const { data, error } = await supabase
      .from('lab_sample_tracking')
      .select('*, tracked_by_user:users(id, first_name, last_name)')
      .eq('sample_id', sampleId)
      .order('tracking_time', { ascending: false })

    if (error) throw new Error(error.message)
    return data
  },

  async addTrackingEvent(supabase: SupabaseClient, payload: Omit<SampleTrackingRow, 'id' | 'tracking_time'>) {
    const { data, error } = await supabase
      .from('lab_sample_tracking')
      .insert([payload])
      .select()
      .single()

    if (error) throw new Error(error.message)
    return data as SampleTrackingRow
  }
}
