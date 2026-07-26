'use server'

import { createClient } from '@/lib/supabase/server'
import { doctorLanguagesRepository } from '@/repositories/doctors/doctorLanguagesRepository'
import { doctorLanguagesService } from '@/services/doctors/doctorLanguagesService'
import type { DoctorLanguageRow } from '@/types/doctors'

async function getAuthContext() {
  const supabase = await createClient()
  const { data: { user }, error } = await supabase.auth.getUser()
  if (error || !user) throw new Error('Unauthorized')
  
  const { data: profile } = await supabase.from('users').select('clinic_id').eq('id', user.id).single()
  if (!profile?.clinic_id) throw new Error('Clinic context missing')
  
  return { supabase, clinicId: profile.clinic_id }
}

export async function getDoctorLanguagesAction(doctorId: string) {
  try {
    const { supabase, clinicId } = await getAuthContext()
    const data = await doctorLanguagesRepository.getLanguagesByDoctor(supabase, clinicId, doctorId)
    return { success: true, data }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}

export async function addDoctorLanguageAction(payload: Partial<DoctorLanguageRow>) {
  try {
    const { supabase, clinicId } = await getAuthContext()
    const data = await doctorLanguagesService.addLanguage(supabase, {
      ...payload,
      clinic_id: clinicId
    })
    return { success: true, data }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}

export async function deleteDoctorLanguageAction(id: string) {
  try {
    const { supabase } = await getAuthContext()
    await doctorLanguagesRepository.removeLanguage(supabase, id)
    return { success: true }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}
