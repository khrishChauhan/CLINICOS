import type { SupabaseClient } from '@supabase/supabase-js'
import type { WalkInRegistrationRow } from '@/types/appointments'

export const walkInRepository = {
  async registerWalkIn(supabase: SupabaseClient, payload: Omit<WalkInRegistrationRow, 'id' | 'created_at' | 'updated_at'>) {
    const { data, error } = await supabase
      .from('walk_in_registrations')
      .insert([payload])
      .select()
      .single()
    if (error) throw new Error(error.message)
    return data as WalkInRegistrationRow
  },

  async updateWalkInStatus(supabase: SupabaseClient, id: string, status: string) {
    const { data, error } = await supabase
      .from('walk_in_registrations')
      .update({ status })
      .eq('id', id)
      .select()
      .single()
    if (error) throw new Error(error.message)
    return data as WalkInRegistrationRow
  },
  
  async getWalkInsForClinic(supabase: SupabaseClient, clinicId: string, date: string) {
    const startOfDay = new Date(date)
    startOfDay.setHours(0, 0, 0, 0)
    const endOfDay = new Date(date)
    endOfDay.setHours(23, 59, 59, 999)

    const { data, error } = await supabase
      .from('walk_in_registrations')
      .select('*')
      .eq('clinic_id', clinicId)
      .gte('arrival_time', startOfDay.toISOString())
      .lte('arrival_time', endOfDay.toISOString())
    if (error) throw new Error(error.message)
    return data as WalkInRegistrationRow[]
  }
}
