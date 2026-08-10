'use server'

import { createClient, createAdminClient } from '@/lib/supabase/server'
import { clinicalAttachmentService } from '@/services/emr/clinicalAttachmentService'

async function getAuthContext() {
  const supabase = await createClient()
  const { data: { user }, error } = await supabase.auth.getUser()
  if (error || !user) throw new Error('Unauthorized')
  const adminClient = createAdminClient()
  const { data: profile } = await adminClient.from('users').select('clinic_id').eq('id', user.id).single()
  if (!profile?.clinic_id) throw new Error('Clinic context missing')
  return { supabase, user, clinicId: profile.clinic_id }
}

export async function getClinicalAttachmentsAction(visitId: string) {
  try {
    const { supabase } = await getAuthContext()
    const data = await clinicalAttachmentService.getAll(supabase, visitId)
    return { success: true, data }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}

export async function uploadClinicalAttachmentAction(
  visitId: string,
  formData: FormData
) {
  try {
    const { supabase, user, clinicId } = await getAuthContext()
    
    const file = formData.get('file') as File
    const attachmentType = formData.get('attachment_type') as string
    const remarks = formData.get('remarks') as string
    
    if (!file || !(file instanceof File)) throw new Error('Valid file is required')
    if (!attachmentType) throw new Error('Attachment type is required')

    const data = await clinicalAttachmentService.uploadFile(
      supabase,
      clinicId,
      visitId,
      user.id,
      file,
      attachmentType,
      remarks
    )
    return { success: true, data }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}

export async function deleteClinicalAttachmentAction(id: string) {
  try {
    const { supabase } = await getAuthContext()
    await clinicalAttachmentService.remove(supabase, id)
    return { success: true }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}

/** Utility to securely get a signed URL for a file stored in 'patient-documents' */
export async function getAttachmentDownloadUrlAction(path: string) {
  try {
    const { supabase } = await getAuthContext()
    const { data, error } = await supabase.storage.from('patient-documents').createSignedUrl(path, 60 * 5) // 5 minutes
    if (error) throw error
    return { success: true, url: data.signedUrl }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}
