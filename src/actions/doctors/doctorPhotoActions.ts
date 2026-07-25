'use server'

import { createClient } from '@/lib/supabase/server'
import { doctorRepository } from '@/repositories/doctors/doctorRepository'

export async function uploadDoctorPhotoAction(doctorId: string, formData: FormData) {
  try {
    const file = formData.get('photo') as File
    if (!file) throw new Error('No photo provided')

    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) throw new Error('Unauthorized')
    
    const { data: profile } = await supabase.from('users').select('clinic_id').eq('id', user.id).single()
    if (!profile?.clinic_id) throw new Error('Clinic context missing')

    // Ensure bucket exists
    await supabase.storage.createBucket('clinicos-assets', { public: false }).catch(() => {})

    const ext = file.name.split('.').pop()
    const filename = `${crypto.randomUUID()}.${ext}`
    const path = `clinics/${profile.clinic_id}/doctors/${doctorId}/profile/${filename}`

    const { error: uploadError } = await supabase.storage
      .from('clinicos-assets')
      .upload(path, file, { upsert: true })

    if (uploadError) throw new Error(`Upload failed: ${uploadError.message}`)

    // Update doctor profile with the path
    await doctorRepository.updateDoctor(supabase, doctorId, { profile_photo: path })

    return { success: true, path }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}

export async function getDoctorPhotoUrlAction(path: string) {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase.storage
      .from('clinicos-assets')
      .createSignedUrl(path, 3600) // 1 hour valid

    if (error) throw new Error(error.message)
    return { success: true, url: data.signedUrl }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}
