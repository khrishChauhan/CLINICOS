import type { SupabaseClient } from '@supabase/supabase-js'
import { doctorBlockedSlotRepository } from '@/repositories/doctors/doctorBlockedSlotRepository'
import { getAppointmentsByDate } from '@/repositories/appointments/appointmentRepository'
import type { DoctorBlockedSlotRow } from '@/types/doctors'

export const doctorBlockedSlotService = {
  async createBlockAndCheckConflicts(
    supabase: SupabaseClient, 
    clinicId: string, 
    payload: Partial<DoctorBlockedSlotRow>
  ) {
    if (!payload.doctor_id || !payload.block_date || !payload.start_time || !payload.end_time) {
      throw new Error("Missing required fields for blocking slot.")
    }

    // 1. Create the Blocked Slot
    const newBlock = await doctorBlockedSlotRepository.createBlockedSlot(supabase, payload)

    // 2. Identify existing appointments that conflict with this new block
    const dateStr = payload.block_date
    const appointments = await getAppointmentsByDate(supabase, clinicId, payload.doctor_id, dateStr)
    
    const blockStart = new Date(`${dateStr}T${payload.start_time}`)
    const blockEnd = new Date(`${dateStr}T${payload.end_time}`)

    const conflicts = appointments.filter(apt => {
      const aptStart = new Date(`${dateStr}T${apt.appointment_start_time}`)
      const aptEnd = new Date(`${dateStr}T${apt.appointment_end_time}`)
      
      // Check for overlap: max(start) < min(end)
      const overlapStart = aptStart > blockStart ? aptStart : blockStart
      const overlapEnd = aptEnd < blockEnd ? aptEnd : blockEnd
      return overlapStart < overlapEnd
    })

    return {
      blockedSlot: newBlock,
      conflictingAppointments: conflicts
    }
  }
}
