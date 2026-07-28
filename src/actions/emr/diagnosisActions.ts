'use server'

import { createClient } from '@/lib/supabase/server'
import { diagnosisService } from '@/services/emr/diagnosisService'
import type { DiagnosisRow, DiagnosisType, DiagnosisStatus } from '@/types/emr'

async function getAuthContext() {
  const supabase = await createClient()
  const { data: { user }, error } = await supabase.auth.getUser()
  if (error || !user) throw new Error('Unauthorized')
  const { data: profile } = await supabase.from('users').select('clinic_id').eq('id', user.id).single()
  if (!profile?.clinic_id) throw new Error('Clinic context missing')
  return { supabase, user, clinicId: profile.clinic_id }
}

export async function getDiagnosesAction(visitId: string) {
  try {
    const { supabase } = await getAuthContext()
    const data = await diagnosisService.getAll(supabase, visitId)
    return { success: true, data }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}

export async function addDiagnosisAction(
  visitId: string,
  payload: {
    diagnosis_name: string
    diagnosis_type: DiagnosisType
    diagnosis_code?: string
    icd_code?: string
    diagnosis_notes?: string
    status?: DiagnosisStatus
    master_diagnosis_id?: string
  }
) {
  try {
    const { supabase, user, clinicId } = await getAuthContext()
    const data = await diagnosisService.add(supabase, clinicId, visitId, user.id, payload)
    return { success: true, data }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}

export async function updateDiagnosisAction(visitId: string, id: string, updates: Partial<DiagnosisRow>) {
  try {
    const { supabase } = await getAuthContext()
    const data = await diagnosisService.update(supabase, visitId, id, updates)
    return { success: true, data }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}

export async function deleteDiagnosisAction(id: string) {
  try {
    const { supabase } = await getAuthContext()
    await diagnosisService.remove(supabase, id)
    return { success: true }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}
