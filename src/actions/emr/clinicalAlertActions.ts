'use server'

import { createClient, createAdminClient } from '@/lib/supabase/server'
import { clinicalAlertService } from '@/services/emr/clinicalAlertService'

async function getAuthContext() {
  const supabase = await createClient()
  const { data: { user }, error } = await supabase.auth.getUser()
  if (error || !user) throw new Error('Unauthorized')
  const adminClient = createAdminClient()
  const { data: profile } = await adminClient.from('users').select('clinic_id').eq('id', user.id).single()
  if (!profile?.clinic_id) throw new Error('Clinic context missing')
  return { supabase, user, clinicId: profile.clinic_id }
}

export async function getClinicalAlertsAction(patientId: string) {
  try {
    const { supabase } = await getAuthContext()
    const data = await clinicalAlertService.getByPatient(supabase, patientId)
    return { success: true, data }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}

export async function getActiveClinicalAlertsAction(patientId: string) {
  try {
    const { supabase } = await getAuthContext()
    const data = await clinicalAlertService.getActive(supabase, patientId)
    return { success: true, data }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}

export async function createClinicalAlertAction(patientId: string, visitId: string | null, payload: any) {
  try {
    const { supabase, clinicId } = await getAuthContext()
    const data = await clinicalAlertService.add(supabase, clinicId, patientId, visitId, payload)
    return { success: true, data }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}

export async function resolveClinicalAlertAction(id: string) {
  try {
    const { supabase } = await getAuthContext()
    const data = await clinicalAlertService.resolve(supabase, id)
    return { success: true, data }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}
