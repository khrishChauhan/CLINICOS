'use server'

import { createClient } from '@/lib/supabase/server'
import { doctorConsultationFeeRepository } from '@/repositories/doctors/doctorConsultationFeeRepository'
import { doctorConsultationFeeService } from '@/services/doctors/doctorConsultationFeeService'
import type { DoctorConsultationFeeRow } from '@/types/doctors'

async function getAuthContext() {
  const supabase = await createClient()
  const { data: { user }, error } = await supabase.auth.getUser()
  if (error || !user) throw new Error('Unauthorized')
  
  const { data: profile } = await supabase.from('users').select('clinic_id').eq('id', user.id).single()
  if (!profile?.clinic_id) throw new Error('Clinic context missing')
  
  return { supabase, user, clinicId: profile.clinic_id }
}

export async function getDoctorFeesAction(doctorId: string) {
  try {
    const { supabase, clinicId } = await getAuthContext()
    const data = await doctorConsultationFeeRepository.getFeesByDoctor(supabase, clinicId, doctorId)
    return { success: true, data }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}

export async function createDoctorFeeAction(payload: Partial<DoctorConsultationFeeRow>) {
  try {
    const { supabase, user, clinicId } = await getAuthContext()
    const data = await doctorConsultationFeeService.addFeeConfiguration(supabase, clinicId, {
      ...payload,
      clinic_id: clinicId,
      created_by: user.id
    })
    return { success: true, data }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}
