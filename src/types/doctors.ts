export interface DoctorRow {
  id: string;
  clinic_id: string;
  user_id: string | null;
  doctor_code: string;
  first_name: string;
  middle_name?: string | null;
  last_name: string;
  gender?: string | null;
  date_of_birth?: string | null;
  blood_group?: string | null;
  mobile_number?: string | null;
  alternate_mobile?: string | null;
  email?: string | null;
  profile_photo?: string | null;
  consultation_type?: string | null;
  joining_date?: string | null;
  experience_years?: number | null;
  status: string;
  remarks?: string | null;
  created_at: string;
  updated_at: string;
  created_by?: string | null;
  updated_by?: string | null;
}

export interface DoctorQualificationRow {
  id: string;
  clinic_id: string;
  doctor_id: string;
  qualification: string;
  university: string;
  institution?: string | null;
  passing_year?: number | null;
  specialization?: string | null;
  certificate_attachment_id?: string | null;
  remarks?: string | null;
  created_at: string;
  updated_at: string;
}

export interface DoctorRegistrationRow {
  id: string;
  clinic_id: string;
  doctor_id: string;
  registration_number: string;
  registration_council: string;
  registration_state?: string | null;
  registration_date?: string | null;
  expiry_date?: string | null;
  attachment_id?: string | null;
  verification_status: string;
  created_at: string;
  updated_at: string;
}

export interface DoctorSpecializationRow {
  id: string;
  clinic_id: string;
  doctor_id: string;
  specialization_name: string;
  department_id?: string | null;
  years_of_experience?: number | null;
  primary_specialization: boolean;
  remarks?: string | null;
  created_at: string;
  updated_at: string;
}

export interface DoctorDepartmentRow {
  id: string;
  clinic_id: string;
  doctor_id: string;
  department_id: string;
  designation?: string | null;
  joining_date?: string | null;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface DoctorBlockedSlotRow {
  id: string;
  clinic_id: string;
  doctor_id: string;
  block_date: string;
  start_time: string;
  end_time: string;
  reason?: string | null;
  created_at: string;
  updated_at: string;
  created_by?: string | null;
}

export interface DoctorLeaveRow {
  id: string;
  clinic_id: string;
  doctor_id: string;
  leave_type: string;
  start_date: string;
  end_date: string;
  reason?: string | null;
  approval_status: string;
  approved_by?: string | null;
  remarks?: string | null;
  created_at: string;
  updated_at: string;
}

export interface DoctorConsultationFeeRow {
  id: string;
  clinic_id: string;
  doctor_id: string;
  consultation_type: string;
  consultation_fee: number;
  followup_fee: number;
  emergency_fee: number;
  teleconsultation_fee: number;
  effective_from: string;
  status: string;
  created_at: string;
  updated_at: string;
  created_by?: string | null;
}

export interface DoctorDigitalSignatureRow {
  id: string;
  clinic_id: string;
  doctor_id: string;
  file_path: string;
  signature_type: string;
  issue_date?: string | null;
  expiry_date?: string | null;
  status: string;
  created_at: string;
  updated_at: string;
  created_by?: string | null;
}

export interface DoctorDocumentRow {
  id: string;
  clinic_id: string;
  doctor_id: string;
  file_path: string;
  document_type: string;
  document_name: string;
  remarks?: string | null;
  uploaded_at: string;
  created_by?: string | null;
}
