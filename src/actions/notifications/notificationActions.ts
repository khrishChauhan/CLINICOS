'use server'

import { createClient } from '@/lib/supabase/server'
import { getMyNotifications, markAsRead } from '@/repositories/notifications/inboxRepository'
import { getTemplates, upsertTemplate } from '@/repositories/notifications/templateRepository'
import { revalidatePath } from 'next/cache'

export async function fetchMyNotificationsAction() {
  try {
    const supabase = await createClient()
    const { data: session } = await supabase.rpc('get_session_context')
    if (!session) return { ok: true, data: [] }
    
    const data = await getMyNotifications(supabase, session.user_id)
    return { ok: true, data }
  } catch (e: any) {
    return { ok: false, error: e.message }
  }
}

export async function markNotificationReadAction(notificationId: string) {
  try {
    const supabase = await createClient()
    const { data: session } = await supabase.rpc('get_session_context')
    if (!session) throw new Error('Unauthorized')
    
    await markAsRead(supabase, notificationId, session.user_id)
    // Don't revalidate heavily here to avoid full page re-renders on a simple toggle, 
    // client state will handle it.
    return { ok: true }
  } catch (e: any) {
    return { ok: false, error: e.message }
  }
}

export async function fetchTemplatesAction() {
  try {
    const supabase = await createClient()
    const { data: session } = await supabase.rpc('get_session_context')
    if (!session) throw new Error('Unauthorized')
    
    const data = await getTemplates(supabase, session.clinic_id)
    return { ok: true, data }
  } catch (e: any) {
    return { ok: false, error: e.message }
  }
}

export async function saveTemplateAction(payload: any) {
  try {
    const supabase = await createClient()
    const { data: session } = await supabase.rpc('get_session_context')
    if (!session) throw new Error('Unauthorized')
    
    await upsertTemplate(supabase, { ...payload, clinic_id: session.clinic_id })
    revalidatePath('/settings/templates')
    return { ok: true }
  } catch (e: any) {
    return { ok: false, error: e.message }
  }
}
