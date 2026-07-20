import type { SupabaseClient } from '@supabase/supabase-js'
import { getAvailabilityByDoctor } from '@/repositories/appointments/doctorAvailabilityRepository'
import { getSlotsByDoctor } from '@/repositories/appointments/appointmentSlotRepository'
import { getAppointmentsByDate } from '@/repositories/appointments/appointmentRepository'
import type { TimeSlot } from '@/types/appointments'

export const slotGenerationService = {
  /**
   * Generates available time slots for a doctor on a specific date,
   * respecting availability, slot templates, breaks, and maximum patients.
   */
  async getAvailableSlots(
    supabase: SupabaseClient,
    clinicId: string,
    doctorId: string,
    dateString: string // YYYY-MM-DD
  ): Promise<TimeSlot[]> {
    const targetDate = new Date(dateString)
    const dayOfWeek = targetDate.getDay() // 0 = Sunday, 6 = Saturday

    // 1. Fetch overarching availability
    const availabilities = await getAvailabilityByDoctor(supabase, clinicId, doctorId)
    const availability = availabilities[0]

    if (!availability || !availability.available_days.includes(dayOfWeek)) {
      return [] // Doctor doesn't work on this day
    }

    // 2. Fetch slot templates for this day
    const daySlots = await getSlotsByDoctor(supabase, clinicId, doctorId, dayOfWeek)

    if (daySlots.length === 0) {
      return [] // No slot templates defined for this day
    }

    // 3. Fetch existing appointments for this date
    const bookedAppointments = await getAppointmentsByDate(supabase, clinicId, doctorId, dateString)

    // 4. Generate slots based on slot templates
    const generatedSlots: TimeSlot[] = []

    const parseTime = (t: string) => {
      const [h, m] = t.split(':').map(Number)
      const d = new Date(targetDate)
      d.setHours(h, m, 0, 0)
      return d
    }

    const breakStart = availability.break_start ? parseTime(availability.break_start) : null
    const breakEnd = availability.break_end ? parseTime(availability.break_end) : null

    for (const slotTemplate of daySlots) {
      let currentSlotStart = parseTime(slotTemplate.slot_start_time)
      const scheduleEnd = parseTime(slotTemplate.slot_end_time)
      const maxPatients = slotTemplate.maximum_patients || 1

      while (currentSlotStart < scheduleEnd) {
        const currentSlotEnd = new Date(currentSlotStart.getTime() + slotTemplate.slot_duration * 60000)
        
        if (currentSlotEnd > scheduleEnd) break

        const startStr = currentSlotStart.toTimeString().substring(0, 5) // "HH:mm"
        const endStr = currentSlotEnd.toTimeString().substring(0, 5)

        // Check if slot falls in break time
        let isBreak = false
        if (breakStart && breakEnd) {
           if ((currentSlotStart >= breakStart && currentSlotStart < breakEnd) ||
               (currentSlotEnd > breakStart && currentSlotEnd <= breakEnd)) {
               isBreak = true
           }
        }

        if (isBreak) {
          // Advance to next slot after break
          currentSlotStart = currentSlotEnd
          continue
        }

        // Check booked count for this slot
        const bookedCount = bookedAppointments.filter(apt => {
          // In the new schema, slots are matched strictly by slot_id or time
          // We match by time here
          const aptStart = apt.appointment_start_time.substring(0, 5)
          const aptEnd = apt.appointment_end_time.substring(0, 5)
          return aptStart === startStr && aptEnd === endStr
        }).length

        const isAvailable = bookedCount < maxPatients

        generatedSlots.push({
          startTime: startStr,
          endTime: endStr,
          isAvailable,
          reason: isAvailable ? undefined : 'Booked'
        })

        currentSlotStart = currentSlotEnd
      }
    }

    return generatedSlots
  }
}
