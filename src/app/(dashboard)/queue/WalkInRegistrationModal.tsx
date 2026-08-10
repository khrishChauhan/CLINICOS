'use client'

import React, { useState, useCallback, useRef } from 'react'
import { registerWalkInAction } from '@/actions/appointments/walkInActions'
import { searchPatientsAction, type PatientSearchResult } from '@/actions/appointments/searchPatientsAction'
import type { DoctorForDropdown } from '@/actions/appointments/getDoctorsForClinicAction'
import { X, AlertCircle, Search, User, CheckCircle } from 'lucide-react'

interface Props {
  onClose: () => void
  onSuccess: () => void
  doctors: DoctorForDropdown[]
}

export default function WalkInRegistrationModal({ onClose, onSuccess, doctors }: Props) {
  const [selectedPatient, setSelectedPatient] = useState<PatientSearchResult | null>(null)
  const [patientQuery, setPatientQuery] = useState('')
  const [patientResults, setPatientResults] = useState<PatientSearchResult[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [showDropdown, setShowDropdown] = useState(false)

  const [doctorId, setDoctorId] = useState('')
  const [priority, setPriority] = useState<'Normal' | 'Emergency' | 'VIP'>('Normal')
  const [reason, setReason] = useState('')

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const searchTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const handlePatientSearch = useCallback((query: string) => {
    setPatientQuery(query)
    setSelectedPatient(null)
    if (searchTimer.current) clearTimeout(searchTimer.current)
    if (query.trim().length < 2) {
      setPatientResults([])
      setShowDropdown(false)
      return
    }
    setIsSearching(true)
    searchTimer.current = setTimeout(async () => {
      const res = await searchPatientsAction(query)
      if (res.success) {
        setPatientResults(res.data)
        setShowDropdown(true)
      }
      setIsSearching(false)
    }, 300)
  }, [])

  const handleSelectPatient = (patient: PatientSearchResult) => {
    setSelectedPatient(patient)
    setPatientQuery(`${patient.first_name} ${patient.last_name} (${patient.uhid})`)
    setPatientResults([])
    setShowDropdown(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedPatient) {
      setError('Please search and select a patient.')
      return
    }
    if (!reason.trim()) {
      setError('Please provide a reason for visit.')
      return
    }

    setLoading(true)
    setError(null)

    const res = await registerWalkInAction(
      selectedPatient.id,
      doctorId || null,
      priority,
      reason
    )

    if (res.success) {
      onSuccess()
    } else {
      setError(res.error || 'Failed to register walk-in')
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">

        <div className="flex items-center justify-between p-5 border-b border-slate-100 bg-slate-50/50">
          <div>
            <h2 className="text-lg font-bold text-slate-800">Walk-In Registration</h2>
            <p className="text-xs text-slate-500 mt-0.5">Register and auto-join the queue</p>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 overflow-y-auto">
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl flex gap-2 text-red-800 text-sm">
              <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" /> {error}
            </div>
          )}

          <form id="walkin-form" onSubmit={handleSubmit} className="space-y-4">
            {/* Patient Search */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
                Patient *
              </label>
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                <input
                  type="text"
                  autoFocus
                  value={patientQuery}
                  onChange={e => handlePatientSearch(e.target.value)}
                  onBlur={() => setTimeout(() => setShowDropdown(false), 150)}
                  onFocus={() => patientResults.length > 0 && setShowDropdown(true)}
                  placeholder="Search by name, UHID, or phone..."
                  className="w-full pl-9 pr-4 py-2.5 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none"
                />
                {isSearching && (
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs">Searching…</span>
                )}
                {selectedPatient && (
                  <CheckCircle className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-emerald-500" />
                )}

                {showDropdown && patientResults.length > 0 && (
                  <div className="absolute z-20 w-full mt-1 bg-white border border-slate-200 rounded-xl shadow-lg overflow-hidden">
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
                          <p className="text-xs text-slate-500 font-mono">{p.uhid} {p.mobile_number ? `· ${p.mobile_number}` : ''}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
                {showDropdown && patientResults.length === 0 && !isSearching && patientQuery.length >= 2 && (
                  <div className="absolute z-20 w-full mt-1 bg-white border border-slate-200 rounded-xl shadow-lg p-4 text-sm text-slate-500 text-center">
                    No patients found. Register a new patient first.
                  </div>
                )}
              </div>
            </div>

            {/* Doctor */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
                Assign Doctor <span className="font-normal text-slate-400">(Optional)</span>
              </label>
              <select
                value={doctorId}
                onChange={e => setDoctorId(e.target.value)}
                className="w-full px-4 py-2.5 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none bg-white"
              >
                <option value="">Any available doctor</option>
                {doctors.map(doc => (
                  <option key={doc.id} value={doc.user_id ?? doc.id}>
                    Dr. {doc.first_name} {doc.last_name}
                  </option>
                ))}
              </select>
            </div>

            {/* Priority */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">Priority</label>
              <div className="grid grid-cols-3 gap-2">
                {(['Normal', 'VIP', 'Emergency'] as const).map(p => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setPriority(p)}
                    className={`py-2 rounded-xl text-sm font-bold border-2 transition ${
                      priority === p
                        ? p === 'Emergency' ? 'bg-red-600 border-red-600 text-white'
                          : p === 'VIP' ? 'bg-amber-500 border-amber-500 text-white'
                          : 'bg-blue-600 border-blue-600 text-white'
                        : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>

            {/* Reason */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
                Reason for Visit *
              </label>
              <textarea
                value={reason}
                onChange={e => setReason(e.target.value)}
                placeholder="e.g. Fever and cough since 2 days"
                className="w-full px-4 py-2.5 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none h-20 resize-none"
                required
              />
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
            form="walkin-form"
            disabled={loading || !selectedPatient}
            className="px-6 py-2.5 rounded-xl text-sm font-bold bg-emerald-600 text-white hover:bg-emerald-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {loading ? (
              <><span className="animate-spin">⟳</span> Registering...</>
            ) : (
              <><CheckCircle className="w-4 h-4" /> Register & Join Queue</>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
