'use server'

import { createAdminClient } from '@/lib/supabase/server'
import { createClient } from '@/lib/supabase/server'
import type { DoctorRow } from '@/types/doctors'

async function getAuthContext() {
  const supabase = await createClient()
  const adminClient = createAdminClient()
  const { data: { user }, error } = await supabase.auth.getUser()
  if (error || !user) throw new Error('Unauthorized')
  
  let clinicId: string | null = null
  const { data: profile } = await adminClient.from('users').select('clinic_id').eq('id', user.id).single()
  if (profile?.clinic_id) {
    clinicId = profile.clinic_id
  } else {
    const { data: clinics } = await adminClient.from('clinics').select('id').limit(1)
    if (clinics && clinics.length > 0) {
      clinicId = clinics[0].id
    }
  }

  if (!clinicId) throw new Error('Clinic context missing')
  return { supabase, adminClient, user, clinicId }
}

export interface DoctorForDropdown {
  id: string
  user_id: string
  first_name: string
  last_name: string
  doctor_code: string
  status: string
  experience_years: number | null
}

export async function getDoctorsForClinicAction() {
  try {
    const { adminClient, clinicId } = await getAuthContext()

    const { data, error } = await adminClient
      .schema('doctor')
      .from('doctors')
      .select('id, user_id, first_name, last_name, doctor_code, status, experience_years')
      .eq('clinic_id', clinicId)
      .eq('status', 'Active')
      .order('first_name', { ascending: true })

    if (error) throw new Error(error.message)

    return { success: true, data: (data || []) as DoctorForDropdown[] }
  } catch (error: any) {
    console.error('getDoctorsForClinicAction error:', error)
    return { success: false, error: error.message, data: [] as DoctorForDropdown[] }
  }
}
