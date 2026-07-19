import type { SupabaseClient } from '@supabase/supabase-js'
import type { NotificationRow } from '@/types/notifications'

export async function getMyNotifications(supabase: SupabaseClient, userId: string) {
  const { data, error } = await supabase
    .from('notifications')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(50)
    
  if (error) throw new Error(`Failed to fetch notifications: ${error.message}`)
  return data as NotificationRow[]
}

export async function createNotification(
  supabase: SupabaseClient, 
  payload: Omit<NotificationRow, 'id' | 'is_read' | 'read_at' | 'created_at'>
) {
  const { error } = await supabase
    .from('notifications')
    .insert([payload])
    
  if (error) throw new Error(`Failed to create notification: ${error.message}`)
}

export async function markAsRead(supabase: SupabaseClient, notificationId: string, userId: string) {
  const { error } = await supabase
    .from('notifications')
    .update({ is_read: true, read_at: new Date().toISOString() })
    .eq('id', notificationId)
    .eq('user_id', userId)
    
  if (error) throw new Error(`Failed to mark read: ${error.message}`)
}
