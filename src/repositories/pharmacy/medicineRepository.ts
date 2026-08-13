import type { SupabaseClient } from '@supabase/supabase-js'
import type { MedicineRow } from '@/types/pharmacy'

export async function getMedicines(supabase: SupabaseClient, clinicId: string): Promise<any[]> {
  const { data, error } = await supabase
    .from('medicines')
    .select('*, stock:medicine_stock(current_quantity, batch:medicine_batches(expiry_date, status))')
    .limit(100)
    .eq('clinic_id', clinicId)
    .order('generic_name', { ascending: true })
  
  if (error) throw new Error(`Failed to fetch medicines: ${error.message}`)

  // Calculate total active, unexpired stock
  return (data || []).map((med: any) => {
    const validStock = med.stock?.filter((s: any) => {
      const isExpired = s.batch?.expiry_date ? new Date(s.batch.expiry_date) < new Date() : false
      const isActive = s.batch?.status === 'Active'
      return isActive && !isExpired
    }) || []
    
    const total_stock = validStock.reduce((sum: number, s: any) => sum + (s.current_quantity || 0), 0)
    return { ...med, total_stock }
  })
}

export async function createMedicine(
  supabase: SupabaseClient,
  payload: Omit<MedicineRow, 'id' | 'created_at'>
): Promise<MedicineRow> {
  const { data, error } = await supabase
    .from('medicines')
    .insert([payload])
    .select()
    .single()
  
  if (error) throw new Error(`Failed to create medicine: ${error.message}`)
  return data as MedicineRow
}
