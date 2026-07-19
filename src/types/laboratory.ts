export type LabOrderStatus = 'Ordered' | 'Sample Collected' | 'Processing' | 'Result Ready' | 'Verified'

export interface LabTestCategoryRow {
  id: string
  clinic_id: string
  name: string
  description: string | null
  created_at: string
}

export interface LabTestRow {
  id: string
  clinic_id: string
  category_id: string | null
  name: string
  code: string | null
  specimen_type: string | null
  unit: string | null
  result_type: 'numeric' | 'qualitative' | 'text'
  price: number
  is_active: boolean
  created_at: string
}

export interface ReferenceRangeRow {
  id: string
  lab_test_id: string
  gender: 'Male' | 'Female' | 'All'
  min_age: number
  max_age: number
  min_value: number | null
  max_value: number | null
  critical_min: number | null
  critical_max: number | null
  qualitative_normal: string | null
  created_at: string
}

export interface LabOrderRow {
  id: string
  clinic_id: string
  patient_id: string
  consultation_id: string | null
  investigation_order_id: string | null
  order_number: string
  status: LabOrderStatus
  priority: 'Routine' | 'Urgent' | 'STAT'
  ordered_by: string | null
  verified_by: string | null
  verified_at: string | null
  notes: string | null
  created_at: string
  updated_at: string
}

export interface LabOrderItemRow {
  id: string
  lab_order_id: string
  lab_test_id: string
  status: LabOrderStatus
  created_at: string
}

export interface LabSampleRow {
  id: string
  lab_order_id: string
  barcode: string
  specimen_type: string | null
  collected_by: string | null
  collected_at: string | null
  notes: string | null
  created_at: string
}

export interface LabResultRow {
  id: string
  lab_order_id: string
  entered_by: string | null
  entered_at: string
  is_verified: boolean
  remarks: string | null
}

export interface LabResultValueRow {
  id: string
  lab_result_id: string
  lab_order_item_id: string
  lab_test_id: string
  value_numeric: number | null
  value_text: string | null
  is_abnormal: boolean
  is_critical: boolean
  created_at: string
}

export interface LabStatusLogRow {
  id: string
  lab_order_id: string
  status_from: LabOrderStatus | null
  status_to: LabOrderStatus
  changed_by: string | null
  remarks: string | null
  created_at: string
}
