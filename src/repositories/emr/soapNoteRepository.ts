import type { SupabaseClient } from '@supabase/supabase-js'
import type { SoapNoteRow } from '@/types/emr'

export const soapNoteRepository = {
  async getByVisitId(supabase: SupabaseClient, visitId: string): Promise<SoapNoteRow | null> {
    const { data, error } = await supabase
      
      .from('soap_notes')
      .select('*')
      .eq('visit_id', visitId)
      .maybeSingle()
    if (error) throw new Error(`Failed to fetch SOAP note: ${error.message}`)
    return data as SoapNoteRow | null
  },

  async upsert(supabase: SupabaseClient, payload: Partial<SoapNoteRow>): Promise<SoapNoteRow> {
    const { data, error } = await supabase
      
      .from('soap_notes')
      .upsert([{ ...payload, updated_at: new Date().toISOString() }], { onConflict: 'visit_id' })
      .select()
      .single()
    if (error) throw new Error(`Failed to save SOAP note: ${error.message}`)
    return data as SoapNoteRow
  }
}
