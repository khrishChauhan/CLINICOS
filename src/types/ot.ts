export type OTRoomStatus = 'Active' | 'Maintenance' | 'Inactive'
export type SurgeryStatus = 'Scheduled' | 'Pre-Op' | 'Intra-Op' | 'Post-Op' | 'Completed' | 'Cancelled'

export interface OTRoom {
  id: string
  clinic_id: string
  name: string
  type: string
  status: OTRoomStatus
  base_price_per_hour: number
}

export interface Surgery {
  id: string
  clinic_id: string
  patient_id: string
  room_id: string
  admission_id?: string
  lead_surgeon_id: string
  anesthetist_id?: string
  procedure_name: string
  diagnosis?: string
  status: SurgeryStatus
  scheduled_start_time: string
  scheduled_end_time: string
  actual_start_time?: string
  actual_end_time?: string
  is_emergency: boolean
  cancellation_reason?: string
  
  // Relations
  patient?: any
  room?: OTRoom
  lead_surgeon?: any
  anesthetist?: any
  team_members?: OTTeamMember[]
  checklists?: OTChecklist
}

export interface OTTeamMember {
  id: string
  surgery_id: string
  user_id: string
  role: string
  user?: any
}

export interface OTChecklist {
  id: string
  surgery_id: string
  identity_verified: boolean
  consent_signed: boolean
  site_marked: boolean
  fasting_confirmed: boolean
  allergies_checked: boolean
  blood_arranged: boolean
  verified_by?: string
  verified_at?: string
  remarks?: string
}

export interface OTNote {
  id: string
  surgery_id: string
  note_type: 'Pre-Op' | 'Intra-Op' | 'Post-Op' | 'Anesthesia'
  content: string
  recorded_by: string
  recorded_at: string
  recorder?: any
}

export interface OTConsumable {
  id: string
  surgery_id: string
  medicine_id: string
  quantity: number
  batch_number?: string
  inventory_transaction_id?: string
  recorded_by: string
  recorded_at: string
  is_billed: boolean
  medicine?: any
}
