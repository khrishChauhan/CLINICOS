import type { SupabaseClient } from '@supabase/supabase-js'
import { provisionClinic, getAllClinics, getPlatformKPIs, getSubscriptionPlans, updateClinicStatus } from '@/repositories/platform/tenantRepository'
import { appendAuditLog } from '@/repositories/platform/auditRepository'
import type { ProvisionPayload } from '@/types/platform'

export const tenantService = {
  async getKPIs(supabase: SupabaseClient) {
    return getPlatformKPIs(supabase)
  },

  async listClinics(supabase: SupabaseClient) {
    return getAllClinics(supabase)
  },

  async listPlans(supabase: SupabaseClient) {
    return getSubscriptionPlans(supabase)
  },

  /**
   * Orchestrates atomic provisioning via the Supabase RPC.
   * A single DB transaction ensures all entities are created or none are.
   */
  async provision(supabase: SupabaseClient, actorId: string, payload: ProvisionPayload) {
    const result = await provisionClinic(supabase, payload)

    // Append immutable audit trail
    await appendAuditLog(
      supabase,
      actorId,
      'CLINIC_PROVISIONED',
      'clinic',
      result.clinic_id,
      { clinic_name: payload.clinicName, plan: payload.planCode, admin_email: payload.adminEmail }
    )

    return result
  },

  async suspendClinic(supabase: SupabaseClient, actorId: string, clinicId: string) {
    await updateClinicStatus(supabase, clinicId, 'Suspended')
    await appendAuditLog(supabase, actorId, 'CLINIC_SUSPENDED', 'clinic', clinicId)
  },

  async reactivateClinic(supabase: SupabaseClient, actorId: string, clinicId: string) {
    await updateClinicStatus(supabase, clinicId, 'Active')
    await appendAuditLog(supabase, actorId, 'CLINIC_REACTIVATED', 'clinic', clinicId)
  }
}
