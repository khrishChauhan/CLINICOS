export interface DoctorAvailabilityRow {
  id: string
  doctor_id: string
  clinic_id: string
  available_from: string
  available_to: string
  available_days: number[]
  consultation_mode: string
  appointment_limit: number | null
  break_start: string | null
  break_end: string | null
  status: string
  created_at: string
  updated_at: string
}

export interface AppointmentSlotRow {
  id: string
  clinic_id: string
  doctor_id: string
  branch_id: string | null
  day_of_week: number
  slot_start_time: string
  slot_end_time: string
  slot_duration: number
  maximum_patients: number
  booking_window: number | null
  status: string
  created_at: string
  updated_at: string
}

export interface DoctorLeaveRow {
  id: string
  clinic_id: string
  doctor_id: string
  start_date: string
  end_date: string
  reason: string | null
  status: 'Approved' | 'Pending'
}

export interface AppointmentRow {
  id: string
  clinic_id: string
  patient_id: string
  doctor_id: string
  branch_id: string | null
  department_id: string | null
  appointment_number: string | null
  appointment_source: string
  appointment_date: string
  appointment_start_time: string
  appointment_end_time: string
  slot_id: string | null
  token_id: string | null
  consultation_type: string | null
  priority: string | null
  visit_type: string | null
  referred_by: string | null
  reason_for_visit: string | null
  notes: string | null
  status: string
  checked_in_at: string | null
  consultation_started_at: string | null
  consultation_completed_at: string | null
  cancelled_at: string | null
  cancelled_by: string | null
  cancellation_reason: string | null
  booked_by: string | null
  created_at: string
  updated_at: string
}

export interface TimeSlot {
  startTime: string
  endTime: string
  isAvailable: boolean
  reason?: 'Leave' | 'Booked' | 'Outside Hours'
}

export interface BookAppointmentPayload {
  patientId: string
  doctorId: string
  date: string
  startTime: string
  endTime: string
  type: 'Scheduled' | 'Walk-in' | 'Emergency'
  priority: 'Normal' | 'High' | 'Urgent'
  reasonForVisit?: string
  visitType?: string
  consultationType?: string
  appointmentSource?: string
}
