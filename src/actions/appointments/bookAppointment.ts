'use server'

import { createClient } from '@/lib/supabase/server'
import { appointmentService } from '@/services/appointments/appointmentService'
import type { BookAppointmentPayload } from '@/types/appointments'

export async function bookAppointmentAction(payload: BookAppointmentPayload) {
  try {
    const supabase = await createClient()
    const { data: sessionData, error: sessionErr } = await supabase.rpc('get_session_context')
    
    if (sessionErr || !sessionData) {
      throw new Error('Unauthorized')
    }
    
    // In a real app we check `appointments.create` permission here via an auth utility
    
    const clinicId = sessionData.clinic_id
    const userId = sessionData.user_id

    const apt = await appointmentService.bookAppointment(supabase, clinicId, userId, payload)
    
    return { ok: true, appointment: apt }
  } catch (error: any) {
    console.error('Failed to book appointment:', error)
    return { ok: false, error: error.message }
  }
}
