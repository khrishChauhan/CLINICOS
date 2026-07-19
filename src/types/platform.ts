export interface SubscriptionPlan {
  id: string
  plan_name: string
  plan_code: string
  monthly_price: number
  annual_price: number
  max_users: number
  max_branches: number
  max_storage_gb: number
  features: string[]
  is_active: boolean
}

export interface ClinicTenant {
  id: string
  clinic_name: string
  clinic_code: string
  email: string
  mobile: string
  city: string
  subscription_plan: string
  subscription_status: string
  clinic_status: string
  max_users: number
  created_at: string
  subscription?: { status: string; trial_end_date: string | null; plan_id: string }
}

export interface PlatformAuditLog {
  id: string
  actor_user_id: string
  action: string
  target_type: string | null
  target_id: string | null
  metadata: Record<string, any>
  ip_address: string | null
  created_at: string
  users?: { first_name: string; last_name: string; email: string }
}

export interface ProvisionPayload {
  clinicName: string
  clinicCode: string
  email: string
  mobile: string
  city: string
  planCode: string
  adminEmail: string
  adminFirstName: string
  adminLastName: string
}
