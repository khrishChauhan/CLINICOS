import React from 'react'
import { createClient } from '@/lib/supabase/server'
import { getQueueForToday } from '@/repositories/appointments/appointmentRepository'
import QueueDashboardClient from './QueueDashboardClient'

export const metadata = {
  title: 'Live Queue — Durga ClinicOS',
}

export default async function QueuePage() {
  const supabase = await createClient()
  const { data: session } = await supabase.rpc('get_session_context')
  
  const clinicId = session?.clinic_id
  
  if (!clinicId) return <div>Unauthorized</div>

  // For the receptionist, we fetch the whole queue. If Doctor, we could filter by doctorId.
  const queue = await getQueueForToday(supabase, clinicId)

  return <QueueDashboardClient initialQueue={queue} />
}
