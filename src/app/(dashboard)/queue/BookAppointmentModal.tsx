'use client'

import React, { useState, useEffect } from 'react'
import { getAvailableSlotsAction } from '@/actions/appointments/getAvailableSlots'
import { bookAppointmentAction } from '@/actions/appointments/bookAppointment'
import type { TimeSlot, BookAppointmentPayload } from '@/types/appointments'
import { X, Calendar, Clock, User, AlertCircle, CheckCircle } from 'lucide-react'

interface Props {
  onClose: () => void
  onSuccess: () => void
}

export default function BookAppointmentModal({ onClose, onSuccess }: Props) {
  const [doctorId, setDoctorId] = useState('')
  const [patientId, setPatientId] = useState('') // In a real app, use an autocomplete
  const [date, setDate] = useState(new Date().toISOString().split('T')[0])
  const [type, setType] = useState<'Scheduled' | 'Walk-in' | 'Emergency'>('Scheduled')
  
  const [slots, setSlots] = useState<TimeSlot[]>([])
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null)
  
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Fetch slots whenever doctor or date changes
  useEffect(() => {
    if (!doctorId || !date) return
    
    let isMounted = true
    getAvailableSlotsAction(doctorId, date).then(res => {
      if (!isMounted) return
      if (res.ok && res.slots) {
        setSlots(res.slots)
        setSelectedSlot(null)
      } else {
        setError(res.error || 'Failed to fetch slots')
      }
    })
    return () => { isMounted = false }
  }, [doctorId, date])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!doctorId || !patientId || !date || !selectedSlot) {
      setError("Please fill all required fields and select a slot.")
      return
    }

    setLoading(true)
    setError(null)
    
    const payload: BookAppointmentPayload = {
      patientId,
      doctorId,
      date,
      startTime: selectedSlot.startTime,
      endTime: selectedSlot.endTime,
      type,
      priority: type === 'Emergency' ? 'Urgent' : 'Normal',
      reasonForVisit: 'General Consultation'
    }

    const res = await bookAppointmentAction(payload)
    
    if (res.ok) {
      onSuccess()
    } else {
      setError(res.error || 'Failed to book appointment')
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
        
        <div className="flex items-center justify-between p-6 border-b border-slate-100">
          <h2 className="text-xl font-bold text-slate-800">Book Appointment</h2>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-50 transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto">
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex gap-3 text-red-800 text-sm">
              <AlertCircle className="w-5 h-5 text-red-500 shrink-0" />
              {error}
            </div>
          )}

          <form id="book-form" onSubmit={handleSubmit} className="space-y-6">
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Patient ID (UUID)</label>
                <input 
                  type="text" 
                  value={patientId}
                  onChange={e => setPatientId(e.target.value)}
                  placeholder="e.g. 123e4567-..."
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Doctor ID (UUID)</label>
                <input 
                  type="text" 
                  value={doctorId}
                  onChange={e => setDoctorId(e.target.value)}
                  placeholder="e.g. 123e4567-..."
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Date</label>
                <div className="relative">
                  <Calendar className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input 
                    type="date" 
                    value={date}
                    onChange={e => setDate(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Type</label>
                <select 
                  value={type}
                  onChange={e => setType(e.target.value as any)}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none"
                >
                  <option value="Scheduled">Scheduled</option>
                  <option value="Walk-in">Walk-in</option>
                  <option value="Emergency">Emergency</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Available Time Slots</label>
              
              {!doctorId ? (
                <div className="p-8 text-center border-2 border-dashed border-slate-200 rounded-xl text-slate-500 text-sm">
                  Enter a Doctor ID to view their schedule.
                </div>
              ) : slots.length === 0 ? (
                <div className="p-8 text-center border-2 border-dashed border-slate-200 rounded-xl text-slate-500 text-sm">
                  No availability on this date.
                </div>
              ) : (
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 max-h-48 overflow-y-auto p-1">
                  {slots.map(slot => (
                    <button
                      key={slot.startTime}
                      type="button"
                      disabled={!slot.isAvailable}
                      onClick={() => setSelectedSlot(slot)}
                      className={`py-2 px-1 text-xs font-semibold rounded-lg border flex items-center justify-center gap-1 transition ${
                        !slot.isAvailable 
                          ? 'bg-slate-100 border-slate-200 text-slate-400 cursor-not-allowed'
                          : selectedSlot?.startTime === slot.startTime
                            ? 'bg-blue-600 border-blue-600 text-white ring-2 ring-blue-200 ring-offset-1'
                            : 'bg-white border-slate-200 text-slate-700 hover:border-blue-600 hover:text-blue-600'
                      }`}
                    >
                      {selectedSlot?.startTime === slot.startTime && <CheckCircle className="w-3 h-3" />}
                      {slot.startTime}
                    </button>
                  ))}
                </div>
              )}
            </div>

          </form>
        </div>

        <div className="p-6 border-t border-slate-100 bg-slate-50 flex justify-end gap-3">
          <button 
            type="button" 
            onClick={onClose}
            className="px-5 py-2.5 rounded-lg text-sm font-bold text-slate-600 hover:bg-slate-200 transition"
          >
            Cancel
          </button>
          <button 
            type="submit" 
            form="book-form"
            disabled={loading || !selectedSlot}
            className="px-6 py-2.5 rounded-lg text-sm font-bold bg-blue-600 text-white hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Booking...' : 'Confirm Booking'}
          </button>
        </div>

      </div>
    </div>
  )
}
