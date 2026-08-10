export type WardType = 'General' | 'ICU' | 'Private' | 'Semi-Private' | 'Maternity' | 'Pediatric'

export interface Ward {
  id: string
  clinic_id: string
  name: string
  type: WardType
  capacity: number
  floor?: string
  is_active: boolean
}

export type BedStatus = 'Available' | 'Occupied' | 'Cleaning' | 'Maintenance'

export interface Bed {
  id: string
  ward_id: string
  bed_number: string
  status: BedStatus
  base_price_per_day: number
  is_active: boolean
}

export type AdmissionStatus = 'Requested' | 'Pending Bed Assignment' | 'Admitted' | 'Discharge Requested' | 'Billing Pending' | 'Discharged'

export interface Admission {
  id: string
  patient_id: string
  clinic_id: string
  admitting_doctor_id: string
  visit_id?: string
  status: AdmissionStatus
  admission_date: string
  expected_discharge_date?: string
  actual_discharge_date?: string
  reason_for_admission?: string
  created_by?: string
  
  // Relations
  patient?: any
  doctor?: any
}

export interface BedAllocation {
  id: string
  admission_id: string
  bed_id: string
  start_time: string
  end_time?: string
  assigned_by?: string
  
  // Relations
  bed?: Bed
  ward?: Ward
}

export interface NursingVital {
  id: string
  admission_id: string
  recorded_by: string
  timestamp: string
  heart_rate?: number
  blood_pressure_systolic?: number
  blood_pressure_diastolic?: number
  temperature_celsius?: number
  spo2?: number
  respiratory_rate?: number
  remarks?: string
}

export type MedAdminStatus = 'Prescribed' | 'Dispensed' | 'Administered' | 'Skipped' | 'Refused'

export interface MedicationAdministration {
  id: string
  admission_id: string
  medicine_id: string
  prescription_item_id?: string
  dispense_item_id?: string
  scheduled_time?: string
  administered_time?: string
  administered_by?: string
  status: MedAdminStatus
  dose?: string
  route?: string
  remarks?: string
  
  // Relations
  medicine?: any
}
