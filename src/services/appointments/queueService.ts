import type { SupabaseClient } from '@supabase/supabase-js'
import { queueRepository } from '@/repositories/appointments/queueRepository'
import { tokenRepository } from '@/repositories/appointments/tokenRepository'
import { appointmentLifecycleService } from './appointmentLifecycleService'
import { tokenService } from './tokenService'
import { queueDisplayService } from './queueDisplayService'
import type { AppointmentRow, AppointmentQueueRow } from '@/types/appointments'

const WAIT_TIME_PER_PATIENT = 15; // Configuration from user

export const queueService = {
  
  /**
   * Transition an appointment to "Checked In" and generate a queue token.
   */
  async checkInPatient(
    supabase: SupabaseClient,
    appointmentId: string,
    clinicId: string,
    doctorId: string | null,
    userId: string
  ): Promise<{ appointment: AppointmentRow, queueItem: AppointmentQueueRow }> {
    
    // 1. Generate Token
    const token = await tokenService.generateTokenForClinic(supabase, clinicId, appointmentId, doctorId)
    
    // 2. Calculate position & wait time
    let queuePosition = 1;
    let estimatedWait = 0;
    
    if (doctorId) {
      const waiting = await queueRepository.getAllWaitingInQueue(supabase, clinicId, doctorId)
      queuePosition = waiting.length + 1
      estimatedWait = waiting.length * WAIT_TIME_PER_PATIENT
    }

    // 3. Add to Queue
    const queueItem = await queueRepository.addToQueue(supabase, {
      clinic_id: clinicId,
      appointment_id: appointmentId,
      doctor_id: doctorId,
      queue_number: queuePosition,
      current_position: queuePosition,
      estimated_wait_time: estimatedWait,
      queue_status: 'Waiting',
      called_at: null,
      completed_at: null,
      skipped_at: null
    })

    // 4. Update Appointment Status
    const appointment = await appointmentLifecycleService.changeStatus(supabase, appointmentId, clinicId, 'Checked In', userId, `Checked in. Token: ${token.token_number}`)
    
    return { appointment: appointment as AppointmentRow, queueItem }
  },

  /**
   * Move from Checked In to In Consultation
   */
  async startConsultation(
    supabase: SupabaseClient,
    appointmentId: string,
    userId: string
  ): Promise<AppointmentRow> {
    const queueItem = await queueRepository.getQueueItemByAppointmentId(supabase, appointmentId)
    if (!queueItem?.clinic_id) throw new Error('Queue item or clinic ID not found')

    // 1. Update Appointment
    const apt = await appointmentLifecycleService.changeStatus(supabase, appointmentId, queueItem.clinic_id, 'In Consultation', userId, 'Consultation started')
    
    // 2. Update Queue & Token
    if (queueItem) {
      await queueRepository.updateQueueItem(supabase, queueItem.id, { queue_status: 'In Consultation' })
      if (queueItem.clinic_id && queueItem.doctor_id) {
        const token = await tokenRepository.getTokenByAppointmentId(supabase, appointmentId)
        if (token) {
          await tokenService.updateTokenStatus(supabase, token.id, 'In Consultation')
          await queueDisplayService.updateQueueDisplay(supabase, queueItem.clinic_id, queueItem.doctor_id, token.token_number, 'In Consultation', 0)
        }
      }
    }

    return apt as AppointmentRow
  },

  /**
   * Call next patient
   */
  async callNextPatient(supabase: SupabaseClient, clinicId: string, doctorId: string, userId: string) {
    const nextInQueue = await queueRepository.getNextInQueue(supabase, clinicId, doctorId)
    if (!nextInQueue) return null;

    await queueRepository.updateQueueItem(supabase, nextInQueue.id, {
      queue_status: 'Called',
      called_at: new Date().toISOString()
    })

    const token = await tokenRepository.getTokenByAppointmentId(supabase, nextInQueue.appointment_id)
    if (token) {
      await tokenService.updateTokenStatus(supabase, token.id, 'Called')
      await queueDisplayService.updateQueueDisplay(supabase, clinicId, doctorId, token.token_number, 'Called', 0)
    }

    return nextInQueue;
  },

  /**
   * Mark as Completed
   */
  async completeConsultation(
    supabase: SupabaseClient,
    appointmentId: string,
    userId: string
  ): Promise<AppointmentRow> {
    const queueItem = await queueRepository.getQueueItemByAppointmentId(supabase, appointmentId)
    if (!queueItem?.clinic_id) throw new Error('Queue item or clinic ID not found')

    const apt = await appointmentLifecycleService.changeStatus(supabase, appointmentId, queueItem.clinic_id, 'Completed', userId, 'Consultation finished')
    
    if (queueItem) {
      await queueRepository.updateQueueItem(supabase, queueItem.id, { 
        queue_status: 'Completed',
        completed_at: new Date().toISOString()
      })
      const token = await tokenRepository.getTokenByAppointmentId(supabase, appointmentId)
      if (token) {
        await tokenService.updateTokenStatus(supabase, token.id, 'Completed')
        if (queueItem.clinic_id && queueItem.doctor_id) {
          await queueDisplayService.updateQueueDisplay(supabase, queueItem.clinic_id, queueItem.doctor_id, null, 'Available', null)
        }
      }
    }

    return apt as AppointmentRow
  },
  
  /**
   * Mark as Cancelled
   */
  async cancelAppointment(
    supabase: SupabaseClient,
    appointmentId: string,
    userId: string,
    reason: string
  ) {
    const queueItem = await queueRepository.getQueueItemByAppointmentId(supabase, appointmentId)
    if (queueItem) {
      await queueRepository.updateQueueItem(supabase, queueItem.id, { queue_status: 'Cancelled' })
      const token = await tokenRepository.getTokenByAppointmentId(supabase, appointmentId)
      if (token) await tokenService.updateTokenStatus(supabase, token.id, 'Cancelled')
    }
  }
}
