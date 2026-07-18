import React from 'react'
import { createClient } from '@/lib/supabase/server'
import { getQueueForToday } from '@/repositories/appointments/appointmentRepository'
import DoctorDashboardClient from './DoctorDashboardClient'

export const metadata = {
  title: 'Doctor Dashboard — Durga ClinicOS',
}

export default async function DoctorDashboardPage() {
  const supabase = await createClient()
  const { data: session } = await supabase.rpc('get_session_context')
  
  const clinicId = session?.clinic_id
  const doctorId = session?.user_id
  
  if (!clinicId || !doctorId) return <div>Unauthorized</div>

  // Fetch only this doctor's queue
  const queue = await getQueueForToday(supabase, clinicId, doctorId)

  return <DoctorDashboardClient initialQueue={queue} doctorId={doctorId} />
}
