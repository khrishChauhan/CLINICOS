import type { SupabaseClient } from '@supabase/supabase-js'
import { appointmentCancellationRepository } from '@/repositories/appointments/appointmentCancellationRepository'
import { appointmentLifecycleService } from './appointmentLifecycleService'
import { queueService } from './queueService'

export const cancellationService = {
  async cancelAppointment(
    supabase: SupabaseClient,
    appointmentId: string,
    clinicId: string,
    reason: string,
    userId: string
  ) {
    // 1. Change Status to Cancelled (Logs history)
    const apt = await appointmentLifecycleService.changeStatus(
      supabase,
      appointmentId,
      clinicId,
      'Cancelled',
      userId,
      'Cancelled via cancellation service'
    )

    // 2. Create Cancellation Record
    await appointmentCancellationRepository.createCancellationRecord(supabase, {
      clinic_id: clinicId,
      appointment_id: appointmentId,
      cancelled_by: userId,
      cancellation_reason: reason,
      refund_required: false,
      refund_status: null,
      remarks: null
    })

    // 3. If it was in queue, cancel from queue
    // Queue service will handle updating queue status and token status if they exist.
    // We already have a cancel method in queueService, but since we just manually updated the status,
    // we can just call the queue cancellation cleanup part.
    await queueService.cancelAppointment(supabase, appointmentId, userId, reason)
    
    // Note: The slot is effectively released because 'Cancelled' appointments are filtered out
    // by `getAppointmentsByDate` in the appointmentRepository.

    return apt
  }
}
