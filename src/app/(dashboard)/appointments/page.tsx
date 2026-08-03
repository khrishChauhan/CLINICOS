import React from 'react'
import AppointmentsClient from './AppointmentsClient'
import { getAppointmentsAction, getAppointmentStatsAction } from '@/actions/appointments/getAppointmentsAction'
import { getDoctorsForClinicAction } from '@/actions/appointments/getDoctorsForClinicAction'
import { CalendarDays, AlertTriangle } from 'lucide-react'

export const metadata = {
  title: 'Appointments Schedule — Clinicos',
}

export const dynamic = 'force-dynamic'

interface Props {
  searchParams: Promise<{ date?: string, doctorId?: string }>
}

export default async function AppointmentsPage({ searchParams }: Props) {
  const params = await searchParams
  const currentDate = params.date || new Date().toISOString().split('T')[0]
  const currentDoctorId = params.doctorId || 'All'
  
  try {
    const filterDoctorId = currentDoctorId !== 'All' ? currentDoctorId : undefined

    const [appointmentsResult, statsResult, doctorsResult] = await Promise.all([
      getAppointmentsAction(currentDate, filterDoctorId),
      getAppointmentStatsAction(currentDate),
      getDoctorsForClinicAction()
    ])

    return (
      <AppointmentsClient 
        initialAppointments={appointmentsResult.data || []}
        stats={statsResult.stats || { total: 0, scheduled: 0, checkedIn: 0, inConsultation: 0, completed: 0, cancelled: 0 }}
        doctors={doctorsResult.data || []}
        currentDate={currentDate}
        currentDoctorId={currentDoctorId}
      />
    )
  } catch (err: any) {
    console.error('AppointmentsPage error:', err)
    return (
      <div className="flex-1 p-6 flex flex-col items-center justify-center text-red-500 gap-4">
        <AlertTriangle className="w-12 h-12 opacity-50" />
        <p>Failed to load appointments: {err.message}</p>
      </div>
    )
  }
}