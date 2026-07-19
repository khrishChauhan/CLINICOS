import type { SupabaseClient } from '@supabase/supabase-js'
import type { CommunicationHistoryRow } from '@/types/notifications'

export async function logCommunication(
  supabase: SupabaseClient, 
  payload: Omit<CommunicationHistoryRow, 'id' | 'sent_at'>
) {
  const { error } = await supabase
    .from('communication_history')
    .insert([payload])
    
  if (error) throw new Error(`Failed to log communication: ${error.message}`)
}

export async function getHistory(supabase: SupabaseClient, clinicId: string) {
  const { data, error } = await supabase
    .from('communication_history')
    .select('*, patients(first_name, last_name)')
    .eq('clinic_id', clinicId)
    .order('sent_at', { ascending: false })
    .limit(100)
    
  if (error) throw new Error(`Failed to fetch history: ${error.message}`)
  return data
}
