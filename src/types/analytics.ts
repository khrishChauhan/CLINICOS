export interface DailyRevenueRow {
  clinic_id: string
  date: string
  payment_method: string
  total_revenue: number
}

export interface AppointmentMetricRow {
  clinic_id: string
  doctor_id: string | null
  date: string
  status: string
  appointment_count: number
}

export interface ExecutiveDashboardData {
  totalRevenue: number
  totalConsultations: number
  totalNoShows: number
  inventoryValue: number
  revenueData: { date: string; amount: number }[]
}

export interface ClinicalDashboardData {
  totalConsultations: number
  upcomingAppointments: number
  completedLabOrders: number
  appointmentTrend: { date: string; count: number }[]
}
