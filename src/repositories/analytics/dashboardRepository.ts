import type { SupabaseClient } from '@supabase/supabase-js'

export async function getDailyRevenue(supabase: SupabaseClient, clinicId: string) {
  const { data, error } = await supabase
    .from('view_daily_revenue')
    .select('*').limit(100)
    .eq('clinic_id', clinicId)
    .order('date', { ascending: true })
  
  if (error) throw new Error(`Failed to fetch daily revenue: ${error.message}`)
  return data
}

export async function getAppointmentMetrics(supabase: SupabaseClient, clinicId: string, doctorId?: string) {
  let query = supabase
    .from('view_appointment_metrics')
    .select('*').limit(100)
    .eq('clinic_id', clinicId)
    
  if (doctorId) {
    query = query.eq('doctor_id', doctorId)
  }
  
  const { data, error } = await query.order('date', { ascending: true })
  if (error) throw new Error(`Failed to fetch appointment metrics: ${error.message}`)
  return data
}

export async function getInventoryValue(supabase: SupabaseClient, clinicId: string) {
  const { data, error } = await supabase
    .from('medicine_stock')
    .select('current_quantity, medicines(price)')
    .eq('clinic_id', clinicId)
    
  if (error) throw new Error(`Failed to fetch inventory value: ${error.message}`)
  
  let totalValue = 0
  for (const row of data) {
    const med = Array.isArray(row.medicines) ? row.medicines[0] : (row.medicines as any)
    if (med?.price) {
      totalValue += row.current_quantity * Number(med.price)
    }
  }
  
  return totalValue
}
