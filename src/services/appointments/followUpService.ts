import type { SupabaseClient } from '@supabase/supabase-js'
import { followUpRepository } from '@/repositories/appointments/followUpRepository'
import { createAppointment } from '@/repositories/appointments/appointmentRepository'

export const followUpService = {
  async createFollowUp(
    supabase: SupabaseClient,
    clinicId: string,
    parentAppointmentId: string,
    patientId: string,
    doctorId: string | null,
    date: string,
    reason: string,
    userId: string
  ) {
    // 1. Create Follow-up Record
    const followUp = await followUpRepository.createFollowUp(supabase, {
      clinic_id: clinicId,
      parent_appointment_id: parentAppointmentId,
      patient_id: patientId,
      doctor_id: doctorId,
      followup_date: date,
      followup_reason: reason,
      reminder_sent: false,
      status: 'Pending'
    })

    // 2. Create the actual future Appointment
    const apt = await createAppointment(supabase, {
      clinic_id: clinicId,
      patient_id: patientId,
      doctor_id: doctorId || undefined,
      appointment_source: 'Follow-up',
      appointment_date: date,
      appointment_start_time: '09:00:00', // Default or prompt user
      appointment_end_time: '09:15:00',
      consultation_type: 'In-person',
      priority: 'Normal',
      visit_type: 'Follow-up',
      reason_for_visit: reason,
      status: 'Scheduled',
      booked_by: userId
    })

    return { followUp, appointment: apt }
  }
}
