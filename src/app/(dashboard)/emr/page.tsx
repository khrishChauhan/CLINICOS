import React from 'react'
import { getAppointmentsAction, getAppointmentStatsAction } from '@/actions/appointments/getAppointmentsAction'
import EMRQueueClient from './EMRQueueClient'

// BUG-03 FIX: Convert from 'use client' with useEffect to a proper Server Component.
// Data is fetched server-side and passed as props to the client component.
export default async function DoctorActiveQueuePage() {
  const today = new Date().toISOString().split('T')[0]

  const [appointmentsRes, statsRes] = await Promise.all([
    getAppointmentsAction(today),
    getAppointmentStatsAction(today)
  ])

  const allAppointments = appointmentsRes.success ? appointmentsRes.data : []
  // Filter only active/waiting patients for the doctor queue
  const activeAppointments = allAppointments.filter((a: any) =>
    ['Checked In', 'In Consultation'].includes(a.status)
  )
  const stats = statsRes.success ? statsRes.stats : {}

  return <EMRQueueClient initialAppointments={activeAppointments} initialStats={stats} />
}