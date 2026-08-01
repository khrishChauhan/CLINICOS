export type RadiologyOrderStatus = 'Ordered' | 'Scheduled' | 'Completed' | 'Cancelled'
export type RadiologyOrderItemStatus = 'Ordered' | 'Scheduled' | 'Completed' | 'Cancelled'
export type RadiologyScheduleStatus = 'Scheduled' | 'Completed' | 'Cancelled' | 'No Show'
export type RadiologyPriority = 'Routine' | 'Urgent' | 'Stat'
export type RadiologyEquipmentStatus = 'Active' | 'Maintenance' | 'Calibration' | 'Out of Service' | 'Retired'
export type RadiologyQCStatus = 'Completed' | 'Pending'
export type RadiologyQCResult = 'Pass' | 'Fail' | 'Warning'

export interface RadiologyOrderRow {
  id: string
  clinic_id: string
  patient_id: string
  visit_id: string
  appointment_id?: string
  doctor_id: string
  order_number: string
  order_date: string
  priority: RadiologyPriority
  clinical_indication?: string
  status: RadiologyOrderStatus
  created_by: string
  created_at: string
  updated_at: string
  deleted_at?: string
}

export interface RadiologyOrderItemRow {
  id: string
  radiology_order_id: string
  imaging_test_id: string
  imaging_name: string
  body_part?: string
  contrast_required: boolean
  priority: RadiologyPriority
  status: RadiologyOrderItemStatus
  remarks?: string
  created_at: string
  updated_at: string
}

export interface RadiologyScheduleRow {
  id: string
  radiology_order_item_id: string
  scheduled_date: string
  scheduled_time: string
  room_id?: string
  technician_id?: string
  estimated_duration: number
  status: RadiologyScheduleStatus
  created_at: string
  updated_at: string
}

// ─────────────────────────────────────────────────────────────────────────────
// Payloads
// ─────────────────────────────────────────────────────────────────────────────

export interface CreateRadiologyOrderPayload {
  patient_id: string
  visit_id: string
  appointment_id?: string
  doctor_id: string
  priority: RadiologyPriority
  clinical_indication?: string
  items: {
    imaging_test_id: string
    imaging_name: string
    body_part?: string
    contrast_required?: boolean
    remarks?: string
  }[]
}

export interface ScheduleRadiologyPayload {
  radiology_order_item_id: string
  scheduled_date: string
  scheduled_time: string
  room_id?: string
  technician_id?: string
  estimated_duration?: number
}

// ─────────────────────────────────────────────────────────────────────────────
// Phase 2: Operations Foundation
// ─────────────────────────────────────────────────────────────────────────────

export interface RadiologyEquipmentRow {
  id: string
  clinic_id: string
  equipment_code: string
  equipment_name: string
  modality: string
  manufacturer?: string
  model?: string
  serial_number?: string
  installation_date?: string
  warranty_expiry?: string
  amc_expiry?: string
  calibration_due?: string
  maintenance_due?: string
  status: RadiologyEquipmentStatus
  created_at: string
  updated_at: string
  deleted_at?: string
}

export interface RadiologyTechnicianRow {
  id: string
  clinic_id: string
  employee_id: string
  qualification?: string
  registration_number?: string
  specialization?: string
  assigned_equipment?: any
  shift?: string
  status: string
  created_at: string
  updated_at: string
  deleted_at?: string
  employee?: {
    first_name: string
    last_name: string
    email: string
  }
}

export interface RadiologyQualityControlRow {
  id: string
  clinic_id: string
  equipment_id: string
  qc_date: string
  qc_type: string
  performed_by: string
  result: RadiologyQCResult
  remarks?: string
  status: RadiologyQCStatus
  created_at: string
  equipment?: RadiologyEquipmentRow
  technician?: {
    first_name: string
    last_name: string
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Phase 3: Imaging Workflow & PACS
// ─────────────────────────────────────────────────────────────────────────────

export interface ImagingStudyRow {
  id: string
  clinic_id: string
  patient_id: string
  radiology_order_item_id: string
  study_uid: string
  accession_number: string
  modality: string
  study_description?: string
  performed_date: string
  technician_id?: string
  equipment_id?: string
  study_status: string
  remarks?: string
  created_at: string
  updated_at: string
  deleted_at?: string
  patient?: any // joined field
  order?: any // joined field
  series?: any[] // joined field
  pacs?: any // joined field
}

export interface ImagingSeriesRow {
  id: string
  clinic_id: string
  imaging_study_id: string
  series_uid: string
  series_number: number
  modality?: string
  body_part?: string
  description?: string
  created_at: string
  updated_at: string
  deleted_at?: string
}

export interface ImagingImageRow {
  id: string
  clinic_id: string
  imaging_series_id: string
  image_uid: string
  image_number: number
  storage_path: string
  thumbnail_path?: string
  image_format?: string
  image_size?: number
  uploaded_at: string
  created_at: string
  deleted_at?: string
}

export interface PACSIntegrationRow {
  id: string
  clinic_id: string
  imaging_study_id: string
  pacs_server: string
  dicom_uid: string
  transfer_status: string
  transfer_date?: string
  retry_count: number
  error_log?: string
  created_at: string
  updated_at: string
}

// ─────────────────────────────────────────────────────────────────────────────
// Phase 4: Radiologist Reporting Workflow
// ─────────────────────────────────────────────────────────────────────────────

export interface RadiologyReportRow {
  id: string
  clinic_id: string
  imaging_study_id: string
  radiologist_id: string
  report_number: string
  version_number: number
  status: 'Draft' | 'Verified' | 'Approved'
  verified_date?: string
  approved_date?: string
  digital_signature_id?: string
  pdf_storage_path?: string
  created_at: string
  updated_at: string
  deleted_at?: string
  study?: ImagingStudyRow
  radiologist?: {
    first_name: string
    last_name: string
  }
}

export interface RadiologistFindingRow {
  id: string
  clinic_id: string
  radiology_report_id: string
  clinical_history?: string
  technique?: string
  findings?: string
  impression?: string
  recommendations?: string
  is_critical_finding: boolean
  follow_up_recommendation?: string
  created_at: string
  updated_at: string
  deleted_at?: string
}

export interface ContrastAdministrationRow {
  id: string
  clinic_id: string
  imaging_study_id: string
  contrast_agent: string
  dose: string
  route: string
  administered_by: string
  administration_time: string
  reaction?: string
  remarks?: string
  created_at: string
  updated_at: string
  deleted_at?: string
  administrator?: {
    first_name: string
    last_name: string
  }
}

export interface RadiationDoseRow {
  id: string
  clinic_id: string
  imaging_study_id: string
  equipment_id: string
  dose_value: number
  dose_unit: string
  exposure_time?: number
  operator_id: string
  reference_level?: string
  created_at: string
  updated_at: string
  deleted_at?: string
  equipment?: RadiologyEquipmentRow
  operator?: {
    first_name: string
    last_name: string
  }
}

