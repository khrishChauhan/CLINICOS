import type { SupabaseClient } from '@supabase/supabase-js'
import { doctorPerformanceRepository } from '@/repositories/doctors/doctorPerformanceRepository'

export const doctorPerformanceService = {
  async refreshPerformanceData(supabase: SupabaseClient, clinicId: string, doctorId: string, monthStr: string) {
    // monthStr should be YYYY-MM
    // 1. Calculate the date range
    const [year, month] = monthStr.split('-')
    const startDate = new Date(parseInt(year), parseInt(month) - 1, 1).toISOString()
    const endDate = new Date(parseInt(year), parseInt(month), 0, 23, 59, 59).toISOString()

    // 2. Fetch appointments for this doctor in this month
    const { data: appointments, error } = await supabase
      .schema('public')
      .from('appointments')
      .select('status, fee_amount, appointment_type')
      .eq('clinic_id', clinicId)
      .eq('doctor_id', doctorId)
      .gte('appointment_date', startDate)
      .lte('appointment_date', endDate)

    // Handle months with zero appointments gracefully
    if (error || !appointments || appointments.length === 0) {
      return await doctorPerformanceRepository.upsertPerformance(supabase, {
        clinic_id: clinicId,
        doctor_id: doctorId,
        report_month: monthStr,
        total_patients: 0,
        completed_consultations: 0,
        followups: 0,
        cancelled_appointments: 0,
        average_consultation_time: 0,
        revenue_generated: 0
      })
    }

    // 3. Aggregate metrics
    let totalPatients = appointments.length
    let completed = 0
    let followups = 0
    let cancelled = 0
    let revenue = 0

    appointments.forEach(apt => {
      if (apt.status === 'Completed') completed++
      if (apt.status === 'Cancelled') cancelled++
      if (apt.appointment_type === 'Follow-up') followups++
      if (apt.status === 'Completed' && apt.fee_amount) {
        revenue += Number(apt.fee_amount)
      }
    })

    // Upsert the generated metrics
    return await doctorPerformanceRepository.upsertPerformance(supabase, {
      clinic_id: clinicId,
      doctor_id: doctorId,
      report_month: monthStr,
      total_patients: totalPatients,
      completed_consultations: completed,
      followups: followups,
      cancelled_appointments: cancelled,
      average_consultation_time: 15, // Default/mocked for now unless we have exact start/end times
      revenue_generated: revenue
    })
  }
}
