import type { SupabaseClient } from '@supabase/supabase-js'
import type { DoctorNoteRow } from '@/types/doctors'

export const doctorNotesRepository = {
  async getNotesByDoctor(supabase: SupabaseClient, clinicId: string, doctorId: string): Promise<DoctorNoteRow[]> {
    const { data, error } = await supabase
      .schema('doctor').from('doctor_notes')
      .select('*')
      .eq('clinic_id', clinicId)
      .eq('doctor_id', doctorId)
      .order('created_at', { ascending: false })

    if (error) throw new Error(`Failed to fetch notes: ${error.message}`)
    return data as DoctorNoteRow[]
  },

  async createNote(supabase: SupabaseClient, payload: Partial<DoctorNoteRow>): Promise<DoctorNoteRow> {
    const { data, error } = await supabase
      .schema('doctor').from('doctor_notes')
      .insert([payload])
      .select()
      .single()

    if (error) throw new Error(`Failed to save note: ${error.message}`)
    return data as DoctorNoteRow
  },

  async deleteNote(supabase: SupabaseClient, id: string): Promise<void> {
    const { error } = await supabase
      .schema('doctor').from('doctor_notes')
      .delete()
      .eq('id', id)

    if (error) throw new Error(`Failed to delete note: ${error.message}`)
  }
}
