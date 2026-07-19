import type { SupabaseClient } from '@supabase/supabase-js'
import { getTemplateByEvent } from '@/repositories/notifications/templateRepository'
import { templateEngine } from './templateEngine'
import { inAppDeliveryService } from './inAppDeliveryService'
import { logCommunication } from '@/repositories/notifications/historyRepository'

export const notificationService = {
  /**
   * Dispatches an event to the notification engine.
   * Currently supports 'In-App' and mock 'SMS'/'Email' channels.
   */
  async dispatch(
    supabase: SupabaseClient,
    clinicId: string,
    eventType: string,
    channels: ('In-App' | 'SMS' | 'Email')[],
    context: Record<string, string>,
    recipient: { userId?: string, patientId?: string, contactInfo?: string }
  ) {
    for (const channel of channels) {
      const template = await getTemplateByEvent(supabase, clinicId, eventType, channel)
      
      if (!template) {
        // No active template found for this channel/event combination. Skip.
        continue
      }

      // Parse the template content and subject
      const parsedMessage = templateEngine.parse(template.content, context)
      const parsedSubject = template.subject ? templateEngine.parse(template.subject, context) : template.name

      try {
        if (channel === 'In-App') {
          if (!recipient.userId) throw new Error('userId required for In-App delivery')
          
          await inAppDeliveryService.deliver(
            supabase, 
            clinicId, 
            recipient.userId, 
            parsedSubject, 
            parsedMessage, 
            'Info'
          )
        } else if (channel === 'SMS' || channel === 'Email') {
          // MOCK EXTERNAL DELIVERY
          // In a real environment, we would call Twilio or SendGrid here.
          
          await logCommunication(supabase, {
            clinic_id: clinicId,
            patient_id: recipient.patientId || null,
            channel: channel,
            event_type: eventType,
            message_content: parsedMessage,
            status: 'Sent',
            error_message: null
          })
        }
      } catch (e: any) {
        // Log failure for external channels
        if (channel !== 'In-App') {
          await logCommunication(supabase, {
            clinic_id: clinicId,
            patient_id: recipient.patientId || null,
            channel: channel,
            event_type: eventType,
            message_content: parsedMessage,
            status: 'Failed',
            error_message: e.message
          })
        }
        console.error(`Notification Dispatch Error [${channel}]:`, e.message)
      }
    }
  }
}
