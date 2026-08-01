'use server'

import { createClient } from '@/lib/supabase/server'
import { imagingStudyService } from '@/services/radiology/imagingStudyService'
import { pacsService } from '@/services/radiology/pacsService'
import { revalidatePath } from 'next/cache'
import type { ImagingStudyRow, ImagingSeriesRow } from '@/types/radiology'

async function getAuthContext() {
  const supabase = await createClient()
  const { data: { user }, error } = await supabase.auth.getUser()
  if (error || !user) throw new Error('Unauthorized')
  const { data: profile } = await supabase.from('users').select('clinic_id').eq('id', user.id).single()
  if (!profile?.clinic_id) throw new Error('Clinic not found')
  return { supabase, user, clinicId: profile.clinic_id }
}

export async function getImagingStudiesAction() {
  try {
    const { supabase, clinicId } = await getAuthContext()
    const data = await imagingStudyService.getStudies(supabase, clinicId)
    return { success: true, data }
  } catch (e: any) { return { success: false, error: e.message } }
}

export async function getImagingStudyByIdAction(studyId: string) {
  try {
    const { supabase, clinicId } = await getAuthContext()
    const data = await imagingStudyService.getStudyById(supabase, clinicId, studyId)
    return { success: true, data }
  } catch (e: any) { return { success: false, error: e.message } }
}

export async function createImagingStudyAction(payload: Omit<ImagingStudyRow, 'id' | 'clinic_id' | 'created_at' | 'updated_at' | 'deleted_at' | 'accession_number'>) {
  try {
    const { supabase, clinicId } = await getAuthContext()
    const data = await imagingStudyService.createStudy(supabase, clinicId, payload)
    revalidatePath('/radiology/studies')
    return { success: true, data }
  } catch (e: any) { return { success: false, error: e.message } }
}

export async function createImagingSeriesAction(payload: Omit<ImagingSeriesRow, 'id' | 'clinic_id' | 'created_at' | 'updated_at' | 'deleted_at'>) {
  try {
    const { supabase, clinicId } = await getAuthContext()
    const data = await imagingStudyService.createSeries(supabase, clinicId, payload)
    revalidatePath(`/radiology/studies/${payload.imaging_study_id}`)
    return { success: true, data }
  } catch (e: any) { return { success: false, error: e.message } }
}

export async function uploadImagingImageAction(seriesId: string, imageUid: string, imageNumber: number, formData: FormData) {
  try {
    const { supabase, clinicId } = await getAuthContext()
    const file = formData.get('file') as File
    if (!file) throw new Error('No file provided')

    const data = await imagingStudyService.uploadAndRecordImage(supabase, clinicId, seriesId, file, imageUid, imageNumber)
    return { success: true, data }
  } catch (e: any) { return { success: false, error: e.message } }
}

export async function getSignedImageUrlAction(storagePath: string) {
  try {
    const { supabase } = await getAuthContext() // validate auth
    const url = await imagingStudyService.getSignedImageUrl(supabase, storagePath)
    return { success: true, url }
  } catch (e: any) { return { success: false, error: e.message } }
}

export async function syncPACSAction(studyId: string, studyUid: string) {
  try {
    const { supabase, clinicId } = await getAuthContext()
    const data = await pacsService.syncStudyToPACS(supabase, clinicId, studyId, studyUid)
    revalidatePath(`/radiology/studies/${studyId}`)
    return { success: true, data }
  } catch (e: any) { return { success: false, error: e.message } }
}

export async function retryPACSTransferAction(studyId: string) {
  try {
    const { supabase, clinicId } = await getAuthContext()
    const data = await pacsService.retrySync(supabase, clinicId, studyId)
    revalidatePath(`/radiology/studies/${studyId}`)
    return { success: true, data }
  } catch (e: any) { return { success: false, error: e.message } }
}
