import type { SupabaseClient } from '@supabase/supabase-js'
import { appointmentReminderRepository } from '@/repositories/appointments/appointmentReminderRepository'

export const appointmentReminderService = {
  async scheduleReminder(
    supabase: SupabaseClient, 
    clinicId: string, 
    appointmentId: string, 
    type: string, 
    channel: string, 
    scheduledTime: string,
    remarks?: string
  ) {
    // Write logic here for complex time parsing if needed
    return await appointmentReminderRepository.createReminder(supabase, {
      clinic_id: clinicId,
      appointment_id: appointmentId,
      reminder_type: type,
      reminder_channel: channel,
      scheduled_time: scheduledTime,
      sent_time: null,
      delivery_status: 'Scheduled',
      retry_count: 0,
      remarks: remarks || null
    })
  },

  async markSent(supabase: SupabaseClient, reminderId: string) {
    return await appointmentReminderRepository.updateReminderStatus(supabase, reminderId, 'Sent', new Date().toISOString())
  },

  async markFailed(supabase: SupabaseClient, reminderId: string) {
    return await appointmentReminderRepository.updateReminderStatus(supabase, reminderId, 'Failed')
  },
  
  async getReminders(supabase: SupabaseClient, appointmentId: string) {
    return await appointmentReminderRepository.getRemindersByAppointmentId(supabase, appointmentId)
  }
}
