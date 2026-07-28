'use server'

import { createClient } from '@/lib/supabase/server'
import { procedureService } from '@/services/emr/procedureService'
import type { ProcedureRow, ProcedureStatus } from '@/types/emr'

async function getAuthContext() {
  const supabase = await createClient()
  const { data: { user }, error } = await supabase.auth.getUser()
  if (error || !user) throw new Error('Unauthorized')
  const { data: profile } = await supabase.from('users').select('clinic_id').eq('id', user.id).single()
  if (!profile?.clinic_id) throw new Error('Clinic context missing')
  return { supabase, user, clinicId: profile.clinic_id }
}

export async function getProceduresAction(visitId: string) {
  try {
    const { supabase } = await getAuthContext()
    const data = await procedureService.getAll(supabase, visitId)
    return { success: true, data }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}

export async function addProcedureAction(
  visitId: string,
  payload: {
    procedure_name: string
    procedure_code?: string
    procedure_date?: string
    remarks?: string
    status?: ProcedureStatus
    master_procedure_id?: string
  }
) {
  try {
    const { supabase, user, clinicId } = await getAuthContext()
    const data = await procedureService.add(supabase, clinicId, visitId, {
      ...payload,
      performed_by: user.id
    })
    return { success: true, data }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}

export async function updateProcedureAction(id: string, updates: Partial<ProcedureRow>) {
  try {
    const { supabase } = await getAuthContext()
    const data = await procedureService.update(supabase, id, updates)
    return { success: true, data }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}

export async function deleteProcedureAction(id: string) {
  try {
    const { supabase } = await getAuthContext()
    await procedureService.remove(supabase, id)
    return { success: true }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}
