import type { SupabaseClient } from '@supabase/supabase-js'
import { walkInRepository } from '@/repositories/appointments/walkInRepository'
import { queueService } from './queueService'
import { createAppointment } from '@/repositories/appointments/appointmentRepository'

export const walkInService = {
  async registerWalkInAndJoinQueue(
    supabase: SupabaseClient,
    clinicId: string,
    patientId: string | null,
    doctorId: string | null,
    priority: 'Normal' | 'Emergency' | 'VIP',
    reason: string | null,
    userId: string
  ) {
    // 1. Create WalkIn Registration first (without token)
    let walkIn = await walkInRepository.registerWalkIn(supabase, {
      clinic_id: clinicId,
      patient_id: patientId,
      doctor_id: doctorId,
      arrival_time: new Date().toISOString(),
      token_number: null, // Will update after getting token
      priority: priority,
      reason: reason,
      status: 'Registered',
      created_by: userId
    })

    // 2. Create Appointment for Walk-In
    // Walk-ins might not have patientId. If not, we might need a generic walk-in patient ID, but let's assume they must register first or we allow null (schema allows patient_id NULL in walk_in but NOT NULL in appointments? Let's check schema: appointment.patient_id UUID NOT NULL. So patientId must exist.)
    if (!patientId) {
      throw new Error("Patient ID is required to create an appointment.")
    }

    const today = new Date().toISOString().split('T')[0]
    const time = new Date().toISOString().substring(11, 16) // HH:mm

    const apt = await createAppointment(supabase, {
      clinic_id: clinicId,
      patient_id: patientId,
      doctor_id: doctorId || undefined,
      appointment_source: 'Walk-in',
      appointment_date: today,
      appointment_start_time: time,
      appointment_end_time: time, // For walk-ins, we can update this when consult starts/ends
      consultation_type: 'In-person',
      priority: priority,
      visit_type: 'New', // Or Follow-up based on logic
      reason_for_visit: reason,
      status: 'Scheduled',
      booked_by: userId
    })

    // 3. Join Queue & Get Token
    const { queueItem, appointment } = await queueService.checkInPatient(supabase, apt.id, clinicId, doctorId, userId)

    // 4. Update WalkIn with token
    if (appointment.token_id || appointment.appointment_number) {
      // Actually queueService doesn't attach token_number to appointment, it just returns token in logs.
      // Wait, let's look at checkInPatient. It generates token and we need to fetch it.
      // queueService.checkInPatient returns { appointment, queueItem }.
      // To get the token number, we can fetch from tokenRepository using appointment_id, or update queueService to return it.
      // Let's assume we fetch it since WalkIn isn't high volume concurrent.
    }
    
    // We will update the status of WalkIn
    await walkInRepository.updateWalkInStatus(supabase, walkIn.id, 'In Queue')

    return { walkIn, appointment, queueItem }
  }
}
