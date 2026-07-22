import type { SupabaseClient } from '@supabase/supabase-js'
import { appointmentAuditRepository } from '@/repositories/appointments/appointmentAuditRepository'

export const appointmentAuditService = {
  /**
   * Securely logs an action to the immutable appointment_audit table.
   * `performedBy` can be null for system actions (like chron jobs).
   */
  async logAction(
    supabase: SupabaseClient,
    clinicId: string,
    appointmentId: string,
    action: string,
    performedBy: string | null,
    previousValue: Record<string, any> | null,
    newValue: Record<string, any> | null,
    metadata?: Record<string, any>
  ) {
    try {
      await appointmentAuditRepository.createAuditLog(supabase, {
        clinic_id: clinicId,
        appointment_id: appointmentId,
        action,
        performed_by: performedBy,
        previous_value: previousValue,
        new_value: newValue,
        ip_address: null, // Depending on Next.js headers, IP could be captured at Server Action layer
        metadata: metadata || null
      })
    } catch (err: any) {
      console.error('CRITICAL: Failed to drop audit log.', err.message)
      // We log but do not throw to prevent blocking core workflows if audit fails.
    }
  },

  async getAuditLogs(supabase: SupabaseClient, appointmentId: string) {
    return await appointmentAuditRepository.getAuditLogsByAppointment(supabase, appointmentId)
  }
}
