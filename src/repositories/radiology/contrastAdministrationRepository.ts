import type { SupabaseClient } from '@supabase/supabase-js'
import type { ContrastAdministrationRow } from '@/types/radiology'

export const contrastAdministrationRepository = {
  async getContrastByStudyId(supabase: SupabaseClient, clinicId: string, studyId: string) {
    const { data, error } = await supabase
      .from('contrast_administration')
      .select('*, administrator:users!administered_by(first_name, last_name)')
      .eq('clinic_id', clinicId)
      .eq('imaging_study_id', studyId)
      .is('deleted_at', null)
      .order('administration_time', { ascending: false })

    if (error) throw new Error(error.message)
    return data as ContrastAdministrationRow[]
  },

  async recordContrast(
    supabase: SupabaseClient,
    payload: Omit<ContrastAdministrationRow, 'id' | 'created_at' | 'updated_at' | 'deleted_at' | 'administrator'>
  ) {
    const { data, error } = await supabase
      .from('contrast_administration')
      .insert([payload])
      .select('*, administrator:users!administered_by(first_name, last_name)')
      .single()

    if (error) throw new Error(error.message)
    return data as ContrastAdministrationRow
  }
}
