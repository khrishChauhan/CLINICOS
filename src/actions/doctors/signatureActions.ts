'use server'

import { createClient } from '@/lib/supabase/server'
import { doctorDigitalSignatureRepository } from '@/repositories/doctors/doctorDigitalSignatureRepository'
import { doctorDigitalSignatureService } from '@/services/doctors/doctorDigitalSignatureService'
import crypto from 'crypto'

async function getAuthContext() {
  const supabase = await createClient()
  const { data: { user }, error } = await supabase.auth.getUser()
  if (error || !user) throw new Error('Unauthorized')
  
  const { data: profile } = await supabase.from('users').select('clinic_id').eq('id', user.id).single()
  if (!profile?.clinic_id) throw new Error('Clinic context missing')
  
  return { supabase, user, clinicId: profile.clinic_id }
}

export async function getDoctorSignaturesAction(doctorId: string) {
  try {
    const { supabase, clinicId } = await getAuthContext()
    const data = await doctorDigitalSignatureService.getSignaturesWithUrls(supabase, clinicId, doctorId)
    return { success: true, data }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}

export async function uploadDoctorSignatureAction(doctorId: string, formData: FormData) {
  try {
    const { supabase, user, clinicId } = await getAuthContext()
    const file = formData.get('file') as File
    const signatureType = formData.get('signature_type') as string
    
    if (!file || !signatureType) throw new Error('Missing file or signature type')

    const fileExt = file.name.split('.').pop()
    const filePath = `${clinicId}/doctors/${doctorId}/signatures/${crypto.randomUUID()}.${fileExt}`

    // 1. Upload to Storage
    const { error: uploadError } = await supabase.storage
      .from('clinicos-assets')
      .upload(filePath, file)

    if (uploadError) throw new Error(`Upload failed: ${uploadError.message}`)

    // 2. Save metadata
    const data = await doctorDigitalSignatureRepository.createSignature(supabase, {
      clinic_id: clinicId,
      doctor_id: doctorId,
      file_path: filePath,
      signature_type: signatureType,
      created_by: user.id
    })

    return { success: true, data }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}

export async function deleteDoctorSignatureAction(id: string, filePath: string) {
  try {
    const { supabase } = await getAuthContext()
    // Delete from storage
    await supabase.storage.from('clinicos-assets').remove([filePath])
    // Delete metadata
    await doctorDigitalSignatureRepository.deleteSignature(supabase, id)
    return { success: true }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}
