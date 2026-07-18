import React from 'react'
import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { patientService } from '@/services/patients/patientService'
import PatientProfileClient from './PatientProfileClient'

export const metadata = {
  title: 'Patient Profile — Durga ClinicOS',
}

interface PageProps {
  params: { id: string }
}

export default async function PatientProfilePage({ params }: PageProps) {
  const supabase = await createClient()
  const patient = await patientService.getPatientById(supabase, params.id)
  
  if (!patient) {
    notFound()
  }

  // Need to get session context to check permissions if we wanted
  // But client component can also check permissions via context if needed

  return <PatientProfileClient patient={patient} />
}
