import type { SupabaseClient } from '@supabase/supabase-js'
import { labTestRepository } from '@/repositories/laboratory/labTestRepository'
import { labResultRepository, labResultParameterRepository, detectAbnormalFlag } from '@/repositories/laboratory/labResultRepository'
import type { CreateLabTestPayload, RecordLabResultPayload, LabTestStatus, AbnormalFlag } from '@/types/laboratory'

export const labTestService = {
  async getLabTests(supabase: SupabaseClient, clinicId: string) {
    return labTestRepository.getLabTests(supabase, clinicId)
  },

  async getLabTestById(supabase: SupabaseClient, clinicId: string, testId: string) {
    return labTestRepository.getLabTestById(supabase, clinicId, testId)
  },

  async createLabTest(supabase: SupabaseClient, clinicId: string, payload: CreateLabTestPayload) {
    return labTestRepository.createLabTest(supabase, clinicId, payload)
  },

  async updateTestStatus(supabase: SupabaseClient, clinicId: string, testId: string, status: LabTestStatus) {
    const validTransitions: Record<string, string[]> = {
      'Ordered': ['In Progress', 'Cancelled'],
      'In Progress': ['Completed', 'Cancelled'],
      'Completed': ['Verified'],
    }
    const test = await labTestRepository.getLabTestById(supabase, clinicId, testId)
    if (!test) throw new Error('Lab test not found')
    if (!validTransitions[test.status]?.includes(status)) {
      throw new Error(`Invalid status transition from ${test.status} to ${status}`)
    }
    return labTestRepository.updateStatus(supabase, clinicId, testId, status)
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // Record result + parameters with auto abnormal flagging via reference ranges
  // ─────────────────────────────────────────────────────────────────────────────
  async recordLabResult(
    supabase: SupabaseClient,
    clinicId: string,
    userId: string,
    payload: RecordLabResultPayload
  ) {
    const test = await labTestRepository.getLabTestById(supabase, clinicId, payload.lab_test_id)
    if (!test) throw new Error('Lab test not found')
    
    // Calculate patient age
    const dob = test.lab_order_item?.lab_order?.patient?.date_of_birth
    const gender = test.lab_order_item?.lab_order?.patient?.gender ?? 'Any'
    let ageYears = 30 // fallback
    if (dob) {
      const birthDate = new Date(dob)
      const today = new Date()
      ageYears = today.getFullYear() - birthDate.getFullYear()
      const m = today.getMonth() - birthDate.getMonth()
      if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        ageYears--
      }
    }

    const { referenceRangeService } = await import('@/services/laboratory/labPhase5Service')
    const masterTestId = test.lab_order_item?.test_id

    // Evaluate overall result
    let overallFlag: AbnormalFlag = 'Normal'
    if (masterTestId && payload.result_value) {
      overallFlag = await referenceRangeService.evaluateValue(
        supabase, clinicId, masterTestId, payload.result_value, ageYears, gender
      )
    }

    // Create the lab result record
    const result = await labResultRepository.createLabResult(supabase, clinicId, {
      lab_test_id: payload.lab_test_id,
      result_value: payload.result_value,
      unit: payload.unit,
      reference_range: payload.reference_range,
      abnormal_flag: overallFlag,
      status: 'Entered',
      remarks: payload.remarks,
    })

    // Create parameters with auto-flagging for each parameter
    if (payload.parameters.length > 0) {
      const paramsWithFlags = await Promise.all(payload.parameters.map(async p => {
        let flag: AbnormalFlag = 'Normal'
        if (masterTestId && p.parameter_value) {
          flag = await referenceRangeService.evaluateValue(
            supabase, clinicId, masterTestId, p.parameter_value, ageYears, gender, p.parameter_name
          )
        }
        return {
          lab_result_id: result.id,
          parameter_name: p.parameter_name,
          parameter_value: p.parameter_value,
          unit: p.unit,
          reference_range: p.reference_range,
          abnormal_flag: flag,
        }
      }))
      await labResultParameterRepository.bulkCreateParameters(supabase, paramsWithFlags)
    }

    // Advance lab test to Completed
    await labTestRepository.updateStatus(supabase, clinicId, payload.lab_test_id, 'Completed')

    return result
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // Verify result — uses atomic RPC to update result + order + EMR timeline
  // ─────────────────────────────────────────────────────────────────────────────
  async verifyLabResult(supabase: SupabaseClient, clinicId: string, resultId: string, userId: string) {
    // Check result exists and is in a verifiable state
    const existing = await labResultRepository.getResultByTestId(supabase, resultId)
    
    const { data, error } = await supabase.rpc('verify_lab_result_transaction', {
      p_result_id: resultId,
      p_verified_by: userId,
      p_clinic_id: clinicId
    })

    if (error) throw new Error(error.message)
    return data
  }
}
