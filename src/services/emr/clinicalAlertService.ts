import type { SupabaseClient } from '@supabase/supabase-js'
import { clinicalAlertRepository } from '@/repositories/emr/clinicalAlertRepository'
import type { ClinicalAlertRow } from '@/types/emr'

export const clinicalAlertService = {
  async getByPatient(supabase: SupabaseClient, patientId: string): Promise<ClinicalAlertRow[]> {
    return await clinicalAlertRepository.getByPatient(supabase, patientId)
  },

  async getActive(supabase: SupabaseClient, patientId: string): Promise<ClinicalAlertRow[]> {
    return await clinicalAlertRepository.getActiveByPatient(supabase, patientId)
  },

  async add(
    supabase: SupabaseClient,
    clinicId: string,
    patientId: string,
    visitId: string | null,
    payload: {
      alert_type: string
      alert_message: string
      severity: 'High' | 'Medium' | 'Low'
    }
  ): Promise<ClinicalAlertRow> {
    if (!payload.alert_message) throw new Error('Alert message is required')

    return await clinicalAlertRepository.create(supabase, {
      clinic_id: clinicId,
      patient_id: patientId,
      visit_id: visitId,
      alert_type: payload.alert_type,
      alert_message: payload.alert_message,
      severity: payload.severity,
      resolved: false
    })
  },

  async resolve(supabase: SupabaseClient, id: string): Promise<ClinicalAlertRow> {
    return await clinicalAlertRepository.resolve(supabase, id)
  }
}
