'use server'

import { createClient } from '@/lib/supabase/server'
import { doctorAuditRepository } from '@/repositories/doctors/doctorAuditRepository'

async function getAuthContext() {
  const supabase = await createClient()
  const { data: { user }, error } = await supabase.auth.getUser()
  if (error || !user) throw new Error('Unauthorized')
  
  const { data: profile } = await supabase.from('users').select('clinic_id').eq('id', user.id).single()
  if (!profile?.clinic_id) throw new Error('Clinic context missing')
  
  return { supabase, clinicId: profile.clinic_id }
}

export async function getDoctorAuditTimelineAction(doctorId: string) {
  try {
    const { supabase, clinicId } = await getAuthContext()
    const data = await doctorAuditRepository.getAuditTimeline(supabase, clinicId, doctorId)
    return { success: true, data }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}
