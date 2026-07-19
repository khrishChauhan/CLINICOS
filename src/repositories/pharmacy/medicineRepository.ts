import type { SupabaseClient } from '@supabase/supabase-js'
import type { MedicineRow } from '@/types/pharmacy'

export async function getMedicines(supabase: SupabaseClient, clinicId: string): Promise<MedicineRow[]> {
  const { data, error } = await supabase
    .from('medicines')
    .select('*').limit(100)
    .eq('clinic_id', clinicId)
    .order('name', { ascending: true })
  
  if (error) throw new Error(`Failed to fetch medicines: ${error.message}`)
  return data as MedicineRow[]
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
