'use client'

import React, { useState, useEffect, useCallback, useRef } from 'react'
import { getAvailableSlotsAction } from '@/actions/appointments/getAvailableSlots'
import { bookAppointmentAction } from '@/actions/appointments/bookAppointment'
import { searchPatientsAction, type PatientSearchResult } from '@/actions/appointments/searchPatientsAction'
import type { TimeSlot, BookAppointmentPayload } from '@/types/appointments'
import type { DoctorForDropdown } from '@/actions/appointments/getDoctorsForClinicAction'
import { X, Calendar, Clock, User, Search, AlertCircle, CheckCircle, Stethoscope } from 'lucide-react'

interface Props {
  onClose: () => void
  onSuccess: () => void
  doctors: DoctorForDropdown[]
}

export default function BookAppointmentModal({ onClose, onSuccess, doctors }: Props) {
  // Patient search
  const [selectedPatient, setSelectedPatient] = useState<PatientSearchResult | null>(null)
  const [patientQuery, setPatientQuery] = useState('')
  const [patientResults, setPatientResults] = useState<PatientSearchResult[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [showPatientDropdown, setShowPatientDropdown] = useState(false)

  // Doctor / date / slots
  const [doctorId, setDoctorId] = useState('')
  const [date, setDate] = useState(new Date().toISOString().split('T')[0])
  const [type, setType] = useState<'Scheduled' | 'Walk-in' | 'Emergency'>('Scheduled')
  const [visitType, setVisitType] = useState('New')
  const [consultationType, setConsultationType] = useState('In-Person')
  const [reasonForVisit, setReasonForVisit] = useState('')
  const [slots, setSlots] = useState<TimeSlot[]>([])
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null)
  const [loadingSlots, setLoadingSlots] = useState(false)

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const searchTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Patient search
  const handlePatientSearch = useCallback((query: string) => {
    setPatientQuery(query)
    setSelectedPatient(null)
    if (searchTimer.current) clearTimeout(searchTimer.current)
    if (query.trim().length < 2) {
      setPatientResults([])
      setShowPatientDropdown(false)
      return
    }
    setIsSearching(true)
    searchTimer.current = setTimeout(async () => {
      const res = await searchPatientsAction(query)
      if (res.success) {
        setPatientResults(res.data)
        setShowPatientDropdown(true)
      }
      setIsSearching(false)
    }, 300)
  }, [])

  const handleSelectPatient = (p: PatientSearchResult) => {
    setSelectedPatient(p)
    setPatientQuery(`${p.first_name} ${p.last_name} (${p.uhid})`)
    setPatientResults([])
    setShowPatientDropdown(false)
  }

  // Fetch slots when doctor or date changes
  useEffect(() => {
    if (!doctorId || !date) { setSlots([]); return }
    let isMounted = true
    setLoadingSlots(true)
    setSelectedSlot(null)
    getAvailableSlotsAction(doctorId, date).then(res => {
      if (!isMounted) return
      if (res.ok && res.slots) {
        setSlots(res.slots)
      } else {
        setError(res.error || 'Failed to fetch slots')
        setSlots([])
      }
      setLoadingSlots(false)
    })
    return () => { isMounted = false }
  }, [doctorId, date])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedPatient) { setError('Please select a patient.'); return }
    if (!doctorId) { setError('Please select a doctor.'); return }
    if (!selectedSlot) { setError('Please select a time slot.'); return }

    setLoading(true)
    setError(null)

    const payload: BookAppointmentPayload = {
      patientId: selectedPatient.id,
      doctorId,
      date,
      startTime: selectedSlot.startTime,
      endTime: selectedSlot.endTime,
      type,
      priority: type === 'Emergency' ? 'Urgent' : 'Normal',
      reasonForVisit: reasonForVisit || 'General Consultation',
      visitType,
      consultationType,
    }

    const res = await bookAppointmentAction(payload)
    if (res.ok) {
      onSuccess()
    } else {
      setError(res.error || 'Failed to book appointment')
      setLoading(false)
    }
  }

  const availableSlots = slots.filter(s => s.isAvailable)
  const bookedSlots = slots.filter(s => !s.isAvailable)

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-xl overflow-hidden flex flex-col max-h-[92vh]">

        <div className="flex items-center justify-between p-5 border-b border-slate-100 bg-slate-50/50">
          <div>
            <h2 className="text-lg font-bold text-slate-800">Book Appointment</h2>
            <p className="text-xs text-slate-500 mt-0.5">Schedule a new consultation slot</p>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 space-y-4 overflow-y-auto">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl flex gap-2 text-red-800 text-sm">
              <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" /> {error}
              <button onClick={() => setError(null)} className="ml-auto text-red-400 hover:text-red-600">✕</button>
            </div>
          )}

          <form id="book-form" onSubmit={handleSubmit} className="space-y-4">
            {/* Patient Search */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">Patient *</label>
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                <input
                  type="text"
                  autoFocus
                  value={patientQuery}
                  onChange={e => handlePatientSearch(e.target.value)}
                  onBlur={() => setTimeout(() => setShowPatientDropdown(false), 150)}
                  onFocus={() => patientResults.length > 0 && setShowPatientDropdown(true)}
                  placeholder="Search by name, UHID, or phone..."
                  className="w-full pl-9 pr-4 py-2.5 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none"
                />
                {isSearching && <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs">Searching…</span>}
                {selectedPatient && <CheckCircle className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-emerald-500" />}

                {showPatientDropdown && patientResults.length > 0 && (
                  <div className="absolute z-20 w-full mt-1 bg-white border border-slate-200 rounded-xl shadow-lg overflow-hidden max-h-48 overflow-y-auto">
                    {patientResults.map(p => (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => handleSelectPatient(p)}
                        className="w-full text-left px-4 py-2.5 hover:bg-slate-50 transition flex items-center gap-3 border-b border-slate-50 last:border-0"
                      >
                        <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center shrink-0">
                          <User className="w-4 h-4 text-blue-500" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-slate-800">{p.first_name} {p.last_name}</p>
                          <p className="text-xs text-slate-500 font-mono">{p.uhid}{p.mobile_number ? ` · ${p.mobile_number}` : ''}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
                {showPatientDropdown && !isSearching && patientResults.length === 0 && patientQuery.length >= 2 && (
                  <div className="absolute z-20 w-full mt-1 bg-white border border-slate-200 rounded-xl shadow-lg p-3 text-sm text-slate-500 text-center">
                    No patients found
                  </div>
                )}
              </div>
            </div>

            {/* Doctor */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">Doctor *</label>
              <div className="relative">
                <Stethoscope className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                <select
                  value={doctorId}
                  onChange={e => setDoctorId(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none bg-white"
                  required
                >
                  <option value="">Select a doctor...</option>
                  {doctors.map(doc => (
                    <option key={doc.id} value={doc.id}>
                      Dr. {doc.first_name} {doc.last_name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Date + Type */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">Date *</label>
                <div className="relative">
                  <Calendar className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                  <input
                    type="date"
                    value={date}
                    min={new Date().toISOString().split('T')[0]}
                    onChange={e => setDate(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">Type</label>
                <select
                  value={type}
                  onChange={e => setType(e.target.value as any)}
                  className="w-full px-3 py-2.5 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none bg-white"
                >
                  <option value="Scheduled">Scheduled</option>
                  <option value="Walk-in">Walk-in</option>
                  <option value="Emergency">Emergency</option>
                </select>
              </div>
            </div>

            {/* Visit Type + Consultation Type */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">Visit Type</label>
                <select
                  value={visitType}
                  onChange={e => setVisitType(e.target.value)}
                  className="w-full px-3 py-2.5 border border-slate-300 rounded-xl text-sm outline-none bg-white"
                >
                  <option value="New">New</option>
                  <option value="Follow-up">Follow-up</option>
                  <option value="Routine">Routine</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">Mode</label>
                <select
                  value={consultationType}
                  onChange={e => setConsultationType(e.target.value)}
                  className="w-full px-3 py-2.5 border border-slate-300 rounded-xl text-sm outline-none bg-white"
                >
                  <option value="In-Person">In-Person</option>
                  <option value="Tele-consult">Tele-consult</option>
                </select>
              </div>
            </div>

            {/* Reason */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">Reason for Visit</label>
              <textarea
                value={reasonForVisit}
                onChange={e => setReasonForVisit(e.target.value)}
                rows={2}
                placeholder="Brief description of the visit..."
                className="w-full px-3 py-2.5 border border-slate-300 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent resize-none"
              />
            </div>

            {/* Slots */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider flex items-center gap-2">
                <Clock className="w-3.5 h-3.5" /> Available Time Slots
                {loadingSlots && <span className="text-slate-400 font-normal animate-pulse">Loading...</span>}
              </label>
              {!doctorId ? (
                <div className="p-6 text-center border-2 border-dashed border-slate-200 rounded-xl text-slate-400 text-sm">
                  Select a doctor to see available slots
                </div>
              ) : loadingSlots ? (
                <div className="grid grid-cols-4 gap-2">
                  {Array.from({ length: 8 }).map((_, i) => (
                    <div key={i} className="h-10 bg-slate-100 rounded-lg animate-pulse" />
                  ))}
                </div>
              ) : slots.length === 0 ? (
                <div className="p-6 text-center border-2 border-dashed border-slate-200 rounded-xl text-slate-400 text-sm">
                  No availability configured for this date.<br />
                  <span className="text-xs">Check doctor schedule or try another date.</span>
                </div>
              ) : (
                <div className="space-y-2">
                  {availableSlots.length === 0 && (
                    <p className="text-sm text-center text-red-500 py-2">All slots are booked for this date.</p>
                  )}
                  <div className="grid grid-cols-4 gap-2 max-h-40 overflow-y-auto pr-1">
                    {slots.map(slot => (
                      <button
                        key={slot.startTime}
                        type="button"
                        disabled={!slot.isAvailable}
                        onClick={() => setSelectedSlot(slot)}
                        title={slot.reason}
                        className={`py-2 px-1 text-xs font-semibold rounded-xl border-2 flex flex-col items-center justify-center gap-0.5 transition ${
                          !slot.isAvailable
                            ? 'bg-slate-100 border-slate-200 text-slate-300 cursor-not-allowed'
                            : selectedSlot?.startTime === slot.startTime
                              ? 'bg-blue-600 border-blue-600 text-white ring-2 ring-blue-200 ring-offset-1'
                              : 'bg-white border-slate-200 text-slate-700 hover:border-blue-500 hover:text-blue-600'
                        }`}
                      >
                        {slot.startTime}
                        {!slot.isAvailable && (
                          <span className="text-[9px] opacity-60">{slot.reason || 'Booked'}</span>
                        )}
                      </button>
                    ))}
                  </div>
                  {selectedSlot && (
                    <div className="flex items-center gap-2 text-xs text-emerald-600 font-semibold mt-1">
                      <CheckCircle className="w-3.5 h-3.5" />
                      Selected: {selectedSlot.startTime} – {selectedSlot.endTime}
                    </div>
                  )}
                </div>
              )}
            </div>
          </form>
        </div>

        <div className="p-5 border-t border-slate-100 bg-slate-50 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-200 transition"
          >
            Cancel
          </button>
          <button
            type="submit"
            form="book-form"
            disabled={loading || !selectedSlot || !selectedPatient}
            className="px-6 py-2.5 rounded-xl text-sm font-bold bg-blue-600 text-white hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {loading ? (
              <><span className="animate-spin">⟳</span> Booking...</>
            ) : (
              <><Calendar className="w-4 h-4" /> Confirm Booking</>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
