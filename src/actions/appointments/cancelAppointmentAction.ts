'use server'

import { createClient } from '@/lib/supabase/server'
import { cancellationService } from '@/services/appointments/cancellationService'
import { revalidatePath } from 'next/cache'

export async function cancelAppointmentAction(
  appointmentId: string,
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

    const result = await cancellationService.cancelAppointment(
      supabase,
      appointmentId,
      profile.clinic_id,
      reason,
      user.id
    )

    revalidatePath('/appointments')
    revalidatePath('/queue')
    return { success: true, data: result }
  } catch (error: any) {
    console.error('Cancel error:', error)
    return { success: false, error: error.message || 'Failed to cancel appointment' }
  }
}
