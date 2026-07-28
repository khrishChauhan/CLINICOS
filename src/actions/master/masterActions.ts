'use server'

import { createClient } from '@/lib/supabase/server'
import { masterService } from '@/services/master/masterService'

async function getAuthContext() {
  const supabase = await createClient()
  const { data: { user }, error } = await supabase.auth.getUser()
  if (error || !user) throw new Error('Unauthorized')
  return { supabase, user }
}

export async function getMasterDataAction<T>(table: string) {
  try {
    const { supabase } = await getAuthContext()
    const data = await masterService.getAll<T>(supabase, table)
    return { success: true, data }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}

export async function getStatesAction<T>(countryId: string) {
  try {
    const { supabase } = await getAuthContext()
    const data = await masterService.getStatesByCountry<T>(supabase, countryId)
    return { success: true, data }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}

export async function getDistrictsAction<T>(stateId: string) {
  try {
    const { supabase } = await getAuthContext()
    const data = await masterService.getDistrictsByState<T>(supabase, stateId)
    return { success: true, data }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}

export async function getCitiesAction<T>(districtId: string) {
  try {
    const { supabase } = await getAuthContext()
    const data = await masterService.getCitiesByDistrict<T>(supabase, districtId)
    return { success: true, data }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}

export async function createMasterRecordAction<T>(table: string, payload: Partial<T>) {
  try {
    const { supabase } = await getAuthContext()
    // In a real app, you would check if user is Super Admin here
    const data = await masterService.create<T>(supabase, table, payload)
    return { success: true, data }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}

export async function updateMasterRecordAction<T>(table: string, id: string, payload: Partial<T>) {
  try {
    const { supabase } = await getAuthContext()
    const data = await masterService.update<T>(supabase, table, id, payload)
    return { success: true, data }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}

export async function deleteMasterRecordAction(table: string, id: string) {
  try {
    const { supabase } = await getAuthContext()
    await masterService.delete(supabase, table, id)
    return { success: true }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}
