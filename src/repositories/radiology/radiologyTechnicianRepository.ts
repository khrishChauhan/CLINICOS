import type { SupabaseClient } from '@supabase/supabase-js'
import type { RadiologyTechnicianRow } from '@/types/radiology'

export const radiologyTechnicianRepository = {
  async getTechnicians(supabase: SupabaseClient, clinicId: string) {
    const { data, error } = await supabase
      .from('radiology_technicians')
      .select('*, employee:users!inner(first_name, last_name, email)')
      .eq('clinic_id', clinicId)
      .is('deleted_at', null)
      .order('created_at', { ascending: false })

    if (error) throw new Error(error.message)
    return data as RadiologyTechnicianRow[]
  },

  async getTechnicianById(supabase: SupabaseClient, clinicId: string, technicianId: string) {
    const { data, error } = await supabase
      .from('radiology_technicians')
      .select('*, employee:users!inner(first_name, last_name, email)')
      .eq('clinic_id', clinicId)
      .eq('id', technicianId)
      .is('deleted_at', null)
      .single()

    if (error) throw new Error(error.message)
    return data as RadiologyTechnicianRow
  },

  async createTechnician(
    supabase: SupabaseClient,
    payload: Omit<RadiologyTechnicianRow, 'id' | 'created_at' | 'updated_at' | 'deleted_at' | 'employee'>
  ) {
    const { data, error } = await supabase
      .from('radiology_technicians')
      .insert([payload])
      .select('*, employee:users!inner(first_name, last_name, email)')
      .single()

    if (error) throw new Error(error.message)
    return data as RadiologyTechnicianRow
  },

  async updateTechnician(
    supabase: SupabaseClient,
    clinicId: string,
    technicianId: string,
    payload: Partial<Omit<RadiologyTechnicianRow, 'id' | 'clinic_id' | 'employee_id' | 'created_at' | 'deleted_at' | 'employee'>>
  ) {
    const { data, error } = await supabase
      .from('radiology_technicians')
      .update(payload)
      .eq('id', technicianId)
      .eq('clinic_id', clinicId)
      .select('*, employee:users!inner(first_name, last_name, email)')
      .single()

    if (error) throw new Error(error.message)
    return data as RadiologyTechnicianRow
  }
}
