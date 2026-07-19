import type { SupabaseClient } from '@supabase/supabase-js'
import type { NotificationTemplateRow } from '@/types/notifications'

export async function getTemplates(supabase: SupabaseClient, clinicId: string) {
  const { data, error } = await supabase
    .from('notification_templates')
    .select('*').limit(100)
    .eq('clinic_id', clinicId)
    .order('created_at', { ascending: false })
  
  if (error) throw new Error(`Failed to fetch templates: ${error.message}`)
  return data as NotificationTemplateRow[]
}

export async function getTemplateByEvent(
  supabase: SupabaseClient, 
  clinicId: string, 
  eventType: string, 
  channel: string
) {
  const { data, error } = await supabase
    .from('notification_templates')
    .select('*').limit(100)
    .eq('clinic_id', clinicId)
    .eq('event_type', eventType)
    .eq('channel', channel)
    .eq('is_active', true)
    .single()
    
  if (error && error.code !== 'PGRST116') { // PGRST116 is not found
    throw new Error(`Failed to fetch template: ${error.message}`)
  }
  return data as NotificationTemplateRow | null
}

export async function upsertTemplate(
  supabase: SupabaseClient, 
  payload: Partial<NotificationTemplateRow>
) {
  const { error } = await supabase
    .from('notification_templates')
    .upsert([payload])
    
  if (error) throw new Error(`Failed to save template: ${error.message}`)
}
