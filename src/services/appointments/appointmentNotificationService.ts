import type { SupabaseClient } from '@supabase/supabase-js'
import { appointmentNotificationRepository } from '@/repositories/appointments/appointmentNotificationRepository'
import { notificationService } from '@/services/notifications/notificationService'

export const appointmentNotificationService = {
  /**
   * Logs an appointment notification and routes it via the Notification Center
   */
  async dispatchAppointmentNotification(
    supabase: SupabaseClient,
    clinicId: string,
    appointmentId: string,
    notificationType: string,
    channels: ('In-App' | 'SMS' | 'Email')[],
    recipientStr: string, // Typically just userId or phone number, used for local schema logging
    recipientDetails: { userId?: string, patientId?: string, contactInfo?: string },
    context: Record<string, string>,
    remarks?: string
  ) {
    // 1. Dispatch via main Notification Center
    await notificationService.dispatch(
      supabase,
      clinicId,
      notificationType,
      channels,
      context,
      recipientDetails
    )

    // 2. Log in appointment_notifications for all channels
    for (const channel of channels) {
      await appointmentNotificationRepository.createNotification(supabase, {
        clinic_id: clinicId,
        appointment_id: appointmentId,
        notification_type: notificationType,
        channel: channel,
        recipient: recipientStr,
        notification_status: 'Sent',
        sent_at: new Date().toISOString(),
        delivered_at: null,
        remarks: remarks || null
      })
    }
  },

  async getNotifications(supabase: SupabaseClient, appointmentId: string) {
    return await appointmentNotificationRepository.getNotificationsByAppointmentId(supabase, appointmentId)
  }
}
