// Types that mirror the get_session_context() RPC return shape
export interface SessionContext {
  // User
  id: string
  email: string
  username: string
  mobile: string | null
  status: string
  is_email_verified: boolean
  // Clinic
  clinic_id: string
  clinic_name: string
  clinic_code: string
  logo_url: string | null
  subscription_plan: string
  clinic_city: string | null
  // Role
  role_id: string
  role_name: string
  is_system_role: boolean
  // RBAC
  permissions: string[]        // e.g. ["patients.create", "patients.read"]
  feature_flags: Record<string, boolean>  // e.g. {"sms_notifications": true}
}

export interface AuthState {
  session: SessionContext | null
  loading: boolean
  error: string | null
}
