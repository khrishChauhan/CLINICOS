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

export interface TokenRow {
  id: string
  clinic_id: string
  token_number: string
  appointment_id: string | null
  doctor_id: string | null
  generated_time: string
  display_number: string | null
  token_status: 'Waiting' | 'Called' | 'In Consultation' | 'Completed' | 'Skipped' | 'Cancelled'
  served_time: string | null
  remarks: string | null
  created_at: string
  updated_at: string
}

export interface AppointmentQueueRow {
  id: string
  clinic_id: string
  appointment_id: string
  doctor_id: string | null
  queue_number: number | null
  current_position: number | null
  estimated_wait_time: number | null
  queue_status: 'Waiting' | 'Called' | 'In Consultation' | 'Completed' | 'Skipped' | 'Cancelled'
  called_at: string | null
  completed_at: string | null
  skipped_at: string | null
  created_at: string
  updated_at: string
}

export interface WalkInRegistrationRow {
  id: string
  clinic_id: string
  patient_id: string | null
  doctor_id: string | null
  arrival_time: string
  token_number: string | null
  priority: 'Normal' | 'Emergency' | 'VIP'
  reason: string | null
  status: string
  created_by: string | null
  created_at: string
  updated_at: string
}

export interface QueueDisplayRow {
  id: string
  clinic_id: string
  doctor_id: string
  token_number: string | null
  current_status: string
  display_order: number | null
  estimated_wait: number | null
  last_updated: string
  created_at: string
  updated_at: string
}

export interface AppointmentStatusHistoryRow {
  id: string
  clinic_id: string
  appointment_id: string
  previous_status: string | null
  current_status: string
  changed_by: string | null
  remarks: string | null
  changed_at: string
}

export interface AppointmentCancellationRow {
  id: string
  clinic_id: string
  appointment_id: string
  cancelled_by: string | null
  cancellation_reason: string
  refund_required: boolean | null
  refund_status: string | null
  cancelled_at: string
  remarks: string | null
}

export interface AppointmentRescheduleRow {
  id: string
  clinic_id: string
  appointment_id: string
  old_date: string | null
  old_time: string | null
  new_date: string
  new_time: string
  rescheduled_by: string | null
  reason: string | null
  rescheduled_at: string
}

export interface FollowUpAppointmentRow {
  id: string
  clinic_id: string
  parent_appointment_id: string
  patient_id: string
  doctor_id: string | null
  followup_date: string
  followup_reason: string | null
  reminder_sent: boolean | null
  status: string
  created_at: string
}

export interface CalendarEventRow {
  id: string
  clinic_id: string
  doctor_id: string
  event_title: string
  event_type: string
  start_datetime: string
  end_datetime: string
  description: string | null
  status: string
  created_at: string
}

export interface AppointmentReminderRow {
  id: string
  clinic_id: string
  appointment_id: string
  reminder_type: string
  reminder_channel: string
  scheduled_time: string
  sent_time: string | null
  delivery_status: string
  retry_count: number
  remarks: string | null
  created_at: string
  updated_at: string
}

export interface AppointmentNotificationRow {
  id: string
  clinic_id: string
  appointment_id: string
  notification_type: string
  channel: string
  recipient: string
  notification_status: string
  sent_at: string | null
  delivered_at: string | null
  remarks: string | null
  created_at: string
  updated_at: string
}

export interface OnlineAppointmentRow {
  id: string
  clinic_id: string
  appointment_id: string
  booking_platform: string
  booking_reference: string | null
  patient_message: string | null
  confirmation_status: string
  confirmed_at: string | null
  remarks: string | null
  created_at: string
  updated_at: string
}

export interface AppointmentDocumentRow {
  id: string
  clinic_id: string
  appointment_id: string
  attachment_id: string
  document_type: string
  remarks: string | null
  uploaded_at: string
}

export interface AppointmentFeedbackRow {
  id: string
  clinic_id: string
  appointment_id: string
  overall_rating: number
  waiting_time_rating: number | null
  doctor_experience_rating: number | null
  staff_rating: number | null
  cleanliness_rating: number | null
  comments: string | null
  submitted_at: string
  created_at: string
}

export interface AppointmentAuditRow {
  id: string
  clinic_id: string
  appointment_id: string
  action: string
  performed_by: string | null
  previous_value: Record<string, any> | null
  new_value: Record<string, any> | null
  ip_address: string | null
  metadata: Record<string, any> | null
  timestamp: string
  created_at: string
}
