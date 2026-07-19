'use server'

import { createClient } from '@/lib/supabase/server'
import { appointmentService } from '@/services/appointments/appointmentService'
import type { BookAppointmentPayload } from '@/types/appointments'
import { notificationService } from '@/services/notifications/notificationService'

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
    
    // Fetch patient info for the notification template
    const { data: patient } = await supabase.from('patients').select('first_name, last_name').eq('id', payload.patientId).single()
    const patientName = patient ? `${patient.first_name} ${patient.last_name}` : 'Patient'

    // Dispatch Notification Event
    await notificationService.dispatch(
      supabase,
      clinicId,
      'AppointmentCreated',
      ['In-App', 'SMS', 'Email'], // Route to all active templates for this event
      {
        patient_name: patientName,
        time: payload.startTime,
        date: payload.date
      },
      {
        userId: payload.doctorId || userId, // Notify the doctor, or the user who created it
        patientId: payload.patientId
      }
    )

    return { ok: true, appointment: apt }
  } catch (error: any) {
    console.error('Failed to book appointment:', error)
    return { ok: false, error: error.message }
  }
}
