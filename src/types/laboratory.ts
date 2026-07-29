export interface LabOrderRow {
  id: string
  clinic_id: string
  patient_id: string
  visit_id: string
  appointment_id?: string
  doctor_id: string
  order_number: string
  order_date: string
  priority: 'Routine' | 'Urgent' | 'Stat'
  status: 'Ordered' | 'Collected' | 'Processing' | 'Resulted' | 'Cancelled'
  remarks?: string
  created_by: string
  created_at: string
  updated_at: string
}

export interface LabOrderItemRow {
  id: string
  lab_order_id: string
  test_id: string
  test_name: string
  sample_type?: string
  status: 'Ordered' | 'Collected' | 'Processing' | 'Resulted' | 'Cancelled'
  remarks?: string
}

export interface CreateLabOrderPayload {
  patient_id: string
  visit_id: string
  appointment_id?: string
  doctor_id: string
  priority: 'Routine' | 'Urgent' | 'Stat'
  remarks?: string
  items: {
    test_id: string
    test_name: string
    sample_type?: string
    remarks?: string
  }[]
}

export interface LabSampleRow {
  id: string
  clinic_id: string
  lab_order_item_id: string
  sample_barcode: string
  sample_type?: string
  container_type?: string
  collection_date?: string
  collected_by?: string
  status: 'Pending' | 'Collected' | 'In Transit' | 'Processing' | 'Completed' | 'Rejected'
  created_at: string
  updated_at: string
}

export interface SampleCollectionRow {
  id: string
  sample_id: string
  collector_id: string
  collection_method?: string
  collection_site?: string
  collection_time: string
  remarks?: string
}

export interface SampleTrackingRow {
  id: string
  sample_id: string
  from_location?: string
  to_location?: string
  tracked_by: string
  tracking_time: string
  status?: string
}

export type AbnormalFlag = 'Normal' | 'High' | 'Low' | 'Critical' | 'Abnormal'
export type LabTestStatus = 'Ordered' | 'In Progress' | 'Completed' | 'Verified' | 'Cancelled'
export type LabResultStatus = 'Pending' | 'Entered' | 'Verified' | 'Corrected'

export interface LabTestRow {
  id: string
  clinic_id: string
  lab_order_item_id: string
  test_code?: string
  test_name: string
  department?: string
  instrument?: string
  status: LabTestStatus
  started_at?: string
  completed_at?: string
  created_at: string
  updated_at: string
}

export interface LabResultRow {
  id: string
  clinic_id: string
  lab_test_id: string
  result_value?: string
  unit?: string
  reference_range?: string
  abnormal_flag: AbnormalFlag
  verified_by?: string
  verified_at?: string
  status: LabResultStatus
  remarks?: string
  created_at: string
  updated_at: string
}

export interface LabResultParameterRow {
  id: string
  lab_result_id: string
  parameter_name: string
  parameter_value?: string
  unit?: string
  reference_range?: string
  abnormal_flag: AbnormalFlag
}

export interface CreateLabTestPayload {
  lab_order_item_id: string
  test_name: string
  test_code?: string
  department?: string
  instrument?: string
}

export interface RecordLabResultPayload {
  lab_test_id: string
  result_value?: string
  unit?: string
  reference_range?: string
  remarks?: string
  parameters: {
    parameter_name: string
    parameter_value?: string
    unit?: string
    reference_range?: string
  }[]
}
