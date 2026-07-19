import type { SupabaseClient } from '@supabase/supabase-js'
import type { PlatformAuditLog } from '@/types/platform'

export async function appendAuditLog(
  supabase: SupabaseClient,
  actorUserId: string,
  action: string,
  targetType?: string,
  targetId?: string,
  metadata?: Record<string, any>
) {
  const { error } = await supabase
    .from('platform_audit_logs')
    .insert([{
      actor_user_id: actorUserId,
      action,
      target_type: targetType || null,
      target_id: targetId || null,
      metadata: metadata || {}
    }])

  if (error) throw new Error(`Failed to write audit log: ${error.message}`)
}

export async function getAuditLogs(supabase: SupabaseClient) {
  const { data, error } = await supabase
    .from('platform_audit_logs')
    .select('*, users(first_name, last_name, email)')
    .order('created_at', { ascending: false })
    .limit(100)

  if (error) throw new Error(`Failed to fetch audit logs: ${error.message}`)
  return data as PlatformAuditLog[]
}
