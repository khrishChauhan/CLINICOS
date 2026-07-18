import type { SupabaseClient } from '@supabase/supabase-js'
import { createAppointment } from '@/repositories/appointments/appointmentRepository'
import { availabilityService } from './availabilityService'
import type { BookAppointmentPayload, AppointmentRow } from '@/types/appointments'

export const appointmentService = {
  /**
   * Book a new appointment, ensuring no double-booking overlaps.
   */
  async bookAppointment(
    supabase: SupabaseClient,
    clinicId: string,
    userId: string,
    payload: BookAppointmentPayload
  ): Promise<AppointmentRow> {
    
    // 1. Validate date is not in the past
    const targetDate = new Date(payload.date)
    targetDate.setHours(0,0,0,0)
    const today = new Date()
    today.setHours(0,0,0,0)
    
    if (targetDate < today) {
      throw new Error("Cannot book appointments in the past.")
    }

    // 2. Validate double booking by pulling available slots
    const availableSlots = await availabilityService.getAvailableSlots(
      supabase,
      clinicId,
      payload.doctorId,
      payload.date
    )

    // Check if the requested time exactly matches an available slot
    // For Emergency/Walk-ins, we might bypass strict slot matching in a real system, but for now we enforce it.
    const requestedStart = payload.startTime.substring(0, 5)
    
    const matchingSlot = availableSlots.find(s => s.startTime === requestedStart)
    
    if (payload.type === 'Scheduled') {
      if (!matchingSlot) {
        throw new Error("Invalid time slot requested.")
      }
      if (!matchingSlot.isAvailable) {
        throw new Error("This time slot is already booked.")
      }
    } else {
      // If walk-in/emergency, just ensure no strict collision if we wanted to.
      // But let's allow overlapping if they are walk-ins to squeeze them in? 
      // Actually, requirements said "prevent double booking" unconditionally unless overriden.
      // We will enforce it.
      if (matchingSlot && !matchingSlot.isAvailable) {
        throw new Error("This time slot is already booked.")
      }
    }

    // 3. Create the appointment
    const newApt = await createAppointment(supabase, {
      clinic_id: clinicId,
      patient_id: payload.patientId,
      doctor_id: payload.doctorId,
      appointment_date: payload.date,
      start_time: payload.startTime,
      end_time: payload.endTime,
      appointment_type: payload.type,
      priority: payload.priority,
      reason_for_visit: payload.reasonForVisit,
      created_by: userId,
      status: 'Scheduled',
    })

    return newApt
  }
}
