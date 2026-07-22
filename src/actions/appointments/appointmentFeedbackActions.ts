'use server'

import { createClient } from '@/lib/supabase/server'
import { appointmentFeedbackService } from '@/services/appointments/appointmentFeedbackService'

export async function submitAppointmentFeedbackAction(
  appointmentId: string,
  overallRating: number,
  waitingTimeRating?: number,
  doctorExperienceRating?: number,
  staffRating?: number,
  cleanlinessRating?: number,
  comments?: string
) {
  try {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) throw new Error('Unauthorized')

    const { data: profile } = await supabase.from('users').select('clinic_id').eq('id', user.id).single()
    if (!profile?.clinic_id) throw new Error('Clinic ID not found')

    const data = await appointmentFeedbackService.submitFeedback(
      supabase,
      profile.clinic_id,
      appointmentId,
      user.id,
      overallRating,
      waitingTimeRating,
      doctorExperienceRating,
      staffRating,
      cleanlinessRating,
      comments
    )
    return { success: true, data }
  } catch (error: any) {
    return { success: false, error: error.message || 'Failed to submit feedback' }
  }
}

export async function getAppointmentFeedbackAction(appointmentId: string) {
  try {
    const supabase = await createClient()
    const data = await appointmentFeedbackService.getFeedback(supabase, appointmentId)
    return { success: true, data }
  } catch (error: any) {
    return { success: false, error: error.message || 'Failed to fetch feedback' }
  }
}
