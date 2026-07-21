import type { SupabaseClient } from '@supabase/supabase-js'
import { onlineAppointmentRepository } from '@/repositories/appointments/onlineAppointmentRepository'

export const onlineBookingService = {
  async registerOnlineBooking(
    supabase: SupabaseClient,
    clinicId: string,
    appointmentId: string,
    platform: string,
    reference?: string,
    message?: string
  ) {
    return await onlineAppointmentRepository.createOnlineAppointment(supabase, {
      clinic_id: clinicId,
      appointment_id: appointmentId,
      booking_platform: platform,
      booking_reference: reference || null,
      patient_message: message || null,
      confirmation_status: 'Pending',
      confirmed_at: null,
      remarks: null
    })
  },

  async confirmOnlineBooking(supabase: SupabaseClient, onlineAppointmentId: string) {
    return await onlineAppointmentRepository.confirmBooking(supabase, onlineAppointmentId)
  },

  async getOnlineBookingDetails(supabase: SupabaseClient, appointmentId: string) {
    return await onlineAppointmentRepository.getOnlineAppointment(supabase, appointmentId)
  }
}
