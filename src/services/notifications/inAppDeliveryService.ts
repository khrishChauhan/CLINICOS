import type { SupabaseClient } from '@supabase/supabase-js'
import { createNotification } from '@/repositories/notifications/inboxRepository'

export const inAppDeliveryService = {
  async deliver(
    supabase: SupabaseClient, 
    clinicId: string, 
    userId: string, 
    title: string, 
    message: string, 
    type: 'Info' | 'Alert' | 'Success' = 'Info'
  ) {
    await createNotification(supabase, {
      clinic_id: clinicId,
      user_id: userId,
      title,
      message,
      type
    })
  }
}
