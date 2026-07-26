'use server'

import { createClient } from '@/lib/supabase/server'
import { doctorPerformanceRepository } from '@/repositories/doctors/doctorPerformanceRepository'
import { doctorPerformanceService } from '@/services/doctors/doctorPerformanceService'

async function getAuthContext() {
  const supabase = await createClient()
  const { data: { user }, error } = await supabase.auth.getUser()
  if (error || !user) throw new Error('Unauthorized')
  
  const { data: profile } = await supabase.from('users').select('clinic_id').eq('id', user.id).single()
  if (!profile?.clinic_id) throw new Error('Clinic context missing')
  
  return { supabase, clinicId: profile.clinic_id }
}

export async function getDoctorPerformanceHistoryAction(doctorId: string) {
  try {
    const { supabase, clinicId } = await getAuthContext()
    const data = await doctorPerformanceRepository.getPerformanceHistory(supabase, clinicId, doctorId)
    return { success: true, data }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}

export async function refreshDoctorPerformanceAction(doctorId: string, monthStr: string) {
  try {
    const { supabase, clinicId } = await getAuthContext()
    const data = await doctorPerformanceService.refreshPerformanceData(supabase, clinicId, doctorId, monthStr)
    return { success: true, data }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}
