import type { SupabaseClient } from '@supabase/supabase-js'
import { masterRepository } from '@/repositories/master/masterRepository'

export const masterService = {
  async getAll<T>(supabase: SupabaseClient, table: string): Promise<T[]> {
    return masterRepository.getAll<T>(supabase, table)
  },

  async getStatesByCountry<T>(supabase: SupabaseClient, countryId: string): Promise<T[]> {
    return masterRepository.getByFilter<T>(supabase, 'states', { country_id: countryId, status: 'Active' })
  },

  async getDistrictsByState<T>(supabase: SupabaseClient, stateId: string): Promise<T[]> {
    return masterRepository.getByFilter<T>(supabase, 'districts', { state_id: stateId, status: 'Active' })
  },

  async getCitiesByDistrict<T>(supabase: SupabaseClient, districtId: string): Promise<T[]> {
    return masterRepository.getByFilter<T>(supabase, 'cities', { district_id: districtId, status: 'Active' })
  },

  async create<T>(supabase: SupabaseClient, table: string, payload: Partial<T>): Promise<T> {
    // Basic duplication validation could be added here depending on table schema
    return masterRepository.create<T>(supabase, table, payload)
  },

  async update<T>(supabase: SupabaseClient, table: string, id: string, payload: Partial<T>): Promise<T> {
    return masterRepository.update<T>(supabase, table, id, payload)
  },

  async delete(supabase: SupabaseClient, table: string, id: string): Promise<void> {
    // Check for foreign key usage before hard delete, or perform soft delete by updating status
    return masterRepository.delete(supabase, table, id)
  }
}
