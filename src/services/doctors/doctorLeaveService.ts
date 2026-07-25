import type { SupabaseClient } from '@supabase/supabase-js'
import { doctorLeaveRepository } from '@/repositories/doctors/doctorLeaveRepository'
import type { DoctorLeaveRow } from '@/types/doctors'

export const doctorLeaveService = {
  async applyForLeave(
    supabase: SupabaseClient, 
    clinicId: string, 
    payload: Partial<DoctorLeaveRow>
  ) {
    // For MVP, defaulting to Approved automatically
    const leavePayload = {
      ...payload,
      approval_status: 'Approved'
    }

    const newLeave = await doctorLeaveRepository.createLeave(supabase, leavePayload)

    // A real system would now scan getAppointmentsByDateRange for the leave dates
    // and flag conflicts. For simplicity, we just return the leave.
    
    return {
      leave: newLeave,
      conflictingAppointments: [] // Placeholder for future enhancement
    }
  }
}
