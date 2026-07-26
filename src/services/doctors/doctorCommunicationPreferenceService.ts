import type { SupabaseClient } from '@supabase/supabase-js'
import { doctorCommunicationPreferenceRepository } from '@/repositories/doctors/doctorCommunicationPreferenceRepository'
import type { DoctorCommunicationPreferenceRow } from '@/types/doctors'

export const doctorCommunicationPreferenceService = {
  async getOrCreatePreferences(supabase: SupabaseClient, clinicId: string, doctorId: string) {
    let prefs = await doctorCommunicationPreferenceRepository.getPreferencesByDoctor(supabase, clinicId, doctorId)
    if (!prefs) {
      // Default to fully opted-in
      prefs = await doctorCommunicationPreferenceRepository.upsertPreferences(supabase, {
        clinic_id: clinicId,
        doctor_id: doctorId,
        sms_enabled: true,
        email_enabled: true,
        whatsapp_enabled: true,
        in_app_enabled: true
      })
    }
    return prefs
  },

  async updatePreferences(supabase: SupabaseClient, clinicId: string, doctorId: string, updates: Partial<DoctorCommunicationPreferenceRow>) {
    return await doctorCommunicationPreferenceRepository.upsertPreferences(supabase, {
      clinic_id: clinicId,
      doctor_id: doctorId,
      ...updates
    })
  }
}
