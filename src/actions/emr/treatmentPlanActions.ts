'use server'

import { createClient, createAdminClient } from '@/lib/supabase/server'
import { treatmentPlanService } from '@/services/emr/treatmentPlanService'

async function getAuthContext() {
  const supabase = await createClient()
  const { data: { user }, error } = await supabase.auth.getUser()
  if (error || !user) throw new Error('Unauthorized')
  const adminClient = createAdminClient()
  const { data: profile } = await adminClient.from('users').select('clinic_id').eq('id', user.id).single()
  if (!profile?.clinic_id) throw new Error('Clinic context missing')
  return { supabase, user, clinicId: profile.clinic_id }
}

export async function getTreatmentPlansAction(patientId: string) {
  try {
    const { supabase } = await getAuthContext()
    const data = await treatmentPlanService.getByPatient(supabase, patientId)
    return { success: true, data }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}

export async function createTreatmentPlanAction(patientId: string, visitId: string, payload: any) {
  try {
    const { supabase, clinicId } = await getAuthContext()
    const data = await treatmentPlanService.add(supabase, clinicId, patientId, visitId, payload)
    return { success: true, data }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}

export async function updateTreatmentPlanStatusAction(id: string, status: 'Active' | 'Completed' | 'Discontinued') {
  try {
    const { supabase } = await getAuthContext()
    const data = await treatmentPlanService.updateStatus(supabase, id, status)
    return { success: true, data }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}
