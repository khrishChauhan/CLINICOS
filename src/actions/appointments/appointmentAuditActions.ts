'use server'

import { createClient } from '@/lib/supabase/server'
import { appointmentAuditService } from '@/services/appointments/appointmentAuditService'

export async function getAppointmentAuditAction(appointmentId: string) {
  try {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) throw new Error('Unauthorized')

    // Basic RBAC check: only admins or specific roles should view full audit logs.
    const { data: profile } = await supabase.from('users').select('role').eq('id', user.id).single()
    if (profile?.role === 'patient') throw new Error('Unauthorized')

    const data = await appointmentAuditService.getAuditLogs(supabase, appointmentId)
    return { success: true, data }
  } catch (error: any) {
    return { success: false, error: error.message || 'Failed to fetch audit logs' }
  }
}
