'use server'

import { createClient } from '@/lib/supabase/server'
import { tenantService } from '@/services/platform/tenantService'
import { getAuditLogs } from '@/repositories/platform/auditRepository'
import { impersonationService } from '@/services/platform/impersonationService'
import { revalidatePath } from 'next/cache'
import type { ProvisionPayload } from '@/types/platform'

async function getPlatformActor(supabase: Awaited<ReturnType<typeof createClient>>) {
  const { data: session } = await supabase.rpc('get_session_context')
  if (!session) throw new Error('Unauthorized')
  return session
}

export async function fetchPlatformKPIsAction() {
  try {
    const supabase = await createClient()
    await getPlatformActor(supabase)
    const data = await tenantService.getKPIs(supabase)
    return { ok: true, data }
  } catch (e: any) {
    return { ok: false, error: e.message }
  }
}

export async function fetchTenantsAction() {
  try {
    const supabase = await createClient()
    await getPlatformActor(supabase)
    const [clinics, plans] = await Promise.all([
      tenantService.listClinics(supabase),
      tenantService.listPlans(supabase)
    ])
    return { ok: true, clinics, plans }
  } catch (e: any) {
    return { ok: false, error: e.message }
  }
}

export async function provisionClinicAction(payload: ProvisionPayload) {
  try {
    const supabase = await createClient()
    const session = await getPlatformActor(supabase)
    const result = await tenantService.provision(supabase, session.user_id, payload)
    revalidatePath('/platform/tenants')
    return { ok: true, data: result }
  } catch (e: any) {
    return { ok: false, error: e.message }
  }
}

export async function suspendClinicAction(clinicId: string) {
  try {
    const supabase = await createClient()
    const session = await getPlatformActor(supabase)
    await tenantService.suspendClinic(supabase, session.user_id, clinicId)
    revalidatePath('/platform/tenants')
    return { ok: true }
  } catch (e: any) {
    return { ok: false, error: e.message }
  }
}

export async function reactivateClinicAction(clinicId: string) {
  try {
    const supabase = await createClient()
    const session = await getPlatformActor(supabase)
    await tenantService.reactivateClinic(supabase, session.user_id, clinicId)
    revalidatePath('/platform/tenants')
    return { ok: true }
  } catch (e: any) {
    return { ok: false, error: e.message }
  }
}

export async function fetchAuditLogsAction() {
  try {
    const supabase = await createClient()
    await getPlatformActor(supabase)
    const data = await getAuditLogs(supabase)
    return { ok: true, data }
  } catch (e: any) {
    return { ok: false, error: e.message }
  }
}

export async function beginImpersonationAction(targetUserId: string, reason: string) {
  try {
    const supabase = await createClient()
    const session = await getPlatformActor(supabase)
    const result = await impersonationService.beginImpersonation(supabase, session.user_id, targetUserId, reason)
    return { ok: true, data: result }
  } catch (e: any) {
    return { ok: false, error: e.message }
  }
}
