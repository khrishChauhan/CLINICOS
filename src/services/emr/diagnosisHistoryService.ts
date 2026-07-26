import type { SupabaseClient } from '@supabase/supabase-js'
import { diagnosisHistoryRepository } from '@/repositories/emr/diagnosisHistoryRepository'
import type { DiagnosisHistoryRow } from '@/types/emr'

export const diagnosisHistoryService = {
  async getByPatient(supabase: SupabaseClient, patientId: string): Promise<DiagnosisHistoryRow[]> {
    return await diagnosisHistoryRepository.getByPatient(supabase, patientId)
  },

  async resolveDiagnosis(
    supabase: SupabaseClient,
    diagnosisId: string,
    status: 'Resolved' | 'Ruled Out',
    userId: string
  ): Promise<void> {
    await diagnosisHistoryRepository.resolveTx(supabase, diagnosisId, status, userId)
  }
}
