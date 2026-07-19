export interface NotificationTemplateRow {
  id: string
  clinic_id: string
  name: string
  content: string
  channel: 'In-App' | 'SMS' | 'Email' | 'WhatsApp'
  event_type: string
  subject: string | null
  is_active: boolean
  created_at: string
}

export interface NotificationRow {
  id: string
  clinic_id: string
  user_id: string
  title: string
  message: string
  type: 'Info' | 'Alert' | 'Success'
  is_read: boolean
  read_at: string | null
  created_at: string
}

export interface CommunicationHistoryRow {
  id: string
  clinic_id: string
  patient_id: string | null
  channel: string
  event_type: string | null
  message_content: string
  status: 'Sent' | 'Failed' | 'Delivered'
  error_message: string | null
  sent_at: string
}
