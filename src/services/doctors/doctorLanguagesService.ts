import type { SupabaseClient } from '@supabase/supabase-js'
import { doctorLanguagesRepository } from '@/repositories/doctors/doctorLanguagesRepository'
import type { DoctorLanguageRow } from '@/types/doctors'

export const doctorLanguagesService = {
  async addLanguage(supabase: SupabaseClient, payload: Partial<DoctorLanguageRow>) {
    if (!payload.language_name || !payload.proficiency) throw new Error("Language and proficiency are required.")
    return await doctorLanguagesRepository.addLanguage(supabase, payload)
  }
}
