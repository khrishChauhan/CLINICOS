import type { SupabaseClient } from '@supabase/supabase-js'
import type { DoctorPerformanceRow } from '@/types/doctors'

export const doctorPerformanceRepository = {
  async getPerformanceHistory(supabase: SupabaseClient, clinicId: string, doctorId: string): Promise<DoctorPerformanceRow[]> {
    const { data, error } = await supabase
      .from('doctor_performance')
      .select('*')
      .eq('clinic_id', clinicId)
      .eq('doctor_id', doctorId)
      .order('report_month', { ascending: false })

    if (error) throw new Error(`Failed to fetch performance: ${error.message}`)
    return data as DoctorPerformanceRow[]
  },

  async upsertPerformance(supabase: SupabaseClient, payload: Partial<DoctorPerformanceRow>): Promise<DoctorPerformanceRow> {
    const { data, error } = await supabase
      .from('doctor_performance')
      .upsert(payload, { onConflict: 'doctor_id,report_month' })
      .select()
      .single()

    if (error) throw new Error(`Failed to upsert performance: ${error.message}`)
    return data as DoctorPerformanceRow
  }
}
