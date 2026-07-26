import type { SupabaseClient } from '@supabase/supabase-js'
import { clinicalNoteRepository } from '@/repositories/emr/clinicalNoteRepository'
import type { ClinicalNoteRow, EditHistoryEntry } from '@/types/emr'

export const clinicalNoteService = {
  async getAll(supabase: SupabaseClient, visitId: string): Promise<ClinicalNoteRow[]> {
    return await clinicalNoteRepository.getByVisit(supabase, visitId)
  },

  async add(
    supabase: SupabaseClient,
    clinicId: string,
    visitId: string,
    userId: string,
    payload: {
      note_type: string
      note: string
    }
  ): Promise<ClinicalNoteRow> {
    if (!payload.note?.trim()) throw new Error('Note content is required')
    return await clinicalNoteRepository.create(supabase, {
      clinic_id: clinicId,
      visit_id: visitId,
      entered_by: userId,
      note_type: payload.note_type,
      note: payload.note.trim()
    })
  },

  async editNote(
    supabase: SupabaseClient,
    id: string,
    userId: string,
    newContent: string
  ): Promise<ClinicalNoteRow> {
    if (!newContent?.trim()) throw new Error('Note content cannot be empty')
    
    const existing = await clinicalNoteRepository.getById(supabase, id)
    if (!existing) throw new Error('Note not found')

    if (existing.note === newContent.trim()) {
      return existing // no change
    }

    const historyEntry: EditHistoryEntry = {
      edited_at: new Date().toISOString(),
      previous_content: existing.note,
      edited_by: userId
    }

    const newHistory = [...(existing.edit_history || []), historyEntry]

    return await clinicalNoteRepository.update(supabase, id, {
      note: newContent.trim(),
      edit_history: newHistory
    })
  }
}
