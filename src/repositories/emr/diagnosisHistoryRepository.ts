import type { SupabaseClient } from '@supabase/supabase-js'
import type { DiagnosisHistoryRow } from '@/types/emr'

export const diagnosisHistoryRepository = {
  async getByPatient(supabase: SupabaseClient, patientId: string): Promise<DiagnosisHistoryRow[]> {
    const { data, error } = await supabase
      .schema('emr')
      .from('diagnosis_history')
      .select('*')
      .eq('patient_id', patientId)
      .order('resolved_date', { ascending: false })
    if (error) throw new Error(`Failed to fetch diagnosis history: ${error.message}`)
    return data as DiagnosisHistoryRow[]
  },

  async resolveTx(supabase: SupabaseClient, diagnosisId: string, status: string, userId: string): Promise<void> {
    const { error } = await supabase.rpc('resolve_diagnosis_tx', {
      p_diagnosis_id: diagnosisId,
      p_status: status,
      p_user_id: userId
    })
    if (error) throw new Error(`Failed to resolve diagnosis transactionally: ${error.message}`)
  }
}
