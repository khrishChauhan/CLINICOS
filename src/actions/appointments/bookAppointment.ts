'use server'

import { createClient, createAdminClient } from '@/lib/supabase/server'
import { appointmentService } from '@/services/appointments/appointmentService'
import type { BookAppointmentPayload } from '@/types/appointments'
import { notificationService } from '@/services/notifications/notificationService'

export async function bookAppointmentAction(payload: BookAppointmentPayload) {
  try {
    const supabase = await createClient()
    const adminClient = createAdminClient()
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    if (userError || !user) throw new Error('Unauthorized')
    
    const { data: profile } = await adminClient
      .from('users')
      .select('clinic_id')
      .eq('id', user.id)
      .single()
      
    if (!profile) throw new Error('User profile not found')
    
    // In a real app we check `appointments.create` permission here via an auth utility
    
    const clinicId = profile.clinic_id
    if (!clinicId) throw new Error('Clinic ID not found for this user.')
    const userId = user.id

    const apt = await appointmentService.bookAppointment(adminClient, clinicId, userId, payload)
    
    // Fetch patient info for the notification template
    const { data: patient } = await adminClient.from('patients').select('first_name, last_name').eq('id', payload.patientId).single()
    const patientName = patient ? `${patient.first_name} ${patient.last_name}` : 'Patient'

    // Dispatch Notification Event
    await notificationService.dispatch(
      adminClient,
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
