'use server'

import { createClient } from '@/lib/supabase/server'
import { doctorBlockedSlotRepository } from '@/repositories/doctors/doctorBlockedSlotRepository'
import { doctorBlockedSlotService } from '@/services/doctors/doctorBlockedSlotService'
import type { DoctorBlockedSlotRow } from '@/types/doctors'

async function getAuthContext() {
  const supabase = await createClient()
  const { data: { user }, error } = await supabase.auth.getUser()
  if (error || !user) throw new Error('Unauthorized')
  
  const { data: profile } = await supabase.from('users').select('clinic_id').eq('id', user.id).single()
  if (!profile?.clinic_id) throw new Error('Clinic context missing')
  
  return { supabase, user, clinicId: profile.clinic_id }
}

export async function getDoctorBlockedSlotsAction(doctorId: string) {
  try {
    const { supabase, clinicId } = await getAuthContext()
    const data = await doctorBlockedSlotRepository.getBlockedSlotsByDoctor(supabase, clinicId, doctorId)
    return { success: true, data }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}

export async function createBlockedSlotAction(payload: Partial<DoctorBlockedSlotRow>) {
  try {
    const { supabase, user, clinicId } = await getAuthContext()
    const result = await doctorBlockedSlotService.createBlockAndCheckConflicts(supabase, clinicId, {
      ...payload,
      clinic_id: clinicId,
      created_by: user.id
    })
    return { success: true, data: result.blockedSlot, conflicts: result.conflictingAppointments }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}

export async function deleteBlockedSlotAction(id: string) {
  try {
    const { supabase } = await getAuthContext()
    await doctorBlockedSlotRepository.deleteBlockedSlot(supabase, id)
    return { success: true }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}
