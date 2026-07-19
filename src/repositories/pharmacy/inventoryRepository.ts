import type { SupabaseClient } from '@supabase/supabase-js'
import type { MedicineBatchRow, StockTransactionRow } from '@/types/pharmacy'

export async function getMedicineStock(supabase: SupabaseClient, clinicId: string) {
  const { data, error } = await supabase
    .from('medicine_stock')
    .select('*, medicines(*), medicine_batches(*)')
    .eq('clinic_id', clinicId)
    .gt('current_quantity', 0)
    .order('current_quantity', { ascending: true })

  if (error) throw new Error(`Failed to fetch stock: ${error.message}`)
  return data
}

export async function createMedicineBatch(
  supabase: SupabaseClient,
  payload: Omit<MedicineBatchRow, 'id' | 'created_at'>
): Promise<MedicineBatchRow> {
  const { data, error } = await supabase
    .from('medicine_batches')
    .insert([payload])
    .select()
    .single()

  if (error) throw new Error(`Failed to create batch: ${error.message}`)
  return data as MedicineBatchRow
}

export async function recordStockTransaction(
  supabase: SupabaseClient,
  payload: Omit<StockTransactionRow, 'id' | 'created_at'>
): Promise<void> {
  // DB Trigger automatically updates medicine_stock on insert
  const { error } = await supabase
    .from('stock_transactions')
    .insert([payload])
    
  if (error) throw new Error(`Failed to record transaction: ${error.message}`)
}
