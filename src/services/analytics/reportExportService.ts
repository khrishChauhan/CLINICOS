import type { SupabaseClient } from '@supabase/supabase-js'
import { generateRevenueReport, generateAppointmentsReport } from '@/repositories/analytics/reportRepository'

export const reportExportService = {
  async generateReport(
    supabase: SupabaseClient,
    clinicId: string,
    reportType: string,
    startDate: string,
    endDate: string
  ) {
    if (reportType === 'revenue') {
      return await generateRevenueReport(supabase, clinicId, startDate, endDate)
    } else if (reportType === 'appointments') {
      return await generateAppointmentsReport(supabase, clinicId, startDate, endDate)
    }
    
    throw new Error('Unsupported report type')
  }
}
