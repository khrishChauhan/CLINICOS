import type { SupabaseClient } from '@supabase/supabase-js'
import { contrastAdministrationRepository } from '@/repositories/radiology/contrastAdministrationRepository'
import { radiationDoseRepository } from '@/repositories/radiology/radiationDoseRepository'
import type { ContrastAdministrationRow, RadiationDoseRow } from '@/types/radiology'

export const radiologyClinicalService = {
  async getClinicalDataByStudyId(supabase: SupabaseClient, clinicId: string, studyId: string) {
    const contrast = await contrastAdministrationRepository.getContrastByStudyId(supabase, clinicId, studyId)
    const radiation = await radiationDoseRepository.getDoseByStudyId(supabase, clinicId, studyId)
    return { contrast, radiation }
  },

  async recordContrast(
    supabase: SupabaseClient,
    clinicId: string,
    payload: Omit<ContrastAdministrationRow, 'id' | 'clinic_id' | 'created_at' | 'updated_at' | 'deleted_at' | 'administrator'>
  ) {
    return contrastAdministrationRepository.recordContrast(supabase, {
      ...payload,
      clinic_id: clinicId
    })
  },

  async recordRadiationDose(
    supabase: SupabaseClient,
    clinicId: string,
    payload: Omit<RadiationDoseRow, 'id' | 'clinic_id' | 'created_at' | 'updated_at' | 'deleted_at' | 'equipment' | 'operator'>
  ) {
    return radiationDoseRepository.recordDose(supabase, {
      ...payload,
      clinic_id: clinicId
    })
  }
}
