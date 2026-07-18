'use server'

import { createClient } from '@/lib/supabase/server'
import { availabilityService } from '@/services/appointments/availabilityService'

export async function getAvailableSlotsAction(doctorId: string, date: string) {
  try {
    const supabase = await createClient()
    const { data: sessionData } = await supabase.rpc('get_session_context')
    
    if (!sessionData) {
      throw new Error('Unauthorized')
    }
    
    const clinicId = sessionData.clinic_id
    const slots = await availabilityService.getAvailableSlots(supabase, clinicId, doctorId, date)
    
    return { ok: true, slots }
  } catch (error: any) {
    console.error('Failed to get slots:', error)
    return { ok: false, error: error.message }
  }
}
