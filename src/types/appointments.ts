export interface DoctorScheduleRow {
  id: string
  clinic_id: string
  doctor_id: string
  day_of_week: number
  start_time: string
  end_time: string
  slot_duration_minutes: number
  buffer_time_minutes: number
  max_patients: number | null
  is_active: boolean
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
  appointment_date: string
  start_time: string
  end_time: string
  appointment_type: 'Scheduled' | 'Walk-in' | 'Emergency'
  status: 'Scheduled' | 'Checked In' | 'Waiting' | 'In Consultation' | 'Completed' | 'Cancelled' | 'No Show'
  token_number: number | null
  priority: 'Normal' | 'High' | 'Urgent'
  reason_for_visit: string | null
  notes: string | null
  parent_appointment_id: string | null
  created_by: string | null
  created_at: string
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
}
