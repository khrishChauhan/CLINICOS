import type { SupabaseClient } from '@supabase/supabase-js'
import { radiologyEquipmentRepository } from '@/repositories/radiology/radiologyEquipmentRepository'
import type { RadiologyEquipmentRow } from '@/types/radiology'

export const radiologyEquipmentService = {
  async getEquipment(supabase: SupabaseClient, clinicId: string) {
    return radiologyEquipmentRepository.getEquipment(supabase, clinicId)
  },

  async getEquipmentById(supabase: SupabaseClient, clinicId: string, equipmentId: string) {
    return radiologyEquipmentRepository.getEquipmentById(supabase, clinicId, equipmentId)
  },

  async createEquipment(
    supabase: SupabaseClient,
    clinicId: string,
    payload: Omit<RadiologyEquipmentRow, 'id' | 'clinic_id' | 'created_at' | 'updated_at' | 'deleted_at'>
  ) {
    // Business logic: check duplicate equipment_code
    const existing = await radiologyEquipmentRepository.getEquipment(supabase, clinicId)
    if (existing.some(e => e.equipment_code === payload.equipment_code)) {
      throw new Error(`Equipment Code ${payload.equipment_code} already exists.`)
    }

    return radiologyEquipmentRepository.createEquipment(supabase, {
      ...payload,
      clinic_id: clinicId
    })
  },

  async updateEquipment(
    supabase: SupabaseClient,
    clinicId: string,
    equipmentId: string,
    payload: Partial<Omit<RadiologyEquipmentRow, 'id' | 'clinic_id' | 'created_at' | 'deleted_at'>>
  ) {
    if (payload.equipment_code) {
      const existing = await radiologyEquipmentRepository.getEquipment(supabase, clinicId)
      if (existing.some(e => e.equipment_code === payload.equipment_code && e.id !== equipmentId)) {
        throw new Error(`Equipment Code ${payload.equipment_code} already exists.`)
      }
    }

    return radiologyEquipmentRepository.updateEquipment(supabase, clinicId, equipmentId, payload)
  },

  async markMaintenanceComplete(
    supabase: SupabaseClient,
    clinicId: string,
    equipmentId: string,
    nextMaintenanceDate: string
  ) {
    return radiologyEquipmentRepository.updateEquipment(supabase, clinicId, equipmentId, {
      maintenance_due: nextMaintenanceDate,
      status: 'Active' // Reset status to Active after maintenance
    })
  }
}
