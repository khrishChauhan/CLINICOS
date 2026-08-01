import type { SupabaseClient } from '@supabase/supabase-js'
import { radiologyTechnicianRepository } from '@/repositories/radiology/radiologyTechnicianRepository'
import type { RadiologyTechnicianRow } from '@/types/radiology'

export const radiologyTechnicianService = {
  async getTechnicians(supabase: SupabaseClient, clinicId: string) {
    return radiologyTechnicianRepository.getTechnicians(supabase, clinicId)
  },

  async getTechnicianById(supabase: SupabaseClient, clinicId: string, technicianId: string) {
    return radiologyTechnicianRepository.getTechnicianById(supabase, clinicId, technicianId)
  },

  async registerTechnician(
    supabase: SupabaseClient,
    clinicId: string,
    payload: Omit<RadiologyTechnicianRow, 'id' | 'clinic_id' | 'created_at' | 'updated_at' | 'deleted_at' | 'employee'>
  ) {
    // Check if employee is already registered as a technician
    const existing = await radiologyTechnicianRepository.getTechnicians(supabase, clinicId)
    if (existing.some(t => t.employee_id === payload.employee_id)) {
      throw new Error('This employee is already registered as a Radiology Technician.')
    }

    return radiologyTechnicianRepository.createTechnician(supabase, {
      ...payload,
      clinic_id: clinicId
    })
  },

  async updateTechnician(
    supabase: SupabaseClient,
    clinicId: string,
    technicianId: string,
    payload: Partial<Omit<RadiologyTechnicianRow, 'id' | 'clinic_id' | 'employee_id' | 'created_at' | 'deleted_at' | 'employee'>>
  ) {
    return radiologyTechnicianRepository.updateTechnician(supabase, clinicId, technicianId, payload)
  }
}
