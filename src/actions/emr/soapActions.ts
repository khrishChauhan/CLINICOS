'use server'

import { createClient } from '@/lib/supabase/server'
import { soapNoteService } from '@/services/emr/soapNoteService'

async function getAuthContext() {
  const supabase = await createClient()
  const { data: { user }, error } = await supabase.auth.getUser()
  if (error || !user) throw new Error('Unauthorized')
  const { data: profile } = await supabase.from('users').select('clinic_id').eq('id', user.id).single()
  if (!profile?.clinic_id) throw new Error('Clinic context missing')
  return { supabase, user, clinicId: profile.clinic_id }
}

export async function getSoapNoteAction(visitId: string) {
  try {
    const { supabase, user, clinicId } = await getAuthContext()
    const soap = await soapNoteService.getOrInit(supabase, clinicId, visitId, user.id)
    return { success: true, data: soap }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}

export async function saveSoapNoteAction(
  visitId: string,
  content: { subjective?: string; objective?: string; assessment?: string; plan?: string }
) {
  try {
    const { supabase, user, clinicId } = await getAuthContext()
    const soap = await soapNoteService.save(supabase, clinicId, visitId, user.id, content)
    return { success: true, data: soap }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}
