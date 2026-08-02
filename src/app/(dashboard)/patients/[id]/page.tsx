import React from 'react'
import { notFound, redirect } from 'next/navigation'
import { getPatientByIdAction } from '@/actions/patients/patientActions'
import PatientProfileClient from './PatientProfileClient'

export const metadata = {
  title: 'Patient Profile — Durga ClinicOS',
}

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function PatientProfilePage({ params }: PageProps) {
  const { id } = await params
  const result = await getPatientByIdAction(id)

  if (!result.ok) {
    const err = result as { ok: false; error: string; message?: string }
    if (err.error === 'UNAUTHENTICATED') redirect('/login')
    if (err.error === 'FORBIDDEN') redirect('/patients')
    notFound()
  }

  return <PatientProfileClient patient={result.patient} />
}
