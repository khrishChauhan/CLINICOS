import type { SupabaseClient } from '@supabase/supabase-js'
import type { DiagnosisRow } from '@/types/consultations'

export async function getDiagnoses(
  supabase: SupabaseClient,
  consultationId: string
): Promise<DiagnosisRow[]> {
  const { data, error } = await supabase
    .from('diagnoses')
    .select('*')
    .eq('consultation_id', consultationId)
    .order('created_at', { ascending: true })

  if (error) throw new Error(`Failed to fetch diagnoses: ${error.message}`)
  return data as DiagnosisRow[]
}

export async function addDiagnosis(
  supabase: SupabaseClient,
  consultationId: string,
  payload: Omit<DiagnosisRow, 'id' | 'consultation_id' | 'created_at'>
): Promise<DiagnosisRow> {
  const { data, error } = await supabase
    .from('diagnoses')
    .insert([{ ...payload, consultation_id: consultationId }])
    .select()
    .single()

  if (error) throw new Error(`Failed to add diagnosis: ${error.message}`)
  return data as DiagnosisRow
}

export async function removeDiagnosis(
  supabase: SupabaseClient,
  diagnosisId: string
): Promise<void> {
  const { error } = await supabase
    .from('diagnoses')
    .delete()
    .eq('id', diagnosisId)

  if (error) throw new Error(`Failed to delete diagnosis: ${error.message}`)
}
