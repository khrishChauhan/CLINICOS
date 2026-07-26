import type { SupabaseClient } from '@supabase/supabase-js'
import { emrAuditRepository } from '@/repositories/emr/emrAuditRepository'
import type { EMRAuditRow } from '@/types/emr'

export const emrAuditService = {
  async getByPatient(supabase: SupabaseClient, patientId: string): Promise<EMRAuditRow[]> {
    return await emrAuditRepository.getByPatient(supabase, patientId)
  },

  async logAction(
    supabase: SupabaseClient,
    clinicId: string,
    userId: string,
    payload: {
      visit_id?: string
      patient_id?: string
      action: 'CREATED' | 'UPDATED' | 'DELETED' | 'RESOLVED' | 'VIEWED'
      table_name: string
      record_id: string
      previous_value?: any
      new_value?: any
      ip_address?: string
    }
  ): Promise<EMRAuditRow> {
    return await emrAuditRepository.insert(supabase, {
      clinic_id: clinicId,
      action_by: userId,
      visit_id: payload.visit_id || null,
      patient_id: payload.patient_id || null,
      action: payload.action,
      table_name: payload.table_name,
      record_id: payload.record_id,
      previous_value: payload.previous_value || null,
      new_value: payload.new_value || null,
      ip_address: payload.ip_address || null
    })
  }
}
