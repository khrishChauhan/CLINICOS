'use server'

import { createClient, createAdminClient } from '@/lib/supabase/server'
import {
  referenceRangeService,
  specimenTypeService,
  labConsumableService,
  labAttachmentService,
  labNotificationService,
  labAuditService
} from '@/services/laboratory/labPhase5Service'
import { revalidatePath } from 'next/cache'
import type { ReferenceRangeRow, SpecimenTypeRow, LabConsumableRow, LabNotificationRow } from '@/types/laboratory'

async function getAuthContext() {
  const supabase = await createClient()
  const { data: { user }, error } = await supabase.auth.getUser()
  if (error || !user) throw new Error('Unauthorized')
  const adminClient = createAdminClient()
  const { data: profile } = await adminClient.from('users').select('clinic_id').eq('id', user.id).single()
  if (!profile?.clinic_id) throw new Error('Clinic not found')
  return { supabase, user, clinicId: profile.clinic_id }
}

// ─────────────────────────────────────────────────────────────────────────────
// Reference Ranges
// ─────────────────────────────────────────────────────────────────────────────
export async function getReferenceRangesAction(testId?: string) {
  try {
    const { supabase, clinicId } = await getAuthContext()
    const data = await referenceRangeService.getRanges(supabase, clinicId, testId)
    return { success: true, data }
  } catch (e: any) { return { success: false, error: e.message } }
}

export async function createReferenceRangeAction(payload: Omit<ReferenceRangeRow, 'id' | 'clinic_id' | 'created_at' | 'updated_at'>) {
  try {
    const { supabase, clinicId } = await getAuthContext()
    const data = await referenceRangeService.createRange(supabase, clinicId, payload)
    revalidatePath('/laboratory/settings')
    return { success: true, data }
  } catch (e: any) { return { success: false, error: e.message } }
}

export async function deleteReferenceRangeAction(rangeId: string) {
  try {
    const { supabase, clinicId } = await getAuthContext()
    await referenceRangeService.deleteRange(supabase, clinicId, rangeId)
    revalidatePath('/laboratory/settings')
    return { success: true }
  } catch (e: any) { return { success: false, error: e.message } }
}

// ─────────────────────────────────────────────────────────────────────────────
// Specimen Types
// ─────────────────────────────────────────────────────────────────────────────
export async function getSpecimenTypesAction() {
  try {
    const { supabase, clinicId } = await getAuthContext()
    const data = await specimenTypeService.getSpecimenTypes(supabase, clinicId)
    return { success: true, data }
  } catch (e: any) { return { success: false, error: e.message } }
}

export async function createSpecimenTypeAction(payload: Omit<SpecimenTypeRow, 'id' | 'clinic_id' | 'created_at' | 'updated_at'>) {
  try {
    const { supabase, clinicId } = await getAuthContext()
    const data = await specimenTypeService.createSpecimenType(supabase, clinicId, payload)
    revalidatePath('/laboratory/settings')
    return { success: true, data }
  } catch (e: any) { return { success: false, error: e.message } }
}

// ─────────────────────────────────────────────────────────────────────────────
// Consumables
// ─────────────────────────────────────────────────────────────────────────────
export async function getLabConsumablesAction() {
  try {
    const { supabase, clinicId } = await getAuthContext()
    const data = await labConsumableService.getConsumables(supabase, clinicId)
    return { success: true, data }
  } catch (e: any) { return { success: false, error: e.message } }
}

export async function createLabConsumableAction(payload: Omit<LabConsumableRow, 'id' | 'clinic_id' | 'created_at' | 'updated_at'>) {
  try {
    const { supabase, clinicId } = await getAuthContext()
    const data = await labConsumableService.createConsumable(supabase, clinicId, payload)
    revalidatePath('/laboratory/settings')
    return { success: true, data }
  } catch (e: any) { return { success: false, error: e.message } }
}

// ─────────────────────────────────────────────────────────────────────────────
// Attachments
// ─────────────────────────────────────────────────────────────────────────────
export async function getLabAttachmentsAction(labOrderId: string) {
  try {
    const { supabase, clinicId } = await getAuthContext()
    const data = await labAttachmentService.getAttachments(supabase, clinicId, labOrderId)
    return { success: true, data }
  } catch (e: any) { return { success: false, error: e.message } }
}

export async function deleteLabAttachmentAction(attachmentId: string, labOrderId: string) {
  try {
    const { supabase, user, clinicId } = await getAuthContext()
    await labAttachmentService.deleteAttachment(supabase, clinicId, attachmentId)
    await labAuditService.log(supabase, clinicId, user.id, 'Attachment Deleted', {
      tableName: 'laboratory.lab_attachments', recordId: attachmentId
    })
    revalidatePath('/laboratory')
    return { success: true }
  } catch (e: any) { return { success: false, error: e.message } }
}

// ─────────────────────────────────────────────────────────────────────────────
// Notifications
// ─────────────────────────────────────────────────────────────────────────────
export async function getLabNotificationsAction(labOrderId?: string) {
  try {
    const { supabase, clinicId } = await getAuthContext()
    const data = await labNotificationService.getNotifications(supabase, clinicId, labOrderId)
    return { success: true, data }
  } catch (e: any) { return { success: false, error: e.message } }
}

export async function sendLabNotificationAction(payload: Omit<LabNotificationRow, 'id' | 'clinic_id' | 'created_at'>) {
  try {
    const { supabase, clinicId } = await getAuthContext()
    const data = await labNotificationService.sendNotification(supabase, clinicId, payload)
    return { success: true, data }
  } catch (e: any) { return { success: false, error: e.message } }
}

// ─────────────────────────────────────────────────────────────────────────────
// Audit Log (read-only from UI perspective — inserts done internally)
// ─────────────────────────────────────────────────────────────────────────────
export async function getLabAuditAction(labOrderId?: string) {
  try {
    const { supabase, clinicId } = await getAuthContext()
    const data = await labAuditService.getAuditLog(supabase, clinicId, labOrderId)
    return { success: true, data }
  } catch (e: any) { return { success: false, error: e.message } }
}
