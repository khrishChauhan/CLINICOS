'use server'

import { createClient } from '@/lib/supabase/server'
import { onlineBookingService } from '@/services/appointments/onlineBookingService'

export async function registerOnlineBookingAction(
  appointmentId: string,
  platform: string,
  reference?: string,
  message?: string
) {
  try {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) throw new Error('Unauthorized')

    const { data: profile } = await supabase.from('users').select('clinic_id').eq('id', user.id).single()
    if (!profile?.clinic_id) throw new Error('Clinic ID not found')

    const data = await onlineBookingService.registerOnlineBooking(
      supabase,
      profile.clinic_id,
      appointmentId,
      platform,
      reference,
      message
    )
    return { success: true, data }
  } catch (error: any) {
    return { success: false, error: error.message || 'Failed to register online booking' }
  }
}

export async function fetchOnlineBookingAction(appointmentId: string) {
  try {
    const supabase = await createClient()
    const data = await onlineBookingService.getOnlineBookingDetails(supabase, appointmentId)
    return { success: true, data }
  } catch (error: any) {
    return { success: false, error: error.message || 'Failed to fetch online booking details' }
  }
}

export async function confirmOnlineBookingAction(onlineBookingId: string) {
  try {
    const supabase = await createClient()
    const data = await onlineBookingService.confirmOnlineBooking(supabase, onlineBookingId)
    return { success: true, data }
  } catch (error: any) {
    return { success: false, error: error.message || 'Failed to confirm online booking' }
  }
}
