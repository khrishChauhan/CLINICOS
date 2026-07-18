import React from 'react'
import { listPatients } from '@/actions/patients/listPatients'
import PatientsClient from './PatientsClient'
import type { PatientFilters } from '@/types/patients'

interface SearchParams {
  search?: string
  gender?: string
  bloodGroup?: string
  status?: string
  page?: string
}

export const metadata = {
  title: 'Patient Registry — Durga ClinicOS',
  description: 'Search, filter, and manage patient records for Durga Clinic.',
}

/**
 * Patients Page — Server Component
 *
 * Reads URL search params → calls Server Action → passes initial data to
 * PatientsClient. Client component then handles live filter/search updates
 * using useTransition + Server Actions (no full page reload).
 */
export default async function PatientsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>
}) {
  const params = await searchParams

  const filters: PatientFilters = {
    search:     params.search     || undefined,
    gender:     params.gender     || undefined,
    bloodGroup: params.bloodGroup || undefined,
    status:     params.status     || 'Active',
    page:       params.page ? Math.max(1, parseInt(params.page, 10)) : 1,
    pageSize:   15,
  }

  // Fetch on the server for initial render — no client-side waterfall
  const initialData = await listPatients(filters)

  return (
    <PatientsClient
      initialData={initialData}
      initialFilters={filters}
    />
  )
}