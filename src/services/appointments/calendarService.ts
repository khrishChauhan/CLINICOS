import type { SupabaseClient } from '@supabase/supabase-js'
import { calendarRepository } from '@/repositories/appointments/calendarRepository'

export const calendarService = {
  async getUnifiedCalendar(
    supabase: SupabaseClient,
    clinicId: string,
    doctorId: string,
    startDate: string,
    endDate: string
  ) {
    // 1. Fetch Calendar Events (Leaves, Blocks, etc)
    const events = await calendarRepository.getEventsForDoctor(supabase, clinicId, doctorId, startDate, endDate)
    
    // 2. Fetch Appointments for the range
    const { data: appointments, error } = await supabase
      .from('appointments')
      .select('*, patient:patients(first_name, last_name)')
      .eq('clinic_id', clinicId)
      .eq('doctor_id', doctorId)
      .gte('appointment_date', startDate)
      .lte('appointment_date', endDate)
      .neq('status', 'Cancelled')
      
    if (error) throw new Error(error.message)

    return {
      events,
      appointments
    }
  },

  async blockTime(
    supabase: SupabaseClient,
    clinicId: string,
    doctorId: string,
    title: string,
    start: string,
    end: string,
    description: string
  ) {
    return await calendarRepository.createEvent(supabase, {
      clinic_id: clinicId,
      doctor_id: doctorId,
      event_title: title,
      event_type: 'Blocked',
      start_datetime: start,
      end_datetime: end,
      description: description,
      status: 'Active'
    })
  }
}
