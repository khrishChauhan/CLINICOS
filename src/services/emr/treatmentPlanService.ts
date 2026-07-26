import type { SupabaseClient } from '@supabase/supabase-js'
import { treatmentPlanRepository } from '@/repositories/emr/treatmentPlanRepository'
import type { TreatmentPlanRow } from '@/types/emr'

export const treatmentPlanService = {
  async getByPatient(supabase: SupabaseClient, patientId: string): Promise<TreatmentPlanRow[]> {
    return await treatmentPlanRepository.getByPatient(supabase, patientId)
  },

  async add(
    supabase: SupabaseClient,
    clinicId: string,
    patientId: string,
    visitId: string,
    payload: {
      treatment_goal: string
      treatment_description: string
      expected_duration?: string
      review_date?: string
    }
  ): Promise<TreatmentPlanRow> {
    if (!payload.treatment_goal) throw new Error('Treatment goal is required')

    return await treatmentPlanRepository.create(supabase, {
      clinic_id: clinicId,
      patient_id: patientId,
      visit_id: visitId,
      treatment_goal: payload.treatment_goal,
      treatment_description: payload.treatment_description,
      expected_duration: payload.expected_duration || null,
      review_date: payload.review_date || null,
      status: 'Active'
    })
  },

  async updateStatus(
    supabase: SupabaseClient,
    id: string,
    status: 'Active' | 'Completed' | 'Discontinued'
  ): Promise<TreatmentPlanRow> {
    return await treatmentPlanRepository.update(supabase, id, { status })
  }
}
