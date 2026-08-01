import type { SupabaseClient } from '@supabase/supabase-js'
import type { RadiologistFindingRow } from '@/types/radiology'

export const radiologistFindingRepository = {
  async getFindingsByReportId(supabase: SupabaseClient, clinicId: string, reportId: string) {
    const { data, error } = await supabase
      .from('radiologist_findings')
      .select('*')
      .eq('clinic_id', clinicId)
      .eq('radiology_report_id', reportId)
      .is('deleted_at', null)
      .single()

    if (error && error.code !== 'PGRST116') throw new Error(error.message)
    return data as RadiologistFindingRow | null
  },

  async upsertFindings(
    supabase: SupabaseClient,
    payload: Omit<RadiologistFindingRow, 'id' | 'created_at' | 'updated_at' | 'deleted_at'>
  ) {
    const existing = await this.getFindingsByReportId(supabase, payload.clinic_id, payload.radiology_report_id)

    if (existing) {
      const { data, error } = await supabase
        .from('radiologist_findings')
        .update({
          clinical_history: payload.clinical_history,
          technique: payload.technique,
          findings: payload.findings,
          impression: payload.impression,
          recommendations: payload.recommendations,
          is_critical_finding: payload.is_critical_finding,
          follow_up_recommendation: payload.follow_up_recommendation
        })
        .eq('id', existing.id)
        .select()
        .single()
      if (error) throw new Error(error.message)
      return data as RadiologistFindingRow
    } else {
      const { data, error } = await supabase
        .from('radiologist_findings')
        .insert([payload])
        .select()
        .single()
      if (error) throw new Error(error.message)
      return data as RadiologistFindingRow
    }
  }
}
