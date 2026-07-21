import type { SupabaseClient } from '@supabase/supabase-js'
import type { CalendarEventRow } from '@/types/appointments'

export const calendarRepository = {
  async createEvent(supabase: SupabaseClient, payload: Omit<CalendarEventRow, 'id' | 'created_at'>) {
    const { data, error } = await supabase
      .from('calendar_events')
      .insert([payload])
      .select()
      .single()
    if (error) throw new Error(error.message)
    return data as CalendarEventRow
  },

  async getEventsForDoctor(supabase: SupabaseClient, clinicId: string, doctorId: string, startDate: string, endDate: string) {
    const { data, error } = await supabase
      .from('calendar_events')
      .select('*')
      .eq('clinic_id', clinicId)
      .eq('doctor_id', doctorId)
      .gte('start_datetime', startDate)
      .lte('start_datetime', endDate)
      .order('start_datetime', { ascending: true })
    if (error) throw new Error(error.message)
    return data as CalendarEventRow[]
  }
}
