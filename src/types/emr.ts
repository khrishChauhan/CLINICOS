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
