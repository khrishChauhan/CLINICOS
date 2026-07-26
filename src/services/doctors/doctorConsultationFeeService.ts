import type { SupabaseClient } from '@supabase/supabase-js'
import { doctorConsultationFeeRepository } from '@/repositories/doctors/doctorConsultationFeeRepository'
import type { DoctorConsultationFeeRow } from '@/types/doctors'

export const doctorConsultationFeeService = {
  async addFeeConfiguration(
    supabase: SupabaseClient, 
    clinicId: string, 
    payload: Partial<DoctorConsultationFeeRow>
  ) {
    if (!payload.doctor_id || !payload.consultation_type || !payload.effective_from) {
      throw new Error("Missing required fields for Fee configuration.")
    }

    // 1. Fetch existing fees to see if there is an active one for this type
    const existingFees = await doctorConsultationFeeRepository.getFeesByDoctor(supabase, clinicId, payload.doctor_id)
    const activeFee = existingFees.find(f => f.consultation_type === payload.consultation_type && f.status === 'Active')

    // 2. If there is an active fee, mark it as Inactive
    if (activeFee) {
      await doctorConsultationFeeRepository.updateFeeStatus(supabase, activeFee.id, 'Inactive')
    }

    // 3. Create the new active fee
    const newFee = await doctorConsultationFeeRepository.createFee(supabase, {
      ...payload,
      status: 'Active'
    })

    return newFee
  }
}
