'use server'

import { createClient, createAdminClient } from '@/lib/supabase/server'
import { chiefComplaintService } from '@/services/emr/chiefComplaintService'

async function getAuthContext() {
  const supabase = await createClient()
  const { data: { user }, error } = await supabase.auth.getUser()
  if (error || !user) throw new Error('Unauthorized')
  const adminClient = createAdminClient()
  const { data: profile } = await adminClient.from('users').select('clinic_id').eq('id', user.id).single()
  if (!profile?.clinic_id) throw new Error('Clinic context missing')
  return { supabase, user, clinicId: profile.clinic_id }
}

export async function getChiefComplaintsAction(visitId: string) {
  try {
    const { supabase } = await getAuthContext()
    const data = await chiefComplaintService.getAll(supabase, visitId)
    return { success: true, data }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}

export async function addChiefComplaintAction(
  visitId: string,
  payload: { complaint: string; duration?: string; severity?: 'Mild' | 'Moderate' | 'Severe'; remarks?: string }
) {
  try {
    const { supabase, clinicId } = await getAuthContext()
    const data = await chiefComplaintService.add(supabase, clinicId, visitId, payload)
    return { success: true, data }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}

export async function deleteChiefComplaintAction(id: string) {
  try {
    const { supabase } = await getAuthContext()
    await chiefComplaintService.remove(supabase, id)
    return { success: true }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}
