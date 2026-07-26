'use server'

import { createClient } from '@/lib/supabase/server'
import { clinicalNoteService } from '@/services/emr/clinicalNoteService'

async function getAuthContext() {
  const supabase = await createClient()
  const { data: { user }, error } = await supabase.auth.getUser()
  if (error || !user) throw new Error('Unauthorized')
  const { data: profile } = await supabase.from('users').select('clinic_id').eq('id', user.id).single()
  if (!profile?.clinic_id) throw new Error('Clinic context missing')
  return { supabase, user, clinicId: profile.clinic_id }
}

export async function getClinicalNotesAction(visitId: string) {
  try {
    const { supabase } = await getAuthContext()
    const data = await clinicalNoteService.getAll(supabase, visitId)
    return { success: true, data }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}

export async function addClinicalNoteAction(visitId: string, note_type: string, note: string) {
  try {
    const { supabase, user, clinicId } = await getAuthContext()
    const data = await clinicalNoteService.add(supabase, clinicId, visitId, user.id, { note_type, note })
    return { success: true, data }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}

export async function editClinicalNoteAction(id: string, newContent: string) {
  try {
    const { supabase, user } = await getAuthContext()
    const data = await clinicalNoteService.editNote(supabase, id, user.id, newContent)
    return { success: true, data }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}
