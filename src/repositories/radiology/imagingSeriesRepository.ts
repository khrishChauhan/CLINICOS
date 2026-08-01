import type { SupabaseClient } from '@supabase/supabase-js'
import type { ImagingSeriesRow } from '@/types/radiology'

export const imagingSeriesRepository = {
  async getSeries(supabase: SupabaseClient, studyId: string) {
    const { data, error } = await supabase
      .from('imaging_series')
      .select('*, images:imaging_images(id, image_uid, image_number, thumbnail_path)')
      .eq('imaging_study_id', studyId)
      .is('deleted_at', null)
      .order('series_number', { ascending: true })

    if (error) throw new Error(error.message)
    return data
  },

  async createSeries(
    supabase: SupabaseClient,
    payload: Omit<ImagingSeriesRow, 'id' | 'created_at' | 'updated_at' | 'deleted_at'>
  ) {
    const { data, error } = await supabase
      .from('imaging_series')
      .insert([payload])
      .select()
      .single()

    if (error) throw new Error(error.message)
    return data as ImagingSeriesRow
  }
}
