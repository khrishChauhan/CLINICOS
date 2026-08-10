'use server'

import { createClient } from '@/lib/supabase/server'
import { OTRepository } from '@/repositories/ot/otRepository'
import { SurgeryService } from '@/services/ot/surgeryService'
import { revalidatePath } from 'next/cache'

async function getSessionContext() {
  const supabase = await createClient()
  const { data, error } = await supabase.rpc('get_session_context')
  if (!error && data?.length > 0) return data[0]

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')
  
  const { data: userData } = await supabase.from('users').select('clinic_id').eq('id', user.id).single()
  if (!userData?.clinic_id) throw new Error('Clinic context not found')
  
  return { clinic_id: userData.clinic_id, user_id: user.id }
}

export async function fetchOTRoomsAction() {
  try {
    await getSessionContext()
    const supabase = await createClient()
    const repo = new OTRepository(supabase)
    const { data, error } = await repo.getRooms()
    if (error) throw error
    return { ok: true, data }
  } catch (error: any) {
    return { ok: false, error: error.message }
  }
}

export async function fetchSurgeriesAction(date?: string) {
  try {
    await getSessionContext()
    const supabase = await createClient()
    const repo = new OTRepository(supabase)
    const { data, error } = await repo.getSurgeries(date)
    if (error) throw error
    return { ok: true, data }
  } catch (error: any) {
    return { ok: false, error: error.message }
  }
}

export async function scheduleSurgeryAction(payload: any) {
  try {
    const ctx = await getSessionContext()
    const supabase = await createClient()
    const repo = new OTRepository(supabase)
    
    const { data, error } = await repo.scheduleSurgery({
      ...payload,
      clinic_id: ctx.clinic_id,
      created_by: ctx.user_id,
      status: 'Scheduled'
    })
    
    if (error) throw error
    
    // Create an empty checklist for the surgery automatically
    await repo.upsertChecklist({ surgery_id: data.id })
    
    revalidatePath('/operation-theatre/dashboard')
    return { ok: true, data }
  } catch (error: any) {
    return { ok: false, error: error.message }
  }
}

export async function verifyChecklistAction(surgeryId: string, checklist: any) {
  try {
    const ctx = await getSessionContext()
    const supabase = await createClient()
    const repo = new OTRepository(supabase)
    
    const { data, error } = await repo.upsertChecklist({
      surgery_id: surgeryId,
      ...checklist,
      verified_by: ctx.user_id,
      verified_at: new Date().toISOString()
    })
    
    if (error) throw error
    revalidatePath('/operation-theatre/dashboard')
    return { ok: true, data }
  } catch (error: any) {
    return { ok: false, error: error.message }
  }
}

export async function transitionSurgeryStatusAction(surgeryId: string, newStatus: string) {
  try {
    await getSessionContext()
    const service = await SurgeryService.create()
    
    if (newStatus === 'Pre-Op') {
      await service.transitionToPreOp(surgeryId)
    } else if (newStatus === 'Intra-Op') {
      await service.transitionToIntraOp(surgeryId)
    } else if (newStatus === 'Post-Op') {
      await service.transitionToPostOp(surgeryId)
    } else if (newStatus === 'Completed') {
      await service.completeSurgery(surgeryId)
    } else {
      throw new Error(`Unsupported status transition: ${newStatus}`)
    }
    
    revalidatePath('/operation-theatre/dashboard')
    return { ok: true }
  } catch (error: any) {
    return { ok: false, error: error.message }
  }
}

export async function addSurgeryNoteAction(surgeryId: string, noteType: any, content: string) {
  try {
    const ctx = await getSessionContext()
    const supabase = await createClient()
    const repo = new OTRepository(supabase)
    
    const { data, error } = await repo.addNote({
      surgery_id: surgeryId,
      note_type: noteType,
      content,
      recorded_by: ctx.user_id
    })
    
    if (error) throw error
    revalidatePath('/operation-theatre/dashboard')
    return { ok: true, data }
  } catch (error: any) {
    return { ok: false, error: error.message }
  }
}

export async function logConsumableAction(surgeryId: string, medicineId: string, quantity: number, batchNumber: string) {
  try {
    const ctx = await getSessionContext()
    const service = await SurgeryService.create()
    const data = await service.addConsumableAndDeductInventory(surgeryId, medicineId, quantity, batchNumber, ctx.user_id)
    revalidatePath('/operation-theatre/dashboard')
    return { ok: true, data }
  } catch (error: any) {
    return { ok: false, error: error.message }
  }
}
