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
