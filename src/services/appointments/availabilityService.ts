import type { SupabaseClient } from '@supabase/supabase-js'
import { getDoctorSchedules, getDoctorLeaves } from '@/repositories/appointments/scheduleRepository'
import { getAppointmentsByDate } from '@/repositories/appointments/appointmentRepository'
import type { TimeSlot } from '@/types/appointments'

export const availabilityService = {
  /**
   * Generates available time slots for a doctor on a specific date.
   */
  async getAvailableSlots(
    supabase: SupabaseClient,
    clinicId: string,
    doctorId: string,
    dateString: string // YYYY-MM-DD
  ): Promise<TimeSlot[]> {
    const targetDate = new Date(dateString)
    const dayOfWeek = targetDate.getDay() // 0 = Sunday, 6 = Saturday

    // 1. Fetch recurring schedule for this day
    const schedules = await getDoctorSchedules(supabase, clinicId, doctorId)
    const daySchedule = schedules.find(s => s.day_of_week === dayOfWeek)

    if (!daySchedule) {
      return [] // Doctor doesn't work on this day
    }

    // 2. Fetch leaves for this date
    const leaves = await getDoctorLeaves(supabase, clinicId, doctorId, dateString, dateString)
    if (leaves.length > 0) {
      // If there's an approved leave that covers this date, they have 0 slots
      return []
    }

    // 3. Fetch existing appointments for this date
    const bookedAppointments = await getAppointmentsByDate(supabase, clinicId, doctorId, dateString)

    // 4. Generate slots based on start_time, end_time, slot_duration, buffer_time
    const slots: TimeSlot[] = []
    
    // Parse times
    // Assuming start_time is "HH:mm:ss"
    const parseTime = (t: string) => {
      const [h, m] = t.split(':').map(Number)
      const d = new Date(targetDate)
      d.setHours(h, m, 0, 0)
      return d
    }

    let currentSlotStart = parseTime(daySchedule.start_time)
    const scheduleEnd = parseTime(daySchedule.end_time)

    while (currentSlotStart < scheduleEnd) {
      const currentSlotEnd = new Date(currentSlotStart.getTime() + daySchedule.slot_duration_minutes * 60000)
      
      if (currentSlotEnd > scheduleEnd) break

      const startStr = currentSlotStart.toTimeString().substring(0, 5) // "HH:mm"
      const endStr = currentSlotEnd.toTimeString().substring(0, 5)

      // Check overlap
      const isBooked = bookedAppointments.some(apt => {
        // Apt overlaps if: (apt.start < slot.end) && (apt.end > slot.start)
        const aptStart = apt.start_time.substring(0, 5)
        const aptEnd = apt.end_time.substring(0, 5)
        return aptStart < endStr && aptEnd > startStr
      })

      slots.push({
        startTime: startStr,
        endTime: endStr,
        isAvailable: !isBooked,
        reason: isBooked ? 'Booked' : undefined
      })

      // Advance by duration + buffer
      currentSlotStart = new Date(currentSlotEnd.getTime() + daySchedule.buffer_time_minutes * 60000)
    }

    return slots
  }
}
