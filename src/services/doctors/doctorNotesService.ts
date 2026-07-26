import type { SupabaseClient } from '@supabase/supabase-js'
import { doctorNotesRepository } from '@/repositories/doctors/doctorNotesRepository'
import type { DoctorNoteRow } from '@/types/doctors'

export const doctorNotesService = {
  async addNote(supabase: SupabaseClient, payload: Partial<DoctorNoteRow>) {
    if (!payload.note || !payload.note_type) throw new Error("Note content and type are required.")
    return await doctorNotesRepository.createNote(supabase, payload)
  }
}
