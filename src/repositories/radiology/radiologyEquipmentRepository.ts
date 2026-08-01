import type { SupabaseClient } from '@supabase/supabase-js'
import type { RadiologyEquipmentRow } from '@/types/radiology'

export const radiologyEquipmentRepository = {
  async getEquipment(supabase: SupabaseClient, clinicId: string) {
    const { data, error } = await supabase
      .from('radiology_equipment')
      .select('*')
      .eq('clinic_id', clinicId)
      .is('deleted_at', null)
      .order('equipment_code', { ascending: true })

    if (error) throw new Error(error.message)
    return data as RadiologyEquipmentRow[]
  },

  async getEquipmentById(supabase: SupabaseClient, clinicId: string, equipmentId: string) {
    const { data, error } = await supabase
      .from('radiology_equipment')
      .select('*')
      .eq('clinic_id', clinicId)
      .eq('id', equipmentId)
      .is('deleted_at', null)
      .single()

    if (error) throw new Error(error.message)
    return data as RadiologyEquipmentRow
  },

  async createEquipment(
    supabase: SupabaseClient,
    payload: Omit<RadiologyEquipmentRow, 'id' | 'created_at' | 'updated_at' | 'deleted_at'>
  ) {
    const { data, error } = await supabase
      .from('radiology_equipment')
      .insert([payload])
      .select()
      .single()

    if (error) throw new Error(error.message)
    return data as RadiologyEquipmentRow
  },

  async updateEquipment(
    supabase: SupabaseClient,
    clinicId: string,
    equipmentId: string,
    payload: Partial<Omit<RadiologyEquipmentRow, 'id' | 'clinic_id' | 'created_at' | 'deleted_at'>>
  ) {
    const { data, error } = await supabase
      .from('radiology_equipment')
      .update(payload)
      .eq('id', equipmentId)
      .eq('clinic_id', clinicId)
      .select()
      .single()

    if (error) throw new Error(error.message)
    return data as RadiologyEquipmentRow
  }
}
