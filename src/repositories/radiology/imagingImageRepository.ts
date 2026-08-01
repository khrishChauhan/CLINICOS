import type { SupabaseClient } from '@supabase/supabase-js'
import type { ImagingImageRow } from '@/types/radiology'

export const imagingImageRepository = {
  async getImages(supabase: SupabaseClient, seriesId: string) {
    const { data, error } = await supabase
      .from('imaging_images')
      .select('*')
      .eq('imaging_series_id', seriesId)
      .is('deleted_at', null)
      .order('image_number', { ascending: true })

    if (error) throw new Error(error.message)
    return data as ImagingImageRow[]
  },

  async createImageRecord(
    supabase: SupabaseClient,
    payload: Omit<ImagingImageRow, 'id' | 'created_at' | 'uploaded_at' | 'deleted_at'>
  ) {
    const { data, error } = await supabase
      .from('imaging_images')
      .insert([payload])
      .select()
      .single()

    if (error) throw new Error(error.message)
    return data as ImagingImageRow
  }
}
