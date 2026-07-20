'use server'

import { createClient } from '@/lib/supabase/server'
import { slotGenerationService } from '@/services/appointments/slotGenerationService'

export async function getAvailableSlotsAction(doctorId: string, date: string) {
  try {
    const supabase = await createClient()
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    if (userError || !user) throw new Error('Unauthorized')
    
    const { data: profile } = await supabase
      .from('users')
      .select('clinic_id')
      .eq('id', user.id)
      .single()
      
    if (!profile) throw new Error('User profile not found')
    
    const clinicId = profile.clinic_id
    const slots = await slotGenerationService.getAvailableSlots(supabase, clinicId, doctorId, date)
    
    return { ok: true, slots }
  } catch (error: any) {
    console.error('Failed to get slots:', error)
    return { ok: false, error: error.message }
  }
}
