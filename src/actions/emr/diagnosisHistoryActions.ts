'use server'

import { createClient } from '@/lib/supabase/server'
import { diagnosisHistoryService } from '@/services/emr/diagnosisHistoryService'
import { emrAuditService } from '@/services/emr/emrAuditService'

async function getAuthContext() {
  const supabase = await createClient()
  const { data: { user }, error } = await supabase.auth.getUser()
  if (error || !user) throw new Error('Unauthorized')
  const { data: profile } = await supabase.from('users').select('clinic_id').eq('id', user.id).single()
  if (!profile?.clinic_id) throw new Error('Clinic context missing')
  return { supabase, user, clinicId: profile.clinic_id }
}

export async function getDiagnosisHistoryAction(patientId: string) {
  try {
    const { supabase } = await getAuthContext()
    const data = await diagnosisHistoryService.getByPatient(supabase, patientId)
    return { success: true, data }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}

export async function resolveDiagnosisTxAction(diagnosisId: string, status: 'Resolved' | 'Ruled Out', patientId: string) {
  try {
    const { supabase, user, clinicId } = await getAuthContext()
    await diagnosisHistoryService.resolveDiagnosis(supabase, diagnosisId, status, user.id)
    
    // Log audit
    await emrAuditService.logAction(supabase, clinicId, user.id, {
      patient_id: patientId,
      action: 'RESOLVED',
      table_name: 'diagnoses',
      record_id: diagnosisId,
      new_value: { status }
    })
    
    return { success: true }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}
