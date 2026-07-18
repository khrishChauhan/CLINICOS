// ─────────────────────────────────────────────────────────────────────────────
// Shared Patient module TypeScript types
// ─────────────────────────────────────────────────────────────────────────────

/** Lightweight row returned by the Patient List query */
export interface PatientListItem {
  id: string
  uhid: string
  fullName: string        // composed: "Mr. John Smith"
  initials: string        // composed: "JS" — used for avatar
  title: string | null
  gender: string | null
  age: number | null
  ageUnit: string
  bloodGroup: string | null
  mobileNumber: string
  status: string
  registrationDate: string | null
  patientType: string | null
}

/** Raw row shape returned directly from the Supabase query */
export interface PatientRow {
  id: string
  uhid: string
  title: string | null
  first_name: string
  middle_name: string | null
  last_name: string | null
  gender: string | null
  age: number | null
  age_unit: string | null
  blood_group: string | null
  mobile_number: string
  status: string | null
  registration_date: string | null
  patient_type: string | null
}

/** Input filter shape accepted by the Action and Service */
export interface PatientFilters {
  search?: string        // matches uhid / name / mobile
  gender?: string        // 'Male' | 'Female' | 'Other'
  bloodGroup?: string    // 'A+' | 'B+' | etc.
  status?: string        // 'Active' | 'Inactive' — default 'Active'
  page?: number          // 1-indexed, default 1
  pageSize?: number      // default 15
}

/** Generic paginated result envelope */
export interface PaginatedResult<T> {
  data: T[]
  totalCount: number
  page: number
  pageSize: number
  totalPages: number
}

/** Action return type — either success or an error code */
export type PatientListResult =
  | { ok: true; result: PaginatedResult<PatientListItem> }
  | { ok: false; error: 'UNAUTHENTICATED' | 'FORBIDDEN' | 'QUERY_ERROR'; message?: string }
