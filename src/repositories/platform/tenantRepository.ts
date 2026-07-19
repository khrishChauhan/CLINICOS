import type { SupabaseClient } from '@supabase/supabase-js'
import type { ClinicTenant, SubscriptionPlan, ProvisionPayload } from '@/types/platform'

export async function getAllClinics(supabase: SupabaseClient) {
  const { data, error } = await supabase
    .from('clinics')
    .select('id, clinic_name, clinic_code, email, mobile, city, subscription_plan, subscription_status, clinic_status, max_users, created_at, subscriptions(status, trial_end_date, plan_id)')
    .eq('is_deleted', false)
    .order('created_at', { ascending: false })

  if (error) throw new Error(`Failed to fetch clinics: ${error.message}`)
  return data as ClinicTenant[]
}

export async function getClinicById(supabase: SupabaseClient, clinicId: string) {
  const { data, error } = await supabase
    .from('clinics')
    .select('*, subscriptions(*, subscription_plans(*))')
    .eq('id', clinicId)
    .single()

  if (error) throw new Error(`Failed to fetch clinic: ${error.message}`)
  return data
}

export async function getSubscriptionPlans(supabase: SupabaseClient) {
  const { data, error } = await supabase
    .from('subscription_plans')
    .select('*').limit(100)
    .eq('is_active', true)
    .order('monthly_price', { ascending: true })

  if (error) throw new Error(`Failed to fetch plans: ${error.message}`)
  return data as SubscriptionPlan[]
}

export async function getPlatformKPIs(supabase: SupabaseClient) {
  const [clinicsRes, subscriptionsRes] = await Promise.all([
    supabase.from('clinics').select('id, clinic_status', { count: 'exact' }).eq('is_deleted', false),
    supabase.from('subscriptions').select('status', { count: 'exact' })
  ])

  const totalClinics = clinicsRes.count || 0
  const activeClinics = clinicsRes.data?.filter(c => c.clinic_status === 'Active').length || 0
  const activeSubscriptions = subscriptionsRes.data?.filter(s => s.status === 'Active').length || 0
  const trialSubscriptions = subscriptionsRes.data?.filter(s => s.status === 'Trial').length || 0

  return { totalClinics, activeClinics, activeSubscriptions, trialSubscriptions }
}

export async function updateClinicStatus(supabase: SupabaseClient, clinicId: string, status: string) {
  const { error } = await supabase
    .from('clinics')
    .update({ clinic_status: status })
    .eq('id', clinicId)

  if (error) throw new Error(`Failed to update clinic status: ${error.message}`)
}

export async function provisionClinic(supabase: SupabaseClient, payload: ProvisionPayload) {
  const { data, error } = await supabase.rpc('provision_new_clinic', {
    p_clinic_name: payload.clinicName,
    p_clinic_code: payload.clinicCode,
    p_email: payload.email,
    p_mobile: payload.mobile,
    p_city: payload.city,
    p_plan_code: payload.planCode,
    p_admin_email: payload.adminEmail,
    p_admin_first_name: payload.adminFirstName,
    p_admin_last_name: payload.adminLastName,
  })

  if (error) throw new Error(`Provisioning failed: ${error.message}`)
  return data as { clinic_id: string; user_id: string; subscription_id: string; trial_end: string }
}
