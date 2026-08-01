'use server'

import { createClient } from '@/lib/supabase/server'
import { radiologyEquipmentService } from '@/services/radiology/radiologyEquipmentService'
import { radiologyTechnicianService } from '@/services/radiology/radiologyTechnicianService'
import { radiologyQualityControlService } from '@/services/radiology/radiologyQualityControlService'
import { revalidatePath } from 'next/cache'
import type { 
  RadiologyEquipmentRow, 
  RadiologyTechnicianRow, 
  RadiologyQualityControlRow 
} from '@/types/radiology'

async function getAuthContext() {
  const supabase = await createClient()
  const { data: { user }, error } = await supabase.auth.getUser()
  if (error || !user) throw new Error('Unauthorized')
  const { data: profile } = await supabase.from('users').select('clinic_id').eq('id', user.id).single()
  if (!profile?.clinic_id) throw new Error('Clinic not found')
  return { supabase, user, clinicId: profile.clinic_id }
}

// ─────────────────────────────────────────────────────────────────────────────
// Equipment Actions
// ─────────────────────────────────────────────────────────────────────────────
export async function getRadiologyEquipmentAction() {
  try {
    const { supabase, clinicId } = await getAuthContext()
    const data = await radiologyEquipmentService.getEquipment(supabase, clinicId)
    return { success: true, data }
  } catch (e: any) { return { success: false, error: e.message } }
}

export async function createEquipmentAction(payload: Omit<RadiologyEquipmentRow, 'id' | 'clinic_id' | 'created_at' | 'updated_at' | 'deleted_at'>) {
  try {
    const { supabase, clinicId } = await getAuthContext()
    const data = await radiologyEquipmentService.createEquipment(supabase, clinicId, payload)
    revalidatePath('/radiology/equipment')
    return { success: true, data }
  } catch (e: any) { return { success: false, error: e.message } }
}

export async function updateEquipmentAction(equipmentId: string, payload: Partial<RadiologyEquipmentRow>) {
  try {
    const { supabase, clinicId } = await getAuthContext()
    const data = await radiologyEquipmentService.updateEquipment(supabase, clinicId, equipmentId, payload)
    revalidatePath('/radiology/equipment')
    return { success: true, data }
  } catch (e: any) { return { success: false, error: e.message } }
}

// ─────────────────────────────────────────────────────────────────────────────
// Technician Actions
// ─────────────────────────────────────────────────────────────────────────────
export async function getRadiologyTechniciansAction() {
  try {
    const { supabase, clinicId } = await getAuthContext()
    const data = await radiologyTechnicianService.getTechnicians(supabase, clinicId)
    return { success: true, data }
  } catch (e: any) { return { success: false, error: e.message } }
}

export async function registerTechnicianAction(payload: Omit<RadiologyTechnicianRow, 'id' | 'clinic_id' | 'created_at' | 'updated_at' | 'deleted_at' | 'employee'>) {
  try {
    const { supabase, clinicId } = await getAuthContext()
    const data = await radiologyTechnicianService.registerTechnician(supabase, clinicId, payload)
    revalidatePath('/radiology/technicians')
    return { success: true, data }
  } catch (e: any) { return { success: false, error: e.message } }
}

// ─────────────────────────────────────────────────────────────────────────────
// Quality Control Actions
// ─────────────────────────────────────────────────────────────────────────────
export async function getRadiologyQCAction() {
  try {
    const { supabase, clinicId } = await getAuthContext()
    const data = await radiologyQualityControlService.getQualityControls(supabase, clinicId)
    return { success: true, data }
  } catch (e: any) { return { success: false, error: e.message } }
}

export async function recordQualityControlAction(payload: Omit<RadiologyQualityControlRow, 'id' | 'clinic_id' | 'created_at' | 'equipment' | 'technician'>) {
  try {
    const { supabase, clinicId } = await getAuthContext()
    const data = await radiologyQualityControlService.recordQualityControl(supabase, clinicId, payload)
    revalidatePath('/radiology/qc')
    revalidatePath('/radiology/equipment') // Refresh equipment in case calibration dates updated
    return { success: true, data }
  } catch (e: any) { return { success: false, error: e.message } }
}
