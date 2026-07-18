import type { SupabaseClient } from '@supabase/supabase-js'
import { updateAppointmentStatus } from '@/repositories/appointments/appointmentRepository'
import type { AppointmentRow } from '@/types/appointments'

export const queueService = {
  
  /**
   * Transition an appointment to "Checked In" and generate a queue token.
   * Uses an RPC in production to guarantee atomic token generation.
   * For MVP, we'll use a simple count or RPC `generate_queue_token`.
   */
  async checkInPatient(
    supabase: SupabaseClient,
    appointmentId: string,
    userId: string
  ): Promise<AppointmentRow> {
    
    // Ideally, we assign token_number here via RPC:
    const { data: tokenData, error: tokenError } = await supabase.rpc('generate_queue_token', {
      p_appointment_id: appointmentId
    })

    // If RPC doesn't exist, we fallback
    if (tokenError) {
      console.warn("Queue Token RPC failed or missing, skipping token assignment", tokenError)
    }

    return await updateAppointmentStatus(supabase, appointmentId, 'Checked In', userId, 'Patient arrived at clinic')
  },

  /**
   * Move from Checked In to In Consultation
   */
  async startConsultation(
    supabase: SupabaseClient,
    appointmentId: string,
    userId: string
  ): Promise<AppointmentRow> {
    return await updateAppointmentStatus(supabase, appointmentId, 'In Consultation', userId, 'Doctor started consultation')
  },

  /**
   * Mark as Completed
   */
  async completeConsultation(
    supabase: SupabaseClient,
    appointmentId: string,
    userId: string
  ): Promise<AppointmentRow> {
    return await updateAppointmentStatus(supabase, appointmentId, 'Completed', userId, 'Consultation finished')
  },
  
  /**
   * Mark as Cancelled
   */
  async cancelAppointment(
    supabase: SupabaseClient,
    appointmentId: string,
    userId: string,
    reason: string
  ): Promise<AppointmentRow> {
    return await updateAppointmentStatus(supabase, appointmentId, 'Cancelled', userId, reason)
  }
}
