'use server'

import { createClient } from '@/lib/supabase/server'

export type DuplicateCheckResult =
  | { ok: true; duplicates: Array<{ id: string; uhid: string; fullName: string; mobile_number: string }> }
  | { ok: false; error: string }

/**
 * Server Action: Check for duplicate patients by mobile or aadhaar
 * Returns soft-warning data — caller decides whether to block or warn
 */
export async function checkPatientDuplicates(
  mobile: string,
  aadhaar?: string
): Promise<DuplicateCheckResult> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { ok: false, error: 'UNAUTHENTICATED' }

  let query = supabase
    .from('patients')
    .select('id, uhid, first_name, last_name, mobile_number')
    .eq('is_deleted', false)

  if (mobile && aadhaar) {
    query = query.or(`mobile_number.eq.${mobile},aadhaar_number.eq.${aadhaar}`)
  } else if (mobile) {
    query = query.eq('mobile_number', mobile)
  } else if (aadhaar) {
    query = query.eq('aadhaar_number', aadhaar)
  } else {
    return { ok: true, duplicates: [] }
  }

  const { data, error } = await query.limit(5)
  if (error) return { ok: false, error: error.message }

  return {
    ok: true,
    duplicates: (data ?? []).map(p => ({
      id: p.id,
      uhid: p.uhid,
      fullName: [p.first_name, p.last_name].filter(Boolean).join(' '),
      mobile_number: p.mobile_number,
    })),
  }
}
