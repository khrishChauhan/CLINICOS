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
    let apt: AppointmentRow

    switch(action) {
      case 'check-in':
        apt = await queueService.checkInPatient(supabase, appointmentId, userId)
        break
      case 'start-consult':
        apt = await queueService.startConsultation(supabase, appointmentId, userId)
        break
      case 'complete-consult':
        apt = await queueService.completeConsultation(supabase, appointmentId, userId)
        break
      case 'cancel':
        apt = await queueService.cancelAppointment(supabase, appointmentId, userId, reason || 'Cancelled by user')
        break
      default:
        throw new Error('Invalid action')
    }
    
    return { ok: true, appointment: apt }
  } catch (error: any) {
    console.error(`Failed to ${action} appointment:`, error)
    return { ok: false, error: error.message }
  }
}
