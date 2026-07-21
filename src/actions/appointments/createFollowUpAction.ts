'use server'

import { createClient } from '@/lib/supabase/server'
import { followUpService } from '@/services/appointments/followUpService'
import { revalidatePath } from 'next/cache'

export async function createFollowUpAction(
  parentAppointmentId: string,
  patientId: string,
  doctorId: string | null,
  date: string,
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

    const result = await followUpService.createFollowUp(
      supabase,
      profile.clinic_id,
      parentAppointmentId,
      patientId,
      doctorId,
      date,
      reason,
      user.id
    )

    revalidatePath('/appointments')
    revalidatePath('/queue')
    return { success: true, data: result }
  } catch (error: any) {
    console.error('Follow-up error:', error)
    return { success: false, error: error.message || 'Failed to create follow-up' }
  }
}
