'use server'

import { createClient } from '@/lib/supabase/server'
import { doctorCommunicationPreferenceService } from '@/services/doctors/doctorCommunicationPreferenceService'
import type { DoctorCommunicationPreferenceRow } from '@/types/doctors'

async function getAuthContext() {
  const supabase = await createClient()
  const { data: { user }, error } = await supabase.auth.getUser()
  if (error || !user) throw new Error('Unauthorized')
  
  const { data: profile } = await supabase.from('users').select('clinic_id').eq('id', user.id).single()
  if (!profile?.clinic_id) throw new Error('Clinic context missing')
  
  return { supabase, clinicId: profile.clinic_id }
}

export async function getDoctorPreferencesAction(doctorId: string) {
  try {
    const { supabase, clinicId } = await getAuthContext()
    const data = await doctorCommunicationPreferenceService.getOrCreatePreferences(supabase, clinicId, doctorId)
    return { success: true, data }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}

export async function updateCommunicationPreferenceAction(doctorId: string, updates: Partial<DoctorCommunicationPreferenceRow>) {
  try {
    const { supabase, clinicId } = await getAuthContext()
    const data = await doctorCommunicationPreferenceService.updatePreferences(supabase, clinicId, doctorId, updates)
    return { success: true, data }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}
