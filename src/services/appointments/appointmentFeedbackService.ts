import type { SupabaseClient } from '@supabase/supabase-js'
import { appointmentFeedbackRepository } from '@/repositories/appointments/appointmentFeedbackRepository'
import { appointmentAuditService } from '@/services/appointments/appointmentAuditService'

export const appointmentFeedbackService = {
  async submitFeedback(
    supabase: SupabaseClient,
    clinicId: string,
    appointmentId: string,
    userId: string,
    overallRating: number,
    waitingTimeRating?: number,
    doctorExperienceRating?: number,
    staffRating?: number,
    cleanlinessRating?: number,
    comments?: string
  ) {
    // 1. Validate Appointment Status
    const { data: apt, error } = await supabase
      .from('appointments')
      .select('status')
      .eq('id', appointmentId)
      .single()
      
    if (error || !apt) throw new Error('Appointment not found.')
    if (apt.status !== 'Completed') throw new Error('Feedback can only be submitted for completed appointments.')

    // 2. Submit Feedback
    const feedback = await appointmentFeedbackRepository.submitFeedback(supabase, {
      clinic_id: clinicId,
      appointment_id: appointmentId,
      overall_rating: overallRating,
      waiting_time_rating: waitingTimeRating || null,
      doctor_experience_rating: doctorExperienceRating || null,
      staff_rating: staffRating || null,
      cleanliness_rating: cleanlinessRating || null,
      comments: comments || null
    })

    // 3. Drop Audit Log
    await appointmentAuditService.logAction(
      supabase,
      clinicId,
      appointmentId,
      'Feedback Submitted',
      userId,
      null,
      { overallRating, comments }
    )

    return feedback
  },

  async getFeedback(supabase: SupabaseClient, appointmentId: string) {
    return await appointmentFeedbackRepository.getFeedbackByAppointment(supabase, appointmentId)
  }
}
