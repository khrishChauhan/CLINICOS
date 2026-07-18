import React from 'react'
import PatientRegistrationWizard from './PatientRegistrationWizard'

export const metadata = {
  title: 'Register Patient — Durga ClinicOS',
  description: 'Register a new patient using the 11-step registration wizard.',
}

export default function RegisterPatientPage() {
  return <PatientRegistrationWizard />
}
