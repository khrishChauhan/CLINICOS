import type { SupabaseClient } from '@supabase/supabase-js'
import { getDailyRevenue, getAppointmentMetrics, getInventoryValue, getFeedbackMetrics } from '@/repositories/analytics/dashboardRepository'
import type { ExecutiveDashboardData, ClinicalDashboardData } from '@/types/analytics'

export const dashboardService = {
  async getExecutiveDashboard(supabase: SupabaseClient, clinicId: string): Promise<ExecutiveDashboardData> {
    const revenueRows = await getDailyRevenue(supabase, clinicId)
    const appointmentRows = await getAppointmentMetrics(supabase, clinicId)
    const inventoryValue = await getInventoryValue(supabase, clinicId)

    // Aggregate total revenue
    const totalRevenue = revenueRows.reduce((sum, r) => sum + r.total_revenue, 0)
    
    // Group revenue by date for the chart
    const revenueByDate = new Map<string, number>()
    for (const r of revenueRows) {
      revenueByDate.set(r.date, (revenueByDate.get(r.date) || 0) + r.total_revenue)
    }
    const revenueData = Array.from(revenueByDate.entries()).map(([date, amount]) => ({ date, amount }))

    // Aggregate appointments
    let totalConsultations = 0
    let totalNoShows = 0
    for (const r of appointmentRows) {
      if (r.status === 'Completed') totalConsultations += r.appointment_count
      if (r.status === 'No Show') totalNoShows += r.appointment_count
    }

    // Fetch Feedback Metrics
    const feedbackRows = await getFeedbackMetrics(supabase, clinicId)
    const feedbackCount = feedbackRows.length
    let avgDoctor = 0
    let avgSat = 0
    if (feedbackCount > 0) {
      avgDoctor = feedbackRows.reduce((sum, f) => sum + (f.doctor_experience_rating || 0), 0) / feedbackCount
      avgSat = feedbackRows.reduce((sum, f) => sum + (f.overall_rating || 0), 0) / feedbackCount
    }

    return {
      totalRevenue,
      totalConsultations,
      totalNoShows,
      inventoryValue,
      revenueData,
      feedbackCount,
      averageDoctorRating: Number(avgDoctor.toFixed(1)),
      averageSatisfaction: Number(avgSat.toFixed(1))
    }
  },

  async getClinicalDashboard(supabase: SupabaseClient, clinicId: string, doctorId: string): Promise<ClinicalDashboardData> {
    const appointmentRows = await getAppointmentMetrics(supabase, clinicId, doctorId)
    
    let totalConsultations = 0
    let upcomingAppointments = 0
    
    const apptByDate = new Map<string, number>()

    for (const r of appointmentRows) {
      if (r.status === 'Completed') totalConsultations += r.appointment_count
      if (r.status === 'Scheduled' || r.status === 'Checked In') upcomingAppointments += r.appointment_count
      
      apptByDate.set(r.date, (apptByDate.get(r.date) || 0) + r.appointment_count)
    }

    const appointmentTrend = Array.from(apptByDate.entries()).map(([date, count]) => ({ date, count }))

    return {
      totalConsultations,
      upcomingAppointments,
      completedLabOrders: 0, // Placeholder if we want to add lab order view
      appointmentTrend
    }
  }
}
