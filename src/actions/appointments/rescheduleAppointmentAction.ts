'use server'

import { createClient } from '@/lib/supabase/server'
import { rescheduleService } from '@/services/appointments/rescheduleService'
import { revalidatePath } from 'next/cache'

export async function rescheduleAppointmentAction(
  appointmentId: string,
  newDate: string,
  newTime: string,
  reason: string
) {
  try {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) throw new Error('Unauthorized')

    const { data: profile } = await supabase
      .from('users')
      .select('clinic_id')
      .eq('id', user.id)
      .single()

    if (!profile?.clinic_id) throw new Error('Clinic ID not found')

    const result = await rescheduleService.rescheduleAppointment(
      supabase,
      appointmentId,
      profile.clinic_id,
      newDate,
      newTime,
      reason,
      user.id
    )

    revalidatePath('/appointments')
    revalidatePath('/queue')
    return { success: true, data: result }
  } catch (error: any) {
    console.error('Reschedule error:', error)
    return { success: false, error: error.message || 'Failed to reschedule appointment' }
  }
}
