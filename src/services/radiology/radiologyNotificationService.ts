import type { SupabaseClient } from '@supabase/supabase-js'
import { radiologyNotificationRepository } from '@/repositories/radiology/radiologyNotificationRepository'
import { radiologyAuditRepository } from '@/repositories/radiology/radiologyAuditRepository'

export const radiologyNotificationService = {
  async getNotifications(supabase: SupabaseClient, clinicId: string) {
    return radiologyNotificationRepository.getNotificationsByClinic(supabase, clinicId)
  },

  async dispatchNotification(
    supabase: SupabaseClient,
    clinicId: string,
    orderId: string,
    recipientType: string,
    notificationType: string,
    recipientId: string | null,
    messageBody: string,
    userId: string
  ) {
    // 1. Insert into Global Notification Queue
    const { error: queueError } = await supabase
      .from('notification_queue')
      .insert([{
        clinic_id: clinicId,
        recipient_type: recipientType,
        recipient_id: recipientId,
        notification_type: notificationType,
        message_body: messageBody,
        status: 'Pending'
      }])

    if (queueError) throw new Error(`Notification queue failed: ${queueError.message}`)

    // 2. Insert into Radiology tracking table
    const notification = await radiologyNotificationRepository.logNotification(supabase, {
      clinic_id: clinicId,
      radiology_order_id: orderId,
      recipient_type: recipientType,
      notification_type: notificationType,
      status: 'Sent',
      sent_at: new Date().toISOString()
    })

    // 3. Audit Log
    await radiologyAuditRepository.logAction(supabase, {
      clinic_id: clinicId,
      radiology_order_id: orderId,
      action: 'Notification Sent',
      action_by: userId,
      new_value: { notification_type: notificationType, recipient_type: recipientType }
    })

    return notification
  }
}
