'use server'

import { createClient } from '@/lib/supabase/server'
import { calendarService } from '@/services/appointments/calendarService'

export async function getCalendarEventsAction(
  doctorId: string,
  startDate: string,
  endDate: string
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

    const result = await calendarService.getUnifiedCalendar(
      supabase,
      profile.clinic_id,
      doctorId,
      startDate,
      endDate
    )

    return { success: true, data: result }
  } catch (error: any) {
    console.error('Calendar error:', error)
    return { success: false, error: error.message || 'Failed to fetch calendar' }
  }
}
