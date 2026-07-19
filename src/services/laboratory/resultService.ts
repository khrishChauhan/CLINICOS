import type { SupabaseClient } from '@supabase/supabase-js'
import { createLabResult, upsertResultValues, verifyLabResult } from '@/repositories/laboratory/resultRepository'
import { getReferenceRangesForTest } from '@/repositories/laboratory/testCatalogRepository'
import { labOrderService } from './labOrderService'
import type { ReferenceRangeRow } from '@/types/laboratory'

interface ResultInput {
  labOrderItemId: string
  labTestId: string
  valueNumeric?: number | null
  valueText?: string | null
}

function calcAgeInYears(dob: string): number {
  const diff = Date.now() - new Date(dob).getTime()
  return Math.floor(diff / (1000 * 60 * 60 * 24 * 365.25))
}

function evaluateRange(
  value: number,
  ranges: ReferenceRangeRow[],
  patientGender: string,
  patientAge: number
): { is_abnormal: boolean; is_critical: boolean } {
  // Find matching demographic range
  const match = ranges.find(r => {
    const genderOk = r.gender === 'All' || r.gender === patientGender
    const ageOk = patientAge >= r.min_age && patientAge <= r.max_age
    return genderOk && ageOk
  })

  if (!match) return { is_abnormal: false, is_critical: false }

  const is_critical =
    (match.critical_min !== null && value < match.critical_min) ||
    (match.critical_max !== null && value > match.critical_max)

  const is_abnormal =
    is_critical ||
    (match.min_value !== null && value < match.min_value) ||
    (match.max_value !== null && value > match.max_value)

  return { is_abnormal, is_critical }
}

export const resultService = {
  async enterResults(
    supabase: SupabaseClient,
    labOrderId: string,
    userId: string,
    inputs: ResultInput[],
    patient: { date_of_birth: string; gender: string }
  ) {
    // 1. Advance status -> 'Processing'
    await labOrderService.advanceStatus(supabase, labOrderId, 'Processing', userId)

    // 2. Create result wrapper
    const result = await createLabResult(supabase, labOrderId, userId)

    // 3. Evaluate each value against reference ranges
    const patientAge = calcAgeInYears(patient.date_of_birth)
    const patientGender = patient.gender === 'Male' ? 'Male' : 'Female'

    const valuesToInsert = await Promise.all(
      inputs.map(async (input) => {
        let is_abnormal = false
        let is_critical = false

        if (input.valueNumeric !== null && input.valueNumeric !== undefined) {
          const ranges = await getReferenceRangesForTest(supabase, input.labTestId)
          const evaluation = evaluateRange(input.valueNumeric, ranges, patientGender, patientAge)
          is_abnormal = evaluation.is_abnormal
          is_critical = evaluation.is_critical
        }

        return {
          lab_result_id: result.id,
          lab_order_item_id: input.labOrderItemId,
          lab_test_id: input.labTestId,
          value_numeric: input.valueNumeric ?? null,
          value_text: input.valueText ?? null,
          is_abnormal,
          is_critical
        }
      })
    )

    await upsertResultValues(supabase, valuesToInsert)

    // 4. Advance status -> 'Result Ready'
    await labOrderService.advanceStatus(supabase, labOrderId, 'Result Ready', userId)

    return result
  },

  async verifyAndFinalize(
    supabase: SupabaseClient,
    labOrderId: string,
    labResultId: string,
    userId: string,
    remarks: string | null
  ) {
    await verifyLabResult(supabase, labResultId, remarks)

    // Update the lab_results verified fields
    const { error } = await supabase
      .from('lab_orders')
      .update({ verified_by: userId, verified_at: new Date().toISOString(), updated_at: new Date().toISOString() })
      .eq('id', labOrderId)
    if (error) throw new Error(error.message)

    await labOrderService.advanceStatus(supabase, labOrderId, 'Verified', userId, remarks ?? undefined)
  }
}
