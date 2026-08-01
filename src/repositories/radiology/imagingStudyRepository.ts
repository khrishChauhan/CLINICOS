import type { SupabaseClient } from '@supabase/supabase-js'
import type { ImagingStudyRow } from '@/types/radiology'

export const imagingStudyRepository = {
  async getStudies(supabase: SupabaseClient, clinicId: string) {
    const { data, error } = await supabase
      .from('imaging_studies')
      .select(`
        *,
        patient:patients(first_name, last_name, date_of_birth, gender),
        technician:users!technician_id(first_name, last_name),
        pacs:pacs_integration(transfer_status, pacs_server)
      `)
      .eq('clinic_id', clinicId)
      .is('deleted_at', null)
      .order('created_at', { ascending: false })

    if (error) throw new Error(error.message)
    return data
  },

  async getStudyById(supabase: SupabaseClient, clinicId: string, studyId: string) {
    const { data, error } = await supabase
      .from('imaging_studies')
      .select(`
        *,
        patient:patients(first_name, last_name, date_of_birth, gender),
        series:imaging_series(
          *,
          images:imaging_images(*)
        ),
        pacs:pacs_integration(*)
      `)
      .eq('clinic_id', clinicId)
      .eq('id', studyId)
      .is('deleted_at', null)
      .single()

    if (error) throw new Error(error.message)
    return data
  },

  async createStudy(
    supabase: SupabaseClient,
    payload: Omit<ImagingStudyRow, 'id' | 'created_at' | 'updated_at' | 'deleted_at' | 'accession_number'>
  ) {
    const { data, error } = await supabase
      .from('imaging_studies')
      .insert([payload])
      .select()
      .single()

    if (error) throw new Error(error.message)
    return data as ImagingStudyRow
  }
}
