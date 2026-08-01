import type { SupabaseClient } from '@supabase/supabase-js'
import { imagingStudyRepository } from '@/repositories/radiology/imagingStudyRepository'
import { imagingSeriesRepository } from '@/repositories/radiology/imagingSeriesRepository'
import { imagingImageRepository } from '@/repositories/radiology/imagingImageRepository'
import type { ImagingStudyRow, ImagingSeriesRow, ImagingImageRow } from '@/types/radiology'

export const imagingStudyService = {
  async getStudies(supabase: SupabaseClient, clinicId: string) {
    return imagingStudyRepository.getStudies(supabase, clinicId)
  },

  async getStudyById(supabase: SupabaseClient, clinicId: string, studyId: string) {
    return imagingStudyRepository.getStudyById(supabase, clinicId, studyId)
  },

  async createStudy(
    supabase: SupabaseClient,
    clinicId: string,
    payload: Omit<ImagingStudyRow, 'id' | 'clinic_id' | 'created_at' | 'updated_at' | 'deleted_at' | 'accession_number'>
  ) {
    return imagingStudyRepository.createStudy(supabase, {
      ...payload,
      clinic_id: clinicId
    })
  },

  async createSeries(
    supabase: SupabaseClient,
    clinicId: string,
    payload: Omit<ImagingSeriesRow, 'id' | 'clinic_id' | 'created_at' | 'updated_at' | 'deleted_at'>
  ) {
    return imagingSeriesRepository.createSeries(supabase, {
      ...payload,
      clinic_id: clinicId
    })
  },

  async uploadAndRecordImage(
    supabase: SupabaseClient,
    clinicId: string,
    seriesId: string,
    file: File,
    imageUid: string,
    imageNumber: number
  ) {
    // 1. Storage Upload
    const filePath = `${clinicId}/${seriesId}/${imageUid}`
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('radiology_images')
      .upload(filePath, file)

    if (uploadError) throw new Error(`Storage Error: ${uploadError.message}`)

    // 2. Database Record
    return imagingImageRepository.createImageRecord(supabase, {
      clinic_id: clinicId,
      imaging_series_id: seriesId,
      image_uid: imageUid,
      image_number: imageNumber,
      storage_path: uploadData.path,
      image_format: file.type || 'DICOM',
      image_size: file.size
    })
  },

  async getSignedImageUrl(supabase: SupabaseClient, storagePath: string, expiresIn: number = 3600) {
    // Strict signed URL generation for previews
    const { data, error } = await supabase.storage
      .from('radiology_images')
      .createSignedUrl(storagePath, expiresIn)

    if (error) throw new Error(`Failed to sign URL: ${error.message}`)
    return data.signedUrl
  }
}
