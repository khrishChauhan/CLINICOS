'use server'

import { createClient } from '@/lib/supabase/server'
import { doctorAwardsRepository } from '@/repositories/doctors/doctorAwardsRepository'
import { doctorAwardsService } from '@/services/doctors/doctorAwardsService'
import type { DoctorAwardRow } from '@/types/doctors'

async function getAuthContext() {
  const supabase = await createClient()
  const { data: { user }, error } = await supabase.auth.getUser()
  if (error || !user) throw new Error('Unauthorized')
  
  const { data: profile } = await supabase.from('users').select('clinic_id').eq('id', user.id).single()
  if (!profile?.clinic_id) throw new Error('Clinic context missing')
  
  return { supabase, clinicId: profile.clinic_id }
}

export async function getDoctorAwardsAction(doctorId: string) {
  try {
    const { supabase, clinicId } = await getAuthContext()
    const data = await doctorAwardsRepository.getAwardsByDoctor(supabase, clinicId, doctorId)
    return { success: true, data }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}

export async function createDoctorAwardAction(payload: Partial<DoctorAwardRow>) {
  try {
    const { supabase, clinicId } = await getAuthContext()
    const data = await doctorAwardsService.addAward(supabase, {
      ...payload,
      clinic_id: clinicId
    })
    return { success: true, data }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}

export async function deleteDoctorAwardAction(id: string) {
  try {
    const { supabase } = await getAuthContext()
    await doctorAwardsRepository.deleteAward(supabase, id)
    return { success: true }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}
