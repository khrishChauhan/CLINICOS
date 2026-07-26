import type { SupabaseClient } from '@supabase/supabase-js'
import { diagnosisRepository } from '@/repositories/emr/diagnosisRepository'
import type { DiagnosisRow, DiagnosisType, DiagnosisStatus } from '@/types/emr'

export const diagnosisService = {
  async getAll(supabase: SupabaseClient, visitId: string): Promise<DiagnosisRow[]> {
    return await diagnosisRepository.getByVisit(supabase, visitId)
  },

  async add(
    supabase: SupabaseClient,
    clinicId: string,
    visitId: string,
    userId: string,
    payload: {
      diagnosis_name: string
      diagnosis_type: DiagnosisType
      diagnosis_code?: string
      icd_code?: string
      diagnosis_notes?: string
      status?: DiagnosisStatus
    }
  ): Promise<DiagnosisRow> {
    if (!payload.diagnosis_name?.trim()) throw new Error('Diagnosis name is required')

    // Enforce single Primary rule: demote existing primary before creating a new one
    if (payload.diagnosis_type === 'Primary') {
      await diagnosisRepository.demoteExistingPrimary(supabase, visitId)
    }

    return await diagnosisRepository.create(supabase, {
      clinic_id: clinicId,
      visit_id: visitId,
      created_by: userId,
      diagnosis_name: payload.diagnosis_name.trim(),
      diagnosis_type: payload.diagnosis_type,
      diagnosis_code: payload.diagnosis_code || null,
      icd_code: payload.icd_code || null,
      diagnosis_notes: payload.diagnosis_notes || null,
      status: payload.status || 'Active'
    })
  },

  async update(
    supabase: SupabaseClient,
    visitId: string,
    id: string,
    updates: Partial<DiagnosisRow>
  ): Promise<DiagnosisRow> {
    // If promoting to Primary, demote existing
    if (updates.diagnosis_type === 'Primary') {
      await diagnosisRepository.demoteExistingPrimary(supabase, visitId)
    }
    return await diagnosisRepository.update(supabase, id, updates)
  },

  async remove(supabase: SupabaseClient, id: string): Promise<void> {
    await diagnosisRepository.delete(supabase, id)
  }
}
