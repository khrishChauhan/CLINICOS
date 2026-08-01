import type { SupabaseClient } from '@supabase/supabase-js'
import type { RadiologyQualityControlRow } from '@/types/radiology'

export const radiologyQualityControlRepository = {
  async getQualityControls(supabase: SupabaseClient, clinicId: string) {
    const { data, error } = await supabase
      .from('radiology_quality_control')
      .select(`
        *,
        equipment:radiology_equipment(equipment_name, equipment_code, modality),
        technician:users!performed_by(first_name, last_name)
      `)
      .eq('clinic_id', clinicId)
      .order('created_at', { ascending: false })

    if (error) throw new Error(error.message)
    return data as RadiologyQualityControlRow[]
  },

  async recordQualityControl(
    supabase: SupabaseClient,
    payload: Omit<RadiologyQualityControlRow, 'id' | 'created_at' | 'equipment' | 'technician'>
  ) {
    // Quality control records are immutable after creation via RLS policies
    const { data, error } = await supabase
      .from('radiology_quality_control')
      .insert([payload])
      .select(`
        *,
        equipment:radiology_equipment(equipment_name, equipment_code, modality),
        technician:users!performed_by(first_name, last_name)
      `)
      .single()

    if (error) throw new Error(error.message)
    return data as RadiologyQualityControlRow
  }
}
