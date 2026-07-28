// ─────────────────────────────────────────────────────────────────────────────
// EMR Module TypeScript Types — Phase 1
// ─────────────────────────────────────────────────────────────────────────────

export interface VisitRow {
  id: string
  clinic_id: string
  patient_id: string
  appointment_id: string | null
  doctor_id: string
  department_id: string | null
  visit_number: string
  visit_type: string
  visit_date: string
  consultation_start_time: string | null
  consultation_end_time: string | null
  chief_complaint: string | null
  provisional_diagnosis: string | null
  final_diagnosis: string | null
  treatment_plan: string | null
  notes: string | null
  followup_required: boolean
  followup_date: string | null
  consultation_status: 'In Progress' | 'Completed' | 'Cancelled'
  created_by: string | null
  created_at: string
  updated_at: string
  master_department_id?: string | null
  visit_type_id?: string | null
  visit_status_id?: string | null
}

export interface CreateVisitPayload {
  clinic_id: string
  patient_id: string
  appointment_id?: string | null
  doctor_id: string
  department_id?: string | null
  visit_type?: string
  visit_date?: string
  chief_complaint?: string | null
  consultation_start_time?: string | null
  created_by?: string | null
  master_department_id?: string | null
  visit_type_id?: string | null
  visit_status_id?: string | null
}

export interface SoapNoteRow {
  id: string
  clinic_id: string
  visit_id: string
  subjective: string | null
  objective: string | null
  assessment: string | null
  plan: string | null
  created_by: string | null
  created_at: string
  updated_at: string
}

export interface ChiefComplaintRow {
  id: string
  clinic_id: string
  visit_id: string
  complaint: string
  duration: string | null
  severity: 'Mild' | 'Moderate' | 'Severe' | null
  remarks: string | null
  created_at: string
}

export interface VitalsRow {
  id: string
  clinic_id: string
  visit_id: string
  height_cm: number | null
  weight_kg: number | null
  bmi: number | null
  temperature_c: number | null
  pulse_rate: number | null
  respiratory_rate: number | null
  oxygen_saturation: number | null
  blood_pressure_systolic: number | null
  blood_pressure_diastolic: number | null
  blood_sugar: number | null
  pain_score: number | null
  recorded_by: string | null
  recorded_at: string
}

// ─────────────────────────────────────────────────────────────────────────────
// Phase 2 Types
// ─────────────────────────────────────────────────────────────────────────────

export type DiagnosisStatus = 'Active' | 'Resolved' | 'Chronic' | 'Ruled Out'
export type DiagnosisType = 'Primary' | 'Secondary'

export interface DiagnosisRow {
  id: string
  clinic_id: string
  visit_id: string
  diagnosis_code: string | null
  diagnosis_name: string
  diagnosis_type: DiagnosisType
  icd_code: string | null
  diagnosis_notes: string | null
  status: DiagnosisStatus
  created_by: string | null
  created_at: string
  updated_at: string
}

export type ProcedureStatus = 'Planned' | 'In Progress' | 'Completed' | 'Cancelled'

export interface ProcedureRow {
  id: string
  clinic_id: string
  visit_id: string
  procedure_code: string | null
  procedure_name: string
  procedure_date: string | null
  performed_by: string | null
  remarks: string | null
  status: ProcedureStatus
  created_at: string
  updated_at: string
}

export interface PrescriptionRow {
  id: string
  clinic_id: string
  visit_id: string
  doctor_id: string
  prescription_date: string
  advice: string | null
  dietary_advice: string | null
  next_visit: string | null
  digital_signature: string | null
  created_at: string
  updated_at: string
}

export interface PrescriptionItemRow {
  id: string
  clinic_id: string
  prescription_id: string
  medicine_id: string | null
  medicine_name: string
  dosage: string | null
  frequency: string | null
  duration: string | null
  quantity: number | null
  route: string | null
  before_after_food: string | null
  instructions: string | null
  created_at: string
}

// ─────────────────────────────────────────────────────────────────────────────
// Phase 3 Types
// ─────────────────────────────────────────────────────────────────────────────

export interface EditHistoryEntry {
  edited_at: string
  previous_content: string
  edited_by: string
}

export interface ClinicalNoteRow {
  id: string
  clinic_id: string
  visit_id: string
  note_type: string
  note: string
  entered_by: string
  entered_at: string
  edit_history: EditHistoryEntry[]
  created_at: string
  updated_at: string
}

export interface FollowUpPlanRow {
  id: string
  clinic_id: string
  visit_id: string
  followup_date: string
  followup_reason: string | null
  instructions: string | null
  reminder_required: boolean
  created_at: string
  updated_at: string
}

export interface ClinicalAttachmentRow {
  id: string
  clinic_id: string
  visit_id: string
  attachment_path: string
  attachment_type: string
  file_name: string
  file_size: number
  mime_type: string | null
  remarks: string | null
  uploaded_by: string | null
  uploaded_at: string
}

// ─────────────────────────────────────────────────────────────────────────────
// Phase 4 Types
// ─────────────────────────────────────────────────────────────────────────────

export interface ReferralRow {
  id: string
  clinic_id: string
  visit_id: string
  referred_doctor: string | null
  referred_hospital: string | null
  referral_reason: string
  referral_date: string
  status: string
  created_at: string
  updated_at: string
}

export interface ClinicalAlertRow {
  id: string
  clinic_id: string
  patient_id: string
  visit_id: string | null
  alert_type: string
  alert_message: string
  severity: 'High' | 'Medium' | 'Low'
  resolved: boolean
  created_at: string
  updated_at: string
}

export interface TreatmentPlanRow {
  id: string
  clinic_id: string
  patient_id: string
  visit_id: string
  treatment_goal: string
  treatment_description: string
  expected_duration: string | null
  review_date: string | null
  status: 'Active' | 'Completed' | 'Discontinued'
  created_at: string
  updated_at: string
}

export interface ClinicalOrderRow {
  id: string
  clinic_id: string
  visit_id: string
  order_type: string
  order_reference: string | null
  ordered_by: string
  order_date: string
  status: 'Ordered' | 'In Progress' | 'Resulted' | 'Cancelled'
  created_at: string
  updated_at: string
}

export interface TimelineEvent {
  id: string
  event_type: string
  event_description: string
  event_date: string
  source_table: string
  source_id: string
  metadata?: any
}

// ─────────────────────────────────────────────────────────────────────────────
// Phase 5 Types
// ─────────────────────────────────────────────────────────────────────────────

export interface DiagnosisHistoryRow {
  id: string
  clinic_id: string
  patient_id: string
  visit_id: string
  diagnosis_name: string
  diagnosis_date: string
  resolved_date: string
  status: string
  created_at: string
}

export interface EMRAuditRow {
  id: string
  clinic_id: string
  visit_id: string | null
  patient_id: string | null
  action: string
  action_by: string
  table_name: string
  record_id: string
  previous_value: any | null
  new_value: any | null
  ip_address: string | null
  action_time: string
}




