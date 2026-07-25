'use server'

import { createClient } from '@/lib/supabase/server'
import { doctorLeaveRepository } from '@/repositories/doctors/doctorLeaveRepository'
import { doctorLeaveService } from '@/services/doctors/doctorLeaveService'
import type { DoctorLeaveRow } from '@/types/doctors'

async function getAuthContext() {
  const supabase = await createClient()
  const { data: { user }, error } = await supabase.auth.getUser()
  if (error || !user) throw new Error('Unauthorized')
  
  const { data: profile } = await supabase.from('users').select('clinic_id').eq('id', user.id).single()
  if (!profile?.clinic_id) throw new Error('Clinic context missing')
  
  return { supabase, user, clinicId: profile.clinic_id }
}

export async function getDoctorLeavesAction(doctorId: string) {
  try {
    const { supabase, clinicId } = await getAuthContext()
    const data = await doctorLeaveRepository.getLeavesByDoctor(supabase, clinicId, doctorId)
    return { success: true, data }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}

export async function createDoctorLeaveAction(payload: Partial<DoctorLeaveRow>) {
  try {
    const { supabase, user, clinicId } = await getAuthContext()
    const result = await doctorLeaveService.applyForLeave(supabase, clinicId, {
      ...payload,
      clinic_id: clinicId,
      approved_by: user.id // MVP Auto-approval setup
    })
    return { success: true, data: result.leave, conflicts: result.conflictingAppointments }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}

export async function deleteDoctorLeaveAction(id: string) {
  try {
    const { supabase } = await getAuthContext()
    await doctorLeaveRepository.deleteLeave(supabase, id)
    return { success: true }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}
