import type { SupabaseClient } from '@supabase/supabase-js'
import type { TokenRow } from '@/types/appointments'

export const tokenRepository = {
  async getDailyTokensForClinic(supabase: SupabaseClient, clinicId: string, date: string) {
    const startOfDay = new Date(date)
    startOfDay.setHours(0, 0, 0, 0)
    const endOfDay = new Date(date)
    endOfDay.setHours(23, 59, 59, 999)

    const { data, error } = await supabase
      .from('tokens')
      .select('*')
      .eq('clinic_id', clinicId)
      .gte('generated_time', startOfDay.toISOString())
      .lte('generated_time', endOfDay.toISOString())
    if (error) throw new Error(error.message)
    return data as TokenRow[]
  },

  async createToken(supabase: SupabaseClient, payload: Omit<TokenRow, 'id' | 'created_at' | 'updated_at'>) {
    const { data, error } = await supabase
      .from('tokens')
      .insert([payload])
      .select()
      .single()
    if (error) throw new Error(error.message)
    return data as TokenRow
  },

  async updateTokenStatus(supabase: SupabaseClient, id: string, status: TokenRow['token_status']) {
    const { data, error } = await supabase
      .from('tokens')
      .update({ token_status: status })
      .eq('id', id)
      .select()
      .single()
    if (error) throw new Error(error.message)
    return data as TokenRow
  },

  async getTokenByAppointmentId(supabase: SupabaseClient, appointmentId: string) {
    const { data, error } = await supabase
      .from('tokens')
      .select('*')
      .eq('appointment_id', appointmentId)
      .single()
    if (error && error.code !== 'PGRST116') throw new Error(error.message)
    return data as TokenRow | null
  }
}
