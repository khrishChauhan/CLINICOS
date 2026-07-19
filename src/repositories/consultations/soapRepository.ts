import type { SupabaseClient } from '@supabase/supabase-js'
import type { SoapNoteRow } from '@/types/consultations'

export async function getSoapNote(
  supabase: SupabaseClient,
  consultationId: string
): Promise<SoapNoteRow | null> {
  const { data, error } = await supabase
    .from('soap_notes')
    .select('*').limit(100)
    .eq('consultation_id', consultationId)
    .maybeSingle()

  if (error) throw new Error(`Failed to fetch SOAP note: ${error.message}`)
  return data as SoapNoteRow | null
}

export async function upsertSoapNote(
  supabase: SupabaseClient,
  consultationId: string,
  userId: string,
  payload: Partial<SoapNoteRow>
): Promise<SoapNoteRow> {
  // Try to find it
  const existing = await getSoapNote(supabase, consultationId)
  
  if (existing) {
    // Update
    const { data, error } = await supabase
      .from('soap_notes')
      .update({ ...payload, updated_at: new Date().toISOString() })
      .eq('id', existing.id)
      .select()
      .single()
      
    if (error) throw new Error(`Failed to update SOAP note: ${error.message}`)
    return data as SoapNoteRow
  } else {
    // Insert
    const { data, error } = await supabase
      .from('soap_notes')
      .insert([{ 
        ...payload, 
        consultation_id: consultationId, 
        created_by: userId 
      }])
      .select()
      .single()
      
    if (error) throw new Error(`Failed to create SOAP note: ${error.message}`)
    return data as SoapNoteRow
  }
}
