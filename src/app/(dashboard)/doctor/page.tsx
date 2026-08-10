import React from 'react'
import { createClient, createAdminClient } from '@/lib/supabase/server'
import { getQueueForToday } from '@/repositories/appointments/appointmentRepository'
import DoctorDashboardClient from './DoctorDashboardClient'

export const metadata = {
  title: 'Doctor Dashboard — Durga ClinicOS',
}

export default async function DoctorDashboardPage() {
  const supabase = await createClient()
  const adminClient = createAdminClient()
  const { data: session } = await supabase.rpc('get_session_context')
  
  const clinicId = session?.clinic_id
  const userIdFromSession = session?.user_id
  
  if (!clinicId || !userIdFromSession) return <div>Unauthorized</div>

  // BUG-12 FIX: session.user_id is auth.users.id, but appointments.doctor_id
  // stores public.users.id. For queue filtering, we use the user_id directly
  // since appointments.doctor_id → public.users.id FK. 
  // The supabase user_id from session IS the public.users.id.
  const queue = await getQueueForToday(supabase, clinicId, userIdFromSession)

  return <DoctorDashboardClient initialQueue={queue} doctorId={userIdFromSession} />
}
