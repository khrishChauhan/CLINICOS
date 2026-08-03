'use server'

import { createAdminClient } from '@/lib/supabase/server'
import { createClient } from '@/lib/supabase/server'

async function getAuthContext() {
  const supabase = await createClient()
  const adminClient = createAdminClient()
  const { data: { user }, error } = await supabase.auth.getUser()
  if (error || !user) throw new Error('Unauthorized')
  const { data: profile } = await adminClient.from('users').select('clinic_id').eq('id', user.id).single()
  if (!profile?.clinic_id) throw new Error('Clinic context missing')
  return { supabase, adminClient, user, clinicId: profile.clinic_id }
}

export interface PatientSearchResult {
  id: string
  first_name: string
  last_name: string
  uhid: string
  mobile_number: string | null
  date_of_birth: string | null
}

export async function searchPatientsAction(query: string) {
  try {
    const { adminClient, clinicId } = await getAuthContext()

    if (!query || query.trim().length < 2) {
      return { success: true, data: [] as PatientSearchResult[] }
    }

    const q = query.trim().toLowerCase()

    const { data, error } = await adminClient
      .from('patients')
      .select('id, first_name, last_name, uhid, mobile_number, date_of_birth')
      .eq('clinic_id', clinicId)
      .or(`first_name.ilike.%${q}%,last_name.ilike.%${q}%,uhid.ilike.%${q}%,mobile_number.ilike.%${q}%`)
      .order('first_name', { ascending: true })
      .limit(10)

    if (error) throw new Error(error.message)

    return { success: true, data: (data || []) as PatientSearchResult[] }
  } catch (error: any) {
    console.error('searchPatientsAction error:', error)
    return { success: false, error: error.message, data: [] as PatientSearchResult[] }
  }
}
