import type { SupabaseClient } from '@supabase/supabase-js'
import { vitalsRepository } from '@/repositories/emr/vitalsRepository'
import type { VitalsRow } from '@/types/emr'

function calculateBmi(heightCm: number | null | undefined, weightKg: number | null | undefined): number | null {
  if (!heightCm || !weightKg || heightCm <= 0) return null
  const heightM = heightCm / 100
  return Math.round((weightKg / (heightM * heightM)) * 10) / 10
}

export const vitalsService = {
  async getAll(supabase: SupabaseClient, visitId: string): Promise<VitalsRow[]> {
    return await vitalsRepository.getByVisitId(supabase, visitId)
  },

  async getLatest(supabase: SupabaseClient, visitId: string): Promise<VitalsRow | null> {
    return await vitalsRepository.getLatestByVisitId(supabase, visitId)
  },

  async record(
    supabase: SupabaseClient,
    clinicId: string,
    visitId: string,
    userId: string,
    payload: Partial<Omit<VitalsRow, 'id' | 'clinic_id' | 'visit_id' | 'bmi' | 'recorded_by' | 'recorded_at'>>
  ): Promise<VitalsRow> {
    // Auto-calculate BMI when height and weight are provided
    const bmi = calculateBmi(payload.height_cm, payload.weight_kg)

    return await vitalsRepository.create(supabase, {
      clinic_id: clinicId,
      visit_id: visitId,
      recorded_by: userId,
      recorded_at: new Date().toISOString(),
      ...payload,
      bmi: bmi ?? null
    })
  }
}
