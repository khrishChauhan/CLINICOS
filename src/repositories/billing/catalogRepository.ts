import type { SupabaseClient } from '@supabase/supabase-js'
import type { ServiceRow, ServiceCategoryRow } from '@/types/billing'

export async function getServices(supabase: SupabaseClient, clinicId: string): Promise<ServiceRow[]> {
  const { data, error } = await supabase
    .from('services')
    .select('*')
    .eq('clinic_id', clinicId)
    .order('name', { ascending: true })

  if (error) throw new Error(`Failed to fetch services: ${error.message}`)
  return data as ServiceRow[]
}

export async function addService(
  supabase: SupabaseClient,
  payload: Omit<ServiceRow, 'id' | 'created_at' | 'updated_at'>
): Promise<ServiceRow> {
  const { data, error } = await supabase
    .from('services')
    .insert([payload])
    .select()
    .single()

  if (error) throw new Error(`Failed to create service: ${error.message}`)
  return data as ServiceRow
}
