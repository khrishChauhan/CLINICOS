import React from 'react'
import { createAdminClient, createClient } from '@/lib/supabase/server'
import { getQueueForToday } from '@/repositories/appointments/appointmentRepository'
import QueueDashboardClient from './QueueDashboardClient'
import { getDoctorsForClinicAction } from '@/actions/appointments/getDoctorsForClinicAction'

export const metadata = {
  title: 'Live Queue — Clinicos',
}

export const dynamic = 'force-dynamic'

export default async function QueuePage() {
  try {
    const supabase = await createClient()
    const adminClient = createAdminClient()

    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) return <div className="flex items-center justify-center h-full text-slate-500">Please log in to view the queue.</div>

    const { data: profile } = await adminClient.from('users').select('clinic_id').eq('id', user.id).single()
    const clinicId = profile?.clinic_id
    if (!clinicId) return <div className="flex items-center justify-center h-full text-slate-500">Clinic context not found.</div>

    const [queue, doctorsResult] = await Promise.all([
      getQueueForToday(adminClient, clinicId),
      getDoctorsForClinicAction()
    ])

    return (
      <QueueDashboardClient
        initialQueue={queue}
        doctors={doctorsResult.data || []}
      />
    )
  } catch (err: any) {
    console.error('QueuePage error:', err)
    return <div className="flex items-center justify-center h-full text-red-500">Failed to load queue: {err.message}</div>
  }
}
