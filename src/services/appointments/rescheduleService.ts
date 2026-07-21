import type { SupabaseClient } from '@supabase/supabase-js'
import { appointmentRescheduleRepository } from '@/repositories/appointments/appointmentRescheduleRepository'
import { appointmentLifecycleService } from './appointmentLifecycleService'
import type { AppointmentRow } from '@/types/appointments'

export const rescheduleService = {
  async rescheduleAppointment(
    supabase: SupabaseClient,
    appointmentId: string,
    clinicId: string,
    newDate: string,
    newTime: string,
    reason: string,
    userId: string
  ) {
    // 1. Fetch old details
    const { data: oldApt, error } = await supabase
      .from('appointments')
      .select('*')
      .eq('id', appointmentId)
      .single()
    if (error) throw error

    // 2. Update appointment
    const { data: updatedApt, error: updateError } = await supabase
      .from('appointments')
      .update({
        appointment_date: newDate,
        appointment_start_time: newTime,
        appointment_end_time: newTime, // Simplified
        status: 'Rescheduled' // or 'Scheduled' depending on workflow. Usually it goes back to Scheduled, but we track Rescheduled.
      })
      .eq('id', appointmentId)
      .select()
      .single()
      
    if (updateError) throw updateError

    // 3. Log History
    await appointmentLifecycleService.changeStatus(
      supabase,
      appointmentId,
      clinicId,
      'Scheduled', // It returns to Scheduled state for the new date
      userId,
      `Rescheduled to ${newDate} ${newTime}`
    )

    // 4. Create Reschedule Record
    await appointmentRescheduleRepository.createRescheduleRecord(supabase, {
      clinic_id: clinicId,
      appointment_id: appointmentId,
      old_date: oldApt.appointment_date,
      old_time: oldApt.appointment_start_time,
      new_date: newDate,
      new_time: newTime,
      rescheduled_by: userId,
      reason: reason
    })

    return updatedApt as AppointmentRow
  }
}
