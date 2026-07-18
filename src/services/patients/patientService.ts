import type { SupabaseClient } from '@supabase/supabase-js'
import { findPatients } from '@/repositories/patients/patientRepository'
import type {
  PatientFilters,
  PatientListItem,
  PatientRow,
  PaginatedResult,
} from '@/types/patients'

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────

/** Compose a display-ready full name with optional title */
function composeFullName(row: PatientRow): string {
  return [row.title, row.first_name, row.middle_name, row.last_name]
    .filter(Boolean)
    .join(' ')
}

/** Derive 1–2 character avatar initials */
function composeInitials(row: PatientRow): string {
  return [row.first_name?.[0], row.last_name?.[0]]
    .filter(Boolean)
    .join('')
    .toUpperCase()
}

/** Sanitize and normalise the search term */
function normalizeSearch(search?: string): string | undefined {
  if (!search) return undefined
  const trimmed = search.trim()
  return trimmed.length > 0 ? trimmed : undefined
}

/** Map a raw DB row to a UI-ready PatientListItem */
function toListItem(row: PatientRow): PatientListItem {
  return {
    id: row.id,
    uhid: row.uhid,
    fullName: composeFullName(row),
    initials: composeInitials(row),
    title: row.title,
    gender: row.gender,
    age: row.age,
    ageUnit: row.age_unit ?? 'Years',
    bloodGroup: row.blood_group,
    mobileNumber: row.mobile_number,
    status: row.status ?? 'Active',
    registrationDate: row.registration_date,
    patientType: row.patient_type,
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Service
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Fetches a paginated + filtered patient list, shaping raw DB rows into
 * UI-ready PatientListItem objects. This is the ONLY layer that knows about
 * both the DB schema and the UI's data requirements.
 */
async function list(
  supabase: SupabaseClient,
  filters: PatientFilters
): Promise<PaginatedResult<PatientListItem>> {
  const normalizedFilters: PatientFilters = {
    ...filters,
    search: normalizeSearch(filters.search),
    // Default to Active patients unless caller explicitly sets status
    status: filters.status ?? 'Active',
  }

  const rawResult = await findPatients(supabase, normalizedFilters)

  return {
    ...rawResult,
    data: rawResult.data.map(toListItem),
  }
}

export const patientService = { list }
