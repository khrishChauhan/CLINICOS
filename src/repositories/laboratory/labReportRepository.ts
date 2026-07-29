import type { SupabaseClient } from '@supabase/supabase-js'
import type { LabReportRow } from '@/types/laboratory'

export const labReportRepository = {
  async getReports(supabase: SupabaseClient, clinicId: string) {
    const { data, error } = await supabase
      .from('lab_reports')
      .select(`
        *,
        lab_order:lab_orders(
          order_number,
          patient:patients(first_name, last_name)
        ),
        generator:users!lab_reports_generated_by_fkey(first_name, last_name),
        approver:users!lab_reports_approved_by_fkey(first_name, last_name)
      `)
      .eq('clinic_id', clinicId)
      .order('generated_at', { ascending: false })
    if (error) throw new Error(error.message)
    return data
  },

  async getReportById(supabase: SupabaseClient, clinicId: string, reportId: string) {
    const { data, error } = await supabase
      .from('lab_reports')
      .select(`
        *,
        lab_order:lab_orders(
          *,
          patient:patients(first_name, last_name, date_of_birth, gender),
          lab_order_items(
            *,
            lab_tests(
              *,
              lab_results(*, lab_result_parameters(*))
            )
          )
        ),
        generator:users!lab_reports_generated_by_fkey(first_name, last_name),
        approver:users!lab_reports_approved_by_fkey(first_name, last_name)
      `)
      .eq('clinic_id', clinicId)
      .eq('id', reportId)
      .single()
    if (error) throw new Error(error.message)
    return data
  },

  async approveReport(supabase: SupabaseClient, clinicId: string, reportId: string, approvedBy: string) {
    const { data, error } = await supabase
      .from('lab_reports')
      .update({ report_status: 'Approved', approved_by: approvedBy, approved_at: new Date().toISOString(), updated_at: new Date().toISOString() })
      .eq('clinic_id', clinicId)
      .eq('id', reportId)
      .select()
      .single()
    if (error) throw new Error(error.message)
    return data as LabReportRow
  }
}
