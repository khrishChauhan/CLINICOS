import type { SupabaseClient } from '@supabase/supabase-js'
import { labTestRepository } from '@/repositories/laboratory/labTestRepository'
import { labResultRepository, labResultParameterRepository, detectAbnormalFlag } from '@/repositories/laboratory/labResultRepository'
import type { CreateLabTestPayload, RecordLabResultPayload, LabTestStatus } from '@/types/laboratory'

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
  // Record result + parameters with auto abnormal flagging
  // ─────────────────────────────────────────────────────────────────────────────
  async recordLabResult(
    supabase: SupabaseClient,
    clinicId: string,
    userId: string,
    payload: RecordLabResultPayload
  ) {
    // Auto-detect abnormal flag for the overall result
    const overallFlag = detectAbnormalFlag(payload.result_value, payload.reference_range)

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
      const paramsWithFlags = payload.parameters.map(p => ({
        lab_result_id: result.id,
        parameter_name: p.parameter_name,
        parameter_value: p.parameter_value,
        unit: p.unit,
        reference_range: p.reference_range,
        abnormal_flag: detectAbnormalFlag(p.parameter_value, p.reference_range),
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
