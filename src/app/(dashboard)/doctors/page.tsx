import { getDoctorsAction } from '@/actions/doctors/doctorActions'
import DoctorsClient from './DoctorsClient'
import type { DoctorRow } from '@/types/doctors'

export const metadata = {
  title: 'Doctors Registry — Durga ClinicOS',
  description: 'Search, filter, and manage doctor profiles for Durga Clinic.',
}

interface SearchParams {
  search?: string
  status?: string
}

/**
 * Doctors Page — Server Component
 *
 * Fetches all doctors server-side and passes to DoctorsClient.
 * DoctorsClient handles filtering and status updates via useTransition.
 */
export default async function DoctorsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>
}) {
  const params = await searchParams
  const result = await getDoctorsAction()
  if (!result.success) {
    console.error('getDoctorsAction failed:', result.error)
  }
  const doctors: DoctorRow[] = result.success ? result.data : []

  return (
    <DoctorsClient
      initialDoctors={doctors}
      initialSearch={params.search || ''}
      initialStatus={params.status || ''}
      hasError={!result.success}
      errorMessage={result.error}
    />
  )
}