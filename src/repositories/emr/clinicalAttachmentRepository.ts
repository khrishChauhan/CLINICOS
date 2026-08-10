import type { SupabaseClient } from '@supabase/supabase-js'
import type { ClinicalAttachmentRow } from '@/types/emr'

export const clinicalAttachmentRepository = {
  async getByVisit(supabase: SupabaseClient, visitId: string): Promise<ClinicalAttachmentRow[]> {
    const { data, error } = await supabase
      
      .from('clinical_attachments')
      .select('*')
      .eq('visit_id', visitId)
      .order('uploaded_at', { ascending: false })
    if (error) throw new Error(`Failed to fetch attachments: ${error.message}`)
    return data as ClinicalAttachmentRow[]
  },

  async create(supabase: SupabaseClient, payload: Partial<ClinicalAttachmentRow>): Promise<ClinicalAttachmentRow> {
    const { data, error } = await supabase
      
      .from('clinical_attachments')
      .insert([payload])
      .select()
      .single()
    if (error) throw new Error(`Failed to record attachment: ${error.message}`)
    return data as ClinicalAttachmentRow
  },

  async delete(supabase: SupabaseClient, id: string): Promise<void> {
    const { error } = await supabase
      
      .from('clinical_attachments')
      .delete()
      .eq('id', id)
    if (error) throw new Error(`Failed to delete attachment: ${error.message}`)
  },

  async getById(supabase: SupabaseClient, id: string): Promise<ClinicalAttachmentRow | null> {
    const { data, error } = await supabase
      
      .from('clinical_attachments')
      .select('*')
      .eq('id', id)
      .maybeSingle()
    if (error) throw new Error(`Failed to fetch attachment: ${error.message}`)
    return data as ClinicalAttachmentRow | null
  }
}
