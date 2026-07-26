'use server'

import { createClient } from '@/lib/supabase/server'
import { doctorNotesRepository } from '@/repositories/doctors/doctorNotesRepository'
import { doctorNotesService } from '@/services/doctors/doctorNotesService'
import type { DoctorNoteRow } from '@/types/doctors'

async function getAuthContext() {
  const supabase = await createClient()
  const { data: { user }, error } = await supabase.auth.getUser()
  if (error || !user) throw new Error('Unauthorized')
  
  const { data: profile } = await supabase.from('users').select('clinic_id').eq('id', user.id).single()
  if (!profile?.clinic_id) throw new Error('Clinic context missing')
  
  return { supabase, user, clinicId: profile.clinic_id }
}

export async function getDoctorNotesAction(doctorId: string) {
  try {
    const { supabase, clinicId } = await getAuthContext()
    const data = await doctorNotesRepository.getNotesByDoctor(supabase, clinicId, doctorId)
    return { success: true, data }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}

export async function createDoctorNoteAction(payload: Partial<DoctorNoteRow>) {
  try {
    const { supabase, user, clinicId } = await getAuthContext()
    const data = await doctorNotesService.addNote(supabase, {
      ...payload,
      clinic_id: clinicId,
      created_by: user.id
    })
    return { success: true, data }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}

export async function deleteDoctorNoteAction(id: string) {
  try {
    const { supabase } = await getAuthContext()
    await doctorNotesRepository.deleteNote(supabase, id)
    return { success: true }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}
