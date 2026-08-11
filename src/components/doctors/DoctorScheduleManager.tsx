'use client'

import React, { useState, useEffect, useTransition } from 'react'
import {
  getDoctorAvailabilityAction,
  getDoctorSlotsAction,
  createDoctorAvailabilityAction,
  updateDoctorAvailabilityAction,
  createAppointmentSlotAction,
  deleteAppointmentSlotAction
} from '@/actions/appointments/manageAvailability'
import { getDoctorByIdAction } from '@/actions/doctors/doctorActions'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Card } from '@/components/ui/Card'
import type { DoctorAvailabilityRow, AppointmentSlotRow } from '@/types/appointments'
import { Clock, Save, RefreshCw } from 'lucide-react'

const DAYS_OF_WEEK = [
  { value: 0, label: 'Sunday' },
  { value: 1, label: 'Monday' },
  { value: 2, label: 'Tuesday' },
  { value: 3, label: 'Wednesday' },
  { value: 4, label: 'Thursday' },
  { value: 5, label: 'Friday' },
  { value: 6, label: 'Saturday' },
]

export default function DoctorScheduleManager({ doctorId }: { doctorId: string }) {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [clinicId, setClinicId] = useState<string>('')
  const [userId, setUserId] = useState<string | null>(null)
  
  // State for availability
  const [availabilityId, setAvailabilityId] = useState<string | null>(null)
  const [availableDays, setAvailableDays] = useState<number[]>([])
  const [availableFrom, setAvailableFrom] = useState('09:00')
  const [availableTo, setAvailableTo] = useState('17:00')
  const [breakStart, setBreakStart] = useState('')
  const [breakEnd, setBreakEnd] = useState('')
  const [consultationMode, setConsultationMode] = useState('In-Person')
  
  // State for slots (assuming uniform slots for simplicity in UI)
  const [slotDuration, setSlotDuration] = useState<number>(15)
  const [maxPatients, setMaxPatients] = useState<number>(1)
  const [existingSlots, setExistingSlots] = useState<AppointmentSlotRow[]>([])

  useEffect(() => {
    async function loadData() {
      setLoading(true)
      try {
        // Fetch doctor to get clinic_id
        const docRes = await getDoctorByIdAction(doctorId)
        if (!docRes.success || !docRes.data) throw new Error('Doctor not found')
        const cId = docRes.data.clinic_id
        const uId = docRes.data.user_id
        setClinicId(cId)
        setUserId(uId)

        if (!uId) {
          setLoading(false)
          return
        }

        // Fetch Availability
        const availRes = await getDoctorAvailabilityAction(cId, uId)
        if (availRes.ok && availRes.availability && availRes.availability.length > 0) {
          const av = availRes.availability[0]
          setAvailabilityId(av.id)
          setAvailableDays(av.available_days || [])
          setAvailableFrom(av.available_from?.substring(0, 5) || '09:00')
          setAvailableTo(av.available_to?.substring(0, 5) || '17:00')
          setBreakStart(av.break_start?.substring(0, 5) || '')
          setBreakEnd(av.break_end?.substring(0, 5) || '')
          setConsultationMode(av.consultation_mode || 'In-Person')
        }

        // Fetch Slots
        const slotsRes = await getDoctorSlotsAction(cId, uId)
        if (slotsRes.ok && slotsRes.slots && slotsRes.slots.length > 0) {
          setExistingSlots(slotsRes.slots)
          setSlotDuration(slotsRes.slots[0].slot_duration)
          setMaxPatients(slotsRes.slots[0].maximum_patients || 1)
        }
      } catch (e: any) {
        console.error(e)
        alert('Failed to load schedule: ' + e.message)
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [doctorId])

  const toggleDay = (day: number) => {
    setAvailableDays(prev => 
      prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day].sort()
    )
  }

  const handleSave = async () => {
    if (!clinicId || !userId) return
    setSaving(true)
    try {
      // 1. Save Availability
      const availPayload: Partial<DoctorAvailabilityRow> = {
        doctor_id: userId,
        clinic_id: clinicId,
        available_days: availableDays,
        available_from: availableFrom,
        available_to: availableTo,
        break_start: breakStart || null,
        break_end: breakEnd || null,
        consultation_mode: consultationMode,
        status: 'Active'
      }

      if (availabilityId) {
        await updateDoctorAvailabilityAction(availabilityId, availPayload)
      } else {
        const res = await createDoctorAvailabilityAction(availPayload)
        if (res.ok && res.availability) setAvailabilityId(res.availability.id)
      }

      // 2. Delete old slot templates
      for (const slot of existingSlots) {
        await deleteAppointmentSlotAction(slot.id)
      }

      // 3. Create new slot templates for each active day
      const newSlots: AppointmentSlotRow[] = []
      for (const day of availableDays) {
        const slotPayload: Partial<AppointmentSlotRow> = {
          clinic_id: clinicId,
          doctor_id: userId,
          day_of_week: day,
          slot_start_time: availableFrom,
          slot_end_time: availableTo,
          slot_duration: slotDuration,
          maximum_patients: maxPatients,
          status: 'Active'
        }
        const sRes = await createAppointmentSlotAction(slotPayload)
        if (sRes.ok && sRes.slot) {
          newSlots.push(sRes.slot)
        }
      }
      setExistingSlots(newSlots)
      alert('Schedule saved successfully!')
    } catch (e: any) {
      console.error(e)
      alert('Failed to save schedule: ' + e.message)
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <div className="p-8 text-center text-slate-500 animate-pulse">Loading schedule...</div>

  if (!userId) {
    return (
      <div className="p-8 text-center border-2 border-dashed border-red-200 rounded-xl bg-red-50">
        <h3 className="text-lg font-bold text-red-600 mb-2">No User Account Associated</h3>
        <p className="text-sm text-red-500">
          This doctor profile is not linked to a system User Account. <br/>
          Schedules and appointments can only be assigned to doctors who have a registered login account.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-lg font-bold text-slate-800">Doctor Schedule & Availability</h2>
        <p className="text-sm text-slate-500 mb-6">Configure the days and times this doctor is available for appointments.</p>
      </div>

      <Card className="p-6 space-y-8 bg-slate-50/50">
        
        {/* Days Selection */}
        <div className="space-y-3">
          <label className="text-sm font-bold text-slate-700">Available Days</label>
          <div className="flex flex-wrap gap-3">
            {DAYS_OF_WEEK.map(day => (
              <label key={day.value} className={`flex items-center gap-2 px-4 py-2 rounded-lg border cursor-pointer transition ${availableDays.includes(day.value) ? 'bg-blue-50 border-blue-200 text-blue-700 font-semibold' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'}`}>
                <input
                  type="checkbox"
                  className="hidden"
                  checked={availableDays.includes(day.value)}
                  onChange={() => toggleDay(day.value)}
                />
                {day.label}
              </label>
            ))}
          </div>
        </div>

        {/* Timings */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-700 flex items-center gap-2">
              <Clock className="w-4 h-4 text-blue-500" /> Working Hours
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-slate-500 uppercase block mb-1">Start Time</label>
                <Input type="time" value={availableFrom} onChange={e => setAvailableFrom(e.target.value)} required />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-500 uppercase block mb-1">End Time</label>
                <Input type="time" value={availableTo} onChange={e => setAvailableTo(e.target.value)} required />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-700 flex items-center gap-2">
              <Clock className="w-4 h-4 text-orange-500" /> Break Time (Optional)
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-slate-500 uppercase block mb-1">Break Start</label>
                <Input type="time" value={breakStart} onChange={e => setBreakStart(e.target.value)} />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-500 uppercase block mb-1">Break End</label>
                <Input type="time" value={breakEnd} onChange={e => setBreakEnd(e.target.value)} />
              </div>
            </div>
          </div>
        </div>

        <hr className="border-slate-200" />

        {/* Slot Configurations */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-slate-700 flex items-center gap-2">
            Appointment Slot Configuration
          </h3>
          <p className="text-xs text-slate-500 mb-2">This determines how the system generates bookable slots within the working hours.</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-500 uppercase block mb-1">Slot Duration (mins)</label>
              <Input type="number" min="5" step="5" value={slotDuration} onChange={e => setSlotDuration(Number(e.target.value))} required />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-500 uppercase block mb-1">Max Patients per Slot</label>
              <Input type="number" min="1" value={maxPatients} onChange={e => setMaxPatients(Number(e.target.value))} required />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-500 uppercase block mb-1">Consultation Mode</label>
              <select 
                className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={consultationMode}
                onChange={e => setConsultationMode(e.target.value)}
              >
                <option value="In-Person">In-Person</option>
                <option value="Video">Video / Teleconsult</option>
                <option value="Both">Both</option>
              </select>
            </div>
          </div>
        </div>

        <div className="pt-4 flex justify-end">
          <Button onClick={handleSave} disabled={saving} className="flex items-center gap-2 px-8">
            {saving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            {saving ? 'Saving...' : 'Save Schedule'}
          </Button>
        </div>

      </Card>
    </div>
  )
}
