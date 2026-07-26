'use server'

import { createClient } from '@/lib/supabase/server'
import { doctorDocumentRepository } from '@/repositories/doctors/doctorDocumentRepository'
import { doctorDocumentService } from '@/services/doctors/doctorDocumentService'
import crypto from 'crypto'

async function getAuthContext() {
  const supabase = await createClient()
  const { data: { user }, error } = await supabase.auth.getUser()
  if (error || !user) throw new Error('Unauthorized')
  
  const { data: profile } = await supabase.from('users').select('clinic_id').eq('id', user.id).single()
  if (!profile?.clinic_id) throw new Error('Clinic context missing')
  
  return { supabase, user, clinicId: profile.clinic_id }
}

export async function getDoctorDocumentsAction(doctorId: string) {
  try {
    const { supabase, clinicId } = await getAuthContext()
    const data = await doctorDocumentService.getDocumentsWithUrls(supabase, clinicId, doctorId)
    return { success: true, data }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}

export async function uploadDoctorDocumentAction(doctorId: string, formData: FormData) {
  try {
    const { supabase, user, clinicId } = await getAuthContext()
    const file = formData.get('file') as File
    const documentType = formData.get('document_type') as string
    const documentName = formData.get('document_name') as string
    const remarks = formData.get('remarks') as string
    
    if (!file || !documentType || !documentName) throw new Error('Missing required fields')

    const fileExt = file.name.split('.').pop()
    const filePath = `${clinicId}/doctors/${doctorId}/documents/${crypto.randomUUID()}.${fileExt}`

    // 1. Upload to Storage
    const { error: uploadError } = await supabase.storage
      .from('clinicos-assets')
      .upload(filePath, file)

    if (uploadError) throw new Error(`Upload failed: ${uploadError.message}`)

    // 2. Save metadata
    const data = await doctorDocumentRepository.createDocument(supabase, {
      clinic_id: clinicId,
      doctor_id: doctorId,
      file_path: filePath,
      document_type: documentType,
      document_name: documentName,
      remarks,
      created_by: user.id
    })

    return { success: true, data }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}

export async function deleteDoctorDocumentAction(id: string, filePath: string) {
  try {
    const { supabase } = await getAuthContext()
    // Delete from storage
    await supabase.storage.from('clinicos-assets').remove([filePath])
    // Delete metadata
    await doctorDocumentRepository.deleteDocument(supabase, id)
    return { success: true }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}
