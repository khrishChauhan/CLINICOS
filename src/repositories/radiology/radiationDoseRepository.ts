import type { SupabaseClient } from '@supabase/supabase-js'
import type { RadiationDoseRow } from '@/types/radiology'

export const radiationDoseRepository = {
  async getDoseByStudyId(supabase: SupabaseClient, clinicId: string, studyId: string) {
    const { data, error } = await supabase
      .from('radiation_dose')
      .select(`
        *,
        equipment:radiology_equipment(equipment_name, modality),
        operator:users!operator_id(first_name, last_name)
      `)
      .eq('clinic_id', clinicId)
      .eq('imaging_study_id', studyId)
      .is('deleted_at', null)
      .order('created_at', { ascending: false })

    if (error) throw new Error(error.message)
    return data as RadiationDoseRow[]
  },

  async recordDose(
    supabase: SupabaseClient,
    payload: Omit<RadiationDoseRow, 'id' | 'created_at' | 'updated_at' | 'deleted_at' | 'equipment' | 'operator'>
  ) {
    const { data, error } = await supabase
      .from('radiation_dose')
      .insert([payload])
      .select(`
        *,
        equipment:radiology_equipment(equipment_name, modality),
        operator:users!operator_id(first_name, last_name)
      `)
      .single()

    if (error) throw new Error(error.message)
    return data as RadiationDoseRow
  }
}
