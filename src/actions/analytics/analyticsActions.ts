'use server'

import { createClient } from '@/lib/supabase/server'
import { dashboardService } from '@/services/analytics/dashboardService'
import { reportExportService } from '@/services/analytics/reportExportService'

export async function fetchDashboardDataAction() {
  try {
    const supabase = await createClient()
    const { data: session } = await supabase.rpc('get_session_context')
    if (!session) throw new Error('Unauthorized')

    // Fetch user role to determine which dashboard to show
    const { data: userRole } = await supabase
      .from('user_roles')
      .select('roles(role_name)')
      .eq('user_id', session.user_id)
      .single()

    const roleName = Array.isArray(userRole?.roles) ? userRole?.roles[0]?.role_name : (userRole?.roles as any)?.role_name

    if (roleName === 'Super Admin') {
      const data = await dashboardService.getExecutiveDashboard(supabase, session.clinic_id)
      return { ok: true, type: 'executive', data }
    } else {
      const data = await dashboardService.getClinicalDashboard(supabase, session.clinic_id, session.user_id)
      return { ok: true, type: 'clinical', data }
    }
  } catch (e: any) {
    return { ok: false, error: e.message }
  }
}

export async function generateReportAction(reportType: string, startDate: string, endDate: string) {
  try {
    const supabase = await createClient()
    const { data: session } = await supabase.rpc('get_session_context')
    if (!session) throw new Error('Unauthorized')

    const data = await reportExportService.generateReport(supabase, session.clinic_id, reportType, startDate, endDate)
    return { ok: true, data }
  } catch (e: any) {
    return { ok: false, error: e.message }
  }
}
