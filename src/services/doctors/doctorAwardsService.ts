import type { SupabaseClient } from '@supabase/supabase-js'
import { doctorAwardsRepository } from '@/repositories/doctors/doctorAwardsRepository'
import type { DoctorAwardRow } from '@/types/doctors'

export const doctorAwardsService = {
  async addAward(supabase: SupabaseClient, payload: Partial<DoctorAwardRow>) {
    if (!payload.award_name || !payload.organization) throw new Error("Award name and organization are required.")
    return await doctorAwardsRepository.createAward(supabase, payload)
  }
}
