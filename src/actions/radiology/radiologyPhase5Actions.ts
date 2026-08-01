'use server'

import { createClient } from '@/lib/supabase/server'
import { radiologyAttachmentService } from '@/services/radiology/radiologyAttachmentService'
import { radiologyNotificationService } from '@/services/radiology/radiologyNotificationService'
import { radiologyAuditService } from '@/services/radiology/radiologyAuditService'
import { revalidatePath } from 'next/cache'

async function getAuthContext() {
  const supabase = await createClient()
  const { data: { user }, error } = await supabase.auth.getUser()
  if (error || !user) throw new Error('Unauthorized')
  const { data: profile } = await supabase.from('users').select('clinic_id').eq('id', user.id).single()
  if (!profile?.clinic_id) throw new Error('Clinic not found')
  return { supabase, user, clinicId: profile.clinic_id }
}

export async function getRadiologyAttachmentsAction(orderId: string) {
  try {
    const { supabase, clinicId } = await getAuthContext()
    const data = await radiologyAttachmentService.getAttachments(supabase, clinicId, orderId)
    return { success: true, data }
  } catch (e: any) { return { success: false, error: e.message } }
}

export async function uploadRadiologyAttachmentAction(orderId: string, documentType: string, formData: FormData) {
  try {
    const { supabase, clinicId, user } = await getAuthContext()
    const file = formData.get('file') as File
    if (!file) throw new Error('File required')

    const remarks = formData.get('remarks') as string || ''

    const data = await radiologyAttachmentService.uploadAttachment(
      supabase,
      clinicId,
      orderId,
      user.id,
      file,
      documentType,
      remarks
    )
    
    revalidatePath(`/radiology/attachments`)
    return { success: true, data }
  } catch (e: any) { return { success: false, error: e.message } }
}

export async function deleteRadiologyAttachmentAction(attachmentId: string, orderId: string) {
  try {
    const { supabase, clinicId, user } = await getAuthContext()
    await radiologyAttachmentService.deleteAttachment(supabase, clinicId, attachmentId, orderId, user.id)
    revalidatePath(`/radiology/attachments`)
    return { success: true }
  } catch (e: any) { return { success: false, error: e.message } }
}

export async function getRadiologySignedUrlAction(storagePath: string) {
  try {
    const { supabase } = await getAuthContext()
    const url = await radiologyAttachmentService.getSignedUrl(supabase, storagePath)
    return { success: true, url }
  } catch (e: any) { return { success: false, error: e.message } }
}

export async function getRadiologyNotificationsAction() {
  try {
    const { supabase, clinicId } = await getAuthContext()
    const data = await radiologyNotificationService.getNotifications(supabase, clinicId)
    return { success: true, data }
  } catch (e: any) { return { success: false, error: e.message } }
}

export async function getRadiologyAuditAction() {
  try {
    const { supabase, clinicId } = await getAuthContext()
    const data = await radiologyAuditService.getAuditTimeline(supabase, clinicId)
    return { success: true, data }
  } catch (e: any) { return { success: false, error: e.message } }
}
