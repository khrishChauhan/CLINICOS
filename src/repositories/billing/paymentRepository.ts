import type { SupabaseClient } from '@supabase/supabase-js'
import type { PaymentRow } from '@/types/billing'

export async function recordPayment(
  supabase: SupabaseClient,
  payload: Omit<PaymentRow, 'id' | 'payment_date' | 'status'>
): Promise<PaymentRow> {
  const { data, error } = await supabase
    .from('payments')
    .insert([{ ...payload, status: 'Success' }])
    .select()
    .single()

  if (error) throw new Error(`Failed to record payment: ${error.message}`)
  return data as PaymentRow
}
