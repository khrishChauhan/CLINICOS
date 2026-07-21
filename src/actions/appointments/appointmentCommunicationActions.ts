'use server'

import { createClient } from '@/lib/supabase/server'
import { appointmentReminderService } from '@/services/appointments/appointmentReminderService'
import { appointmentNotificationService } from '@/services/appointments/appointmentNotificationService'

export async function scheduleReminderAction(
  appointmentId: string,
  type: string,
  channel: string,
  scheduledTime: string,
  remarks?: string
) {
  try {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) throw new Error('Unauthorized')

    const { data: profile } = await supabase.from('users').select('clinic_id').eq('id', user.id).single()
    if (!profile?.clinic_id) throw new Error('Clinic ID not found')

    const data = await appointmentReminderService.scheduleReminder(
      supabase,
      profile.clinic_id,
      appointmentId,
      type,
      channel,
      scheduledTime,
      remarks
    )
    return { success: true, data }
  } catch (error: any) {
    return { success: false, error: error.message || 'Failed to schedule reminder' }
  }
}

export async function fetchAppointmentRemindersAction(appointmentId: string) {
  try {
    const supabase = await createClient()
    const data = await appointmentReminderService.getReminders(supabase, appointmentId)
    return { success: true, data }
  } catch (error: any) {
    return { success: false, error: error.message || 'Failed to fetch reminders' }
  }
}

export async function fetchAppointmentNotificationsAction(appointmentId: string) {
  try {
    const supabase = await createClient()
    const data = await appointmentNotificationService.getNotifications(supabase, appointmentId)
    return { success: true, data }
  } catch (error: any) {
    return { success: false, error: error.message || 'Failed to fetch notifications' }
  }
}
