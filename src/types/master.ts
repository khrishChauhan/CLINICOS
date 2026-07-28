// ─────────────────────────────────────────────────────────────────────────────
// Shared Master Module Types
// ─────────────────────────────────────────────────────────────────────────────

export interface MasterCountry {
  id: string
  country_code: string
  country_name: string
  iso_code?: string
  phone_code?: string
  currency?: string
  status: string
}

export interface MasterState {
  id: string
  country_id: string
  state_code: string
  state_name: string
  status: string
}

export interface MasterDistrict {
  id: string
  state_id: string
  district_name: string
  status: string
}

export interface MasterCity {
  id: string
  district_id: string
  city_name: string
  pincode?: string
  status: string
}

export interface MasterLanguage {
  id: string
  language_code: string
  language_name: string
  status: string
}

export interface MasterGender {
  id: string
  gender_code: string
  gender_name: string
  status: string
}

export interface MasterMaritalStatus {
  id: string
  status_code: string
  status_name: string
  status: string
}

export interface MasterReligion {
  id: string
  religion_code: string
  religion_name: string
  status: string
}

export interface MasterBloodGroup {
  id: string
  blood_group: string
  status: string
}

export interface MasterNationality {
  id: string
  nationality_name: string
  status: string
}

export interface MasterRelationshipType {
  id: string
  relationship_name: string
  status: string
}

// ─────────────────────────────────────────────────────────────────────────────
// Phase 2: Clinical Reference Masters
// ─────────────────────────────────────────────────────────────────────────────

export interface MasterDepartment {
  id: string
  department_code?: string
  department_name: string
  status: string
}

export interface MasterSpecialization {
  id: string
  department_id: string
  specialization_code?: string
  specialization_name: string
  status: string
}

export interface MasterAppointmentType {
  id: string
  appointment_type: string
  status: string
}

export interface MasterConsultationType {
  id: string
  consultation_type: string
  status: string
}

export interface MasterVisitType {
  id: string
  visit_type: string
  status: string
}

export interface MasterPriorityLevel {
  id: string
  priority_name: string
  display_order: number
  status: string
}

export interface MasterTokenStatus {
  id: string
  token_status: string
  status: string
}

export interface MasterAppointmentStatus {
  id: string
  appointment_status: string
  status: string
}

export interface MasterVisitStatus {
  id: string
  visit_status: string
  status: string
}

// ─────────────────────────────────────────────────────────────────────────────
// Phase 3: Medical Reference Masters
// ─────────────────────────────────────────────────────────────────────────────

export interface MasterDiagnosisCode {
  id: string
  icd_code?: string
  diagnosis_name: string
  category?: string
  status: string
}

export interface MasterProcedureCode {
  id: string
  procedure_code?: string
  procedure_name: string
  category?: string
  status: string
}

export interface MasterLaboratoryTest {
  id: string
  test_code?: string
  test_name: string
  category?: string
  sample_type?: string
  status: string
}

export interface MasterRadiologyTest {
  id: string
  test_code?: string
  test_name: string
  modality?: string
  status: string
}
