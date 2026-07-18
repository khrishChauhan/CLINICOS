'use server'

import { createClient } from '@/lib/supabase/server'
import { getServices, addService } from '@/repositories/billing/catalogRepository'
import { revalidatePath } from 'next/cache'

export async function fetchServicesAction() {
  try {
    const supabase = await createClient()
    const { data: session } = await supabase.rpc('get_session_context')
    if (!session) throw new Error('Unauthorized')

    const data = await getServices(supabase, session.clinic_id)
    return { ok: true, data }
  } catch (error: any) {
    return { ok: false, error: error.message }
  }
}

export async function createServiceAction(name: string, basePrice: number, taxRate: number) {
  try {
    const supabase = await createClient()
    const { data: session } = await supabase.rpc('get_session_context')
    if (!session) throw new Error('Unauthorized')

    await addService(supabase, {
      clinic_id: session.clinic_id,
      category_id: null,
      name,
      base_price: basePrice,
      tax_rate: taxRate,
      is_active: true
    })
    
    revalidatePath('/settings/catalog')
    return { ok: true }
  } catch (error: any) {
    return { ok: false, error: error.message }
  }
}
