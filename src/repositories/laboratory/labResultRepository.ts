import type { SupabaseClient } from '@supabase/supabase-js'
import type { LabResultRow, LabResultParameterRow, AbnormalFlag } from '@/types/laboratory'

// ─────────────────────────────────────────────────────────────────────────────
// Automated Abnormal Flag Detection
// Parses reference ranges like "70-100", ">40", "<200" and flags accordingly
// ─────────────────────────────────────────────────────────────────────────────
export function detectAbnormalFlag(value: string | undefined, referenceRange: string | undefined): AbnormalFlag {
  if (!value || !referenceRange) return 'Normal'
  const numericValue = parseFloat(value)
  if (isNaN(numericValue)) return 'Normal'

  // Range format: "70-100"
  const rangeMatch = referenceRange.match(/^([\d.]+)\s*[-–]\s*([\d.]+)$/)
  if (rangeMatch) {
    const low = parseFloat(rangeMatch[1])
    const high = parseFloat(rangeMatch[2])
    if (numericValue < low) {
      // Critical if more than 20% below low
      return numericValue < low * 0.8 ? 'Critical' : 'Low'
    }
    if (numericValue > high) {
      // Critical if more than 20% above high
      return numericValue > high * 1.2 ? 'Critical' : 'High'
    }
    return 'Normal'
  }

  // Greater-than format: ">40"
  const gtMatch = referenceRange.match(/^>\s*([\d.]+)$/)
  if (gtMatch) {
    const threshold = parseFloat(gtMatch[1])
    return numericValue <= threshold ? 'Low' : 'Normal'
  }

  // Less-than format: "<200"
  const ltMatch = referenceRange.match(/^<\s*([\d.]+)$/)
  if (ltMatch) {
    const threshold = parseFloat(ltMatch[1])
    return numericValue >= threshold ? 'High' : 'Normal'
  }

  return 'Normal'
}

export const labResultRepository = {
  async createLabResult(
    supabase: SupabaseClient,
    clinicId: string,
    payload: Omit<LabResultRow, 'id' | 'clinic_id' | 'created_at' | 'updated_at' | 'verified_by' | 'verified_at'>
  ) {
    const { data, error } = await supabase
      .from('lab_results')
      .insert([{ ...payload, clinic_id: clinicId }])
      .select()
      .single()

    if (error) throw new Error(error.message)
    return data as LabResultRow
  },

  async getResultByTestId(supabase: SupabaseClient, testId: string) {
    const { data, error } = await supabase
      .from('lab_results')
      .select('*, lab_result_parameters(*)')
      .eq('lab_test_id', testId)
      .maybeSingle()

    if (error) throw new Error(error.message)
    return data
  }
}

export const labResultParameterRepository = {
  async bulkCreateParameters(
    supabase: SupabaseClient,
    params: Omit<LabResultParameterRow, 'id'>[]
  ) {
    const { data, error } = await supabase
      .from('lab_result_parameters')
      .insert(params)
      .select()

    if (error) throw new Error(error.message)
    return data as LabResultParameterRow[]
  }
}
