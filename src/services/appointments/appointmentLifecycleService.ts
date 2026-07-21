import type { SupabaseClient } from '@supabase/supabase-js'
import { appointmentHistoryRepository } from '@/repositories/appointments/appointmentHistoryRepository'

export const appointmentLifecycleService = {
  /**
   * Universal method to update appointment status and log history.
   * This should be called instead of raw updateAppointmentStatus.
   */
  async changeStatus(
    supabase: SupabaseClient,
    appointmentId: string,
    clinicId: string,
    newStatus: string,
    userId: string,
    remarks?: string
  ) {
    // 1. Get current status
    const { data: apt, error: fetchErr } = await supabase
      .from('appointments')
      .select('status')
      .eq('id', appointmentId)
      .single()

    if (fetchErr) throw fetchErr

    const previousStatus = apt.status

    if (previousStatus === newStatus) {
      return // No change needed
    }

    // 2. Update status
    const { data: updatedApt, error: updateErr } = await supabase
      .from('appointments')
      .update({ status: newStatus, updated_at: new Date().toISOString() })
      .eq('id', appointmentId)
      .select()
      .single()

    if (updateErr) throw updateErr

    // 3. Log History
    await appointmentHistoryRepository.createHistoryRecord(supabase, {
      clinic_id: clinicId,
      appointment_id: appointmentId,
      previous_status: previousStatus,
      current_status: newStatus,
      changed_by: userId,
      remarks: remarks || null
    })

    // 4. Dispatch Notification based on status
    let eventType = null
    switch (newStatus) {
      case 'Confirmed': eventType = 'Appointment Confirmed'; break;
      case 'Cancelled': eventType = 'Appointment Cancelled'; break;
      case 'Rescheduled': eventType = 'Appointment Rescheduled'; break;
      case 'Checked In': eventType = 'Queue Called'; break;
      case 'In Consultation': eventType = 'Consultation Started'; break;
      case 'Completed': eventType = 'Consultation Completed'; break;
    }

    if (eventType) {
      try {
        // Safe-call: if patient/userId missing, it skips or fails gracefully in Notification Center
        const { appointmentNotificationService } = await import('@/services/appointments/appointmentNotificationService')
        
        await appointmentNotificationService.dispatchAppointmentNotification(
          supabase,
          clinicId,
          appointmentId,
          eventType,
          ['In-App'], // Defaulting to In-App for lifecycle events; other channels can be configured per clinic
          userId,
          { userId },
          { appointmentId, previousStatus, newStatus },
          remarks
        )
      } catch (err: any) {
        console.error('Failed to dispatch lifecycle notification:', err.message)
      }
    }

    return updatedApt
  }
}
