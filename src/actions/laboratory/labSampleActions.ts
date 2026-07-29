'use server'

import { createClient } from '@/lib/supabase/server'
import { labSampleService } from '@/services/laboratory/labSampleService'
import { revalidatePath } from 'next/cache'

export async function getSamplesAction() {
  try {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) throw new Error('Unauthorized')

    const { data: profile } = await supabase
      .from('users')
      .select('clinic_id')
      .eq('id', user.id)
      .single()

    if (!profile?.clinic_id) throw new Error('Clinic ID not found')

    const data = await labSampleService.getSamples(supabase, profile.clinic_id)
    return { success: true, data }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}

export async function createSampleAction(labOrderItemId: string, sampleType?: string, containerType?: string) {
  try {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) throw new Error('Unauthorized')

    const { data: profile } = await supabase
      .from('users')
      .select('clinic_id')
      .eq('id', user.id)
      .single()

    if (!profile?.clinic_id) throw new Error('Clinic ID not found')

    const data = await labSampleService.createSample(supabase, profile.clinic_id, labOrderItemId, sampleType, containerType)
    revalidatePath('/laboratory/samples')
    return { success: true, data }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}

export async function collectSampleAction(
  sampleId: string, 
  collectionSite: string, 
  collectionMethod: string, 
  remarks?: string
) {
  try {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) throw new Error('Unauthorized')

    const { data: profile } = await supabase
      .from('users')
      .select('clinic_id')
      .eq('id', user.id)
      .single()

    if (!profile?.clinic_id) throw new Error('Clinic ID not found')

    const data = await labSampleService.collectSample(
      supabase,
      profile.clinic_id,
      sampleId,
      user.id, // collector is the logged in user
      collectionSite,
      collectionMethod,
      remarks
    )
    revalidatePath('/laboratory/samples')
    revalidatePath(`/laboratory/samples/${sampleId}`)
    return { success: true, data }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}

export async function trackSampleAction(
  sampleId: string,
  fromLocation: string,
  toLocation: string,
  status: 'In Transit' | 'Processing' | 'Completed' | 'Rejected'
) {
  try {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) throw new Error('Unauthorized')

    const { data: profile } = await supabase
      .from('users')
      .select('clinic_id')
      .eq('id', user.id)
      .single()

    if (!profile?.clinic_id) throw new Error('Clinic ID not found')

    const data = await labSampleService.trackSample(
      supabase,
      profile.clinic_id,
      sampleId,
      user.id,
      fromLocation,
      toLocation,
      status
    )
    revalidatePath('/laboratory/samples')
    revalidatePath(`/laboratory/samples/${sampleId}`)
    return { success: true, data }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}
