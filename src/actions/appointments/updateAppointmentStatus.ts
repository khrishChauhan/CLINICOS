'use server'

import { createClient } from '@/lib/supabase/server'
import { queueService } from '@/services/appointments/queueService'
import type { AppointmentRow } from '@/types/appointments'

export async function updateAppointmentStatusAction(
  appointmentId: string,
  action: 'check-in' | 'start-consult' | 'complete-consult' | 'cancel',
  reason?: string
) {
  try {
    const supabase = await createClient()
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    if (userError || !user) throw new Error('Unauthorized')
    const userId = user.id

    // Fetch the appointment first to get clinic_id and doctor_id
    const { data: appointment, error: fetchError } = await supabase
      .from('appointments')
      .select('clinic_id, doctor_id')
      .eq('id', appointmentId)
      .single()
      
    if (fetchError || !appointment) throw new Error('Appointment not found')
    
    let result: any;

    switch(action) {
      case 'check-in':
        result = await queueService.checkInPatient(supabase, appointmentId, appointment.clinic_id, appointment.doctor_id, userId)
        break
      case 'start-consult':
        result = await queueService.startConsultation(supabase, appointmentId, userId)
        break
      case 'complete-consult':
        result = await queueService.completeConsultation(supabase, appointmentId, userId)
        break
      case 'cancel':
        result = await queueService.cancelAppointment(supabase, appointmentId, userId, reason || 'Cancelled by user')
        break
      default:
        throw new Error('Invalid action')
    }
    
    return { ok: true, data: result }
  } catch (error: any) {
    console.error(`Failed to ${action} appointment:`, error)
    return { ok: false, error: error.message }
  }
}
