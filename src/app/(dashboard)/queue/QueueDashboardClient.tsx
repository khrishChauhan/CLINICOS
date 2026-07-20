'use client'

import React, { useState } from 'react'
import { updateAppointmentStatusAction } from '@/actions/appointments/updateAppointmentStatus'
import type { AppointmentRow } from '@/types/appointments'
import { Clock, Play, CheckCircle, XCircle, Stethoscope } from 'lucide-react'

import BookAppointmentModal from './BookAppointmentModal'

interface ExtendedApt extends AppointmentRow {
  patient: { first_name: string; last_name: string; uhid: string }
}

interface Props {
  initialQueue: AppointmentRow[]
}

export default function QueueDashboardClient({ initialQueue }: Props) {
  const [queue, setQueue] = useState<ExtendedApt[]>(initialQueue as ExtendedApt[])
  const [loadingId, setLoadingId] = useState<string | null>(null)
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false)

  const handleStatusChange = async (id: string, action: 'check-in' | 'start-consult' | 'complete-consult' | 'cancel') => {
    setLoadingId(id)
    const res = await updateAppointmentStatusAction(id, action)
    if (res.ok && res.appointment) {
      setQueue(prev => prev.map(q => q.id === id ? { ...q, status: res.appointment.status, appointment_number: res.appointment.appointment_number } : q))
    } else {
      alert(`Error: ${res.error}`)
    }
    setLoadingId(null)
  }

  // Grouping
  const scheduled = queue.filter(q => q.status === 'Scheduled')
  const waiting = queue.filter(q => q.status === 'Checked In' || q.status === 'Waiting').sort((a,b) => (a.appointment_number || '').localeCompare(b.appointment_number || ''))
  const inConsult = queue.filter(q => q.status === 'In Consultation')
  const completed = queue.filter(q => q.status === 'Completed')

  const renderCard = (apt: ExtendedApt, actions: React.ReactNode) => (
    <div key={apt.id} className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 flex items-center justify-between gap-4">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-full bg-blue-50 flex flex-col items-center justify-center text-blue-700">
          <span className="text-xs font-semibold">TKN</span>
          <span className="font-bold text-slate-800">No. {apt.appointment_number || '-'}</span>
        </div>
        <div>
          <h4 className="font-bold text-slate-800">{apt.patient?.first_name} {apt.patient?.last_name}</h4>
          <p className="text-xs font-mono text-slate-500">{apt.patient?.uhid}</p>
          <div className="flex items-center gap-1 mt-1 text-xs font-medium text-slate-500">
            <Clock className="w-3 h-3" /> 
            <span>{apt.appointment_start_time?.substring(0, 5)} • {apt.visit_type}</span>
          </div>
        </div>
      </div>
      <div className="flex gap-2">
        {loadingId === apt.id ? <span className="text-sm text-slate-400">Loading...</span> : actions}
      </div>
    </div>
  )

  return (
    <div className="flex-1 p-6 max-w-7xl mx-auto w-full space-y-6">
      {isBookingModalOpen && (
        <BookAppointmentModal 
          onClose={() => setIsBookingModalOpen(false)} 
          onSuccess={() => {
            setIsBookingModalOpen(false)
            // In a real app we would refresh the queue, but here we can just alert or reload
            window.location.reload()
          }} 
        />
      )}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Live Reception Queue</h1>
          <p className="text-slate-500">Manage today's appointments and check-ins</p>
        </div>
        <button 
          onClick={() => setIsBookingModalOpen(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition shadow-sm"
        >
          + Book Walk-in
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Column 1: Scheduled (Not arrived) */}
        <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 h-[calc(100vh-140px)] overflow-y-auto">
          <h3 className="font-bold text-slate-700 mb-4 flex items-center justify-between">
            Scheduled 
            <span className="bg-slate-200 text-slate-600 px-2 py-0.5 rounded-full text-xs">{scheduled.length}</span>
          </h3>
          <div className="space-y-3">
            {scheduled.map(apt => renderCard(apt, (
              <>
                <button onClick={() => handleStatusChange(apt.id, 'check-in')} className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-lg transition" title="Check In">
                  <CheckCircle className="w-5 h-5" />
                </button>
                <button onClick={() => handleStatusChange(apt.id, 'cancel')} className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition" title="Cancel">
                  <XCircle className="w-5 h-5" />
                </button>
              </>
            )))}
            {scheduled.length === 0 && <p className="text-sm text-slate-400 text-center py-4">No scheduled appointments left</p>}
          </div>
        </div>

        {/* Column 2: Waiting */}
        <div className="bg-amber-50/30 rounded-2xl p-4 border border-amber-100 h-[calc(100vh-140px)] overflow-y-auto">
          <h3 className="font-bold text-slate-700 mb-4 flex items-center justify-between">
            Waiting 
            <span className="bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full text-xs">{waiting.length}</span>
          </h3>
          <div className="space-y-3">
            {waiting.map(apt => renderCard(apt, (
              <button onClick={() => handleStatusChange(apt.id, 'start-consult')} className="flex items-center gap-2 px-3 py-1.5 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 transition">
                <Play className="w-4 h-4" /> Start
              </button>
            )))}
            {waiting.length === 0 && <p className="text-sm text-slate-400 text-center py-4">Queue is empty</p>}
          </div>
        </div>

        {/* Column 3: In Consult & Completed */}
        <div className="space-y-6 h-[calc(100vh-140px)] overflow-y-auto">
          <div className="bg-emerald-50/30 rounded-2xl p-4 border border-emerald-100">
            <h3 className="font-bold text-slate-700 mb-4 flex items-center justify-between">
              In Consultation
              <span className="bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full text-xs">{inConsult.length}</span>
            </h3>
            <div className="space-y-3">
              {inConsult.map(apt => renderCard(apt, (
                <button onClick={() => handleStatusChange(apt.id, 'complete-consult')} className="flex items-center gap-2 px-3 py-1.5 bg-emerald-600 text-white text-sm font-semibold rounded-lg hover:bg-emerald-700 transition">
                  <CheckCircle className="w-4 h-4" /> Finish
                </button>
              )))}
              {inConsult.length === 0 && <p className="text-sm text-slate-400 text-center py-4">No active consultations</p>}
            </div>
          </div>

          <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200">
            <h3 className="font-bold text-slate-700 mb-4 flex items-center justify-between">
              Completed Today
              <span className="bg-slate-200 text-slate-600 px-2 py-0.5 rounded-full text-xs">{completed.length}</span>
            </h3>
            <div className="space-y-3 opacity-60">
              {completed.map(apt => renderCard(apt, <span className="text-sm font-semibold text-emerald-600">Done</span>))}
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}
