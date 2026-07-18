export interface ConsultationRow {
  id: string
  clinic_id: string
  patient_id: string
  doctor_id: string
  appointment_id: string | null
  status: 'Draft' | 'Completed'
  is_locked: boolean
  started_at: string
  completed_at: string | null
  created_at: string
  updated_at: string
  created_by: string | null
}

export interface SoapNoteRow {
  id: string
  consultation_id: string
  subjective: string | null
  objective: string | null
  assessment: string | null
  plan: string | null
  created_at: string
  updated_at: string
  created_by: string | null
}

export interface DiagnosisRow {
  id: string
  consultation_id: string
  icd_code: string | null
  description: string
  type: 'Primary' | 'Secondary'
  notes: string | null
  created_at: string
}

export interface PrescriptionRow {
  id: string
  consultation_id: string
  clinic_id: string
  patient_id: string
  doctor_id: string
  notes: string | null
  created_at: string
}

export interface PrescriptionItemRow {
  id: string
  prescription_id: string
  medicine_name: string
  dosage: string | null
  frequency: string | null
  duration_days: number | null
  instructions: string | null
  created_at: string
}

export interface InvestigationOrderRow {
  id: string
  consultation_id: string
  test_name: string
  notes: string | null
  created_at: string
}

export interface FollowUpRow {
  id: string
  consultation_id: string
  follow_up_date: string
  notes: string | null
  created_at: string
}

// Composite interface for the full workspace state
export interface FullConsultationData {
  consultation: ConsultationRow
  soap: SoapNoteRow | null
  diagnoses: DiagnosisRow[]
  prescription: PrescriptionRow | null
  prescriptionItems: PrescriptionItemRow[]
  investigations: InvestigationOrderRow[]
  followUp: FollowUpRow | null
}
