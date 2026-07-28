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
