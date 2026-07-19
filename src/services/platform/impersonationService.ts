import type { SupabaseClient } from '@supabase/supabase-js'
import { appendAuditLog } from '@/repositories/platform/auditRepository'

export const impersonationService = {
  /**
   * Logs an impersonation intent and returns the target user details.
   * True session impersonation (JWT swap) requires Supabase Admin API with service_role key,
   * which must only ever be called from a secure server action — never from the browser.
   *
   * For this implementation, we log the event and return the target user's clinic context
   * so the support agent can navigate to the clinic's dashboard while the log creates a
   * full security audit trail.
   */
  async beginImpersonation(
    supabase: SupabaseClient,
    actorId: string,
    targetUserId: string,
    reason: string
  ) {
    const { data: targetUser, error } = await supabase
      .from('users')
      .select('id, email, first_name, last_name, clinic_id')
      .eq('id', targetUserId)
      .single()

    if (error || !targetUser) throw new Error('Target user not found')

    // Immutable audit log with highest security classification
    await appendAuditLog(
      supabase,
      actorId,
      'IMPERSONATION_BEGIN',
      'user',
      targetUserId,
      {
        target_email: targetUser.email,
        target_clinic_id: targetUser.clinic_id,
        reason,
        security_level: 'CRITICAL'
      }
    )

    return {
      targetUserId: targetUser.id,
      targetEmail: targetUser.email,
      targetClinicId: targetUser.clinic_id,
      targetName: `${targetUser.first_name} ${targetUser.last_name}`
    }
  }
}
