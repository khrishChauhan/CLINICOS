export type RadiologyOrderStatus = 'Ordered' | 'Scheduled' | 'Completed' | 'Cancelled'
export type RadiologyOrderItemStatus = 'Ordered' | 'Scheduled' | 'Completed' | 'Cancelled'
export type RadiologyScheduleStatus = 'Scheduled' | 'Completed' | 'Cancelled' | 'No Show'
export type RadiologyPriority = 'Routine' | 'Urgent' | 'Stat'

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
