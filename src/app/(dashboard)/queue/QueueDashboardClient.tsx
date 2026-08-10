'use client'

import React, { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { updateAppointmentStatusAction } from '@/actions/appointments/updateAppointmentStatus'
import type { AppointmentRow } from '@/types/appointments'
import type { DoctorForDropdown } from '@/actions/appointments/getDoctorsForClinicAction'
import { Clock, Play, CheckCircle, XCircle, Stethoscope, UserPlus, AlertTriangle } from 'lucide-react'
import WalkInRegistrationModal from './WalkInRegistrationModal'
import BookAppointmentModal from './BookAppointmentModal'

interface ExtendedApt extends AppointmentRow {
  patient?: { id: string; first_name: string; last_name: string; uhid: string }
  doctor?: { id: string; first_name: string; last_name: string }
  estimated_wait_time?: number
}

interface Props {
  initialQueue: AppointmentRow[]
  doctors: DoctorForDropdown[]
}

const STATUS_COLORS: Record<string, string> = {
  'Scheduled': 'bg-slate-100 text-slate-600 border-slate-200',
  'Checked In': 'bg-amber-50 text-amber-700 border-amber-200',
  'In Consultation': 'bg-blue-50 text-blue-700 border-blue-200',
  'Completed': 'bg-emerald-50 text-emerald-700 border-emerald-200',
  'Cancelled': 'bg-red-50 text-red-600 border-red-200',
}

export default function QueueDashboardClient({ initialQueue, doctors }: Props) {
  const router = useRouter()
  const [queue, setQueue] = useState<ExtendedApt[]>(initialQueue as ExtendedApt[])
  const [loadingId, setLoadingId] = useState<string | null>(null)
  const [isWalkInOpen, setIsWalkInOpen] = useState(false)
  const [isBookingOpen, setIsBookingOpen] = useState(false)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const [, startTransition] = useTransition()

  const handleStatusChange = async (
    id: string,
    action: 'check-in' | 'start-consult' | 'complete-consult' | 'cancel'
  ) => {
    setLoadingId(id)
    setErrorMsg(null)
    try {
      const res = await updateAppointmentStatusAction(id, action)
      if (res.ok && res.data) {
        // Optimistic update — reflect new status instantly
        const updatedStatus = res.data.appointment?.status || res.data?.status
        if (updatedStatus) {
          setQueue(prev => prev.map(q => q.id === id ? { ...q, status: updatedStatus } : q))
        }
        // Revalidate in background for consistency
        startTransition(() => { router.refresh() })
      } else {
        setErrorMsg(res.error || `Failed to ${action}`)
      }
    } catch (err: any) {
      setErrorMsg(err.message)
    } finally {
      setLoadingId(null)
    }
  }

  const handleModalSuccess = () => {
    setIsWalkInOpen(false)
    setIsBookingOpen(false)
    router.refresh()
  }

  // Grouping
  const scheduled = queue.filter(q => q.status === 'Scheduled')
  const waiting = queue.filter(q => q.status === 'Checked In').sort((a, b) =>
    (a.appointment_number || '').localeCompare(b.appointment_number || ''))
  const inConsult = queue.filter(q => q.status === 'In Consultation')
  const completed = queue.filter(q => q.status === 'Completed')

  const getPatientName = (apt: ExtendedApt) => {
    if (apt.patient?.first_name) return `${apt.patient.first_name} ${apt.patient.last_name}`
    return 'Unknown Patient'
  }

  const renderCard = (apt: ExtendedApt, actions: React.ReactNode) => (
    <div key={apt.id} className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 hover:border-slate-200 transition flex items-start justify-between gap-3">
      <div className="flex items-start gap-3 min-w-0">
        <div className="w-12 h-12 rounded-xl bg-blue-50 flex flex-col items-center justify-center text-blue-700 shrink-0 border border-blue-100">
          <span className="text-[9px] font-bold uppercase tracking-wider text-blue-400">TKN</span>
          <span className="font-black text-sm leading-none text-blue-700">
            {apt.appointment_number ? apt.appointment_number.split('-').pop() : '—'}
          </span>
        </div>
        <div className="min-w-0">
          <h4 className="font-bold text-slate-800 text-sm truncate">{getPatientName(apt)}</h4>
          <p className="text-[11px] font-mono text-slate-400 truncate">{apt.patient?.uhid || apt.patient_id?.slice(0, 8)}</p>
          <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 mt-1 text-[11px] text-slate-500">
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3 text-slate-300" />
              {apt.appointment_start_time?.substring(0, 5) || '—'}
            </span>
            {apt.visit_type && (
              <span className="px-1.5 py-0.5 bg-slate-100 rounded text-[10px] text-slate-600 font-medium">
                {apt.visit_type}
              </span>
            )}
            {apt.priority && apt.priority !== 'Normal' && (
              <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${apt.priority === 'Urgent' || apt.priority === 'Emergency' ? 'bg-red-50 text-red-600' : 'bg-amber-50 text-amber-600'}`}>
                {apt.priority}
              </span>
            )}
          </div>
          {apt.estimated_wait_time && apt.status === 'Checked In' && (
            <p className="text-[10px] text-slate-400 mt-0.5">~{apt.estimated_wait_time} min wait</p>
          )}
        </div>
      </div>
      <div className="flex gap-1.5 shrink-0">
        {loadingId === apt.id
          ? <span className="text-xs text-slate-400 flex items-center gap-1 px-2"><span className="animate-spin">⟳</span> Loading...</span>
          : actions
        }
      </div>
    </div>
  )

  const colClass = "rounded-2xl p-4 border h-[calc(100vh-200px)] overflow-y-auto flex flex-col gap-3"

  return (
    <div className="flex-1 p-6 max-w-7xl mx-auto w-full space-y-5">
      {/* Modals */}
      {isWalkInOpen && (
        <WalkInRegistrationModal
          doctors={doctors}
          onClose={() => setIsWalkInOpen(false)}
          onSuccess={handleModalSuccess}
        />
      )}
      {isBookingOpen && (
        <BookAppointmentModal
          doctors={doctors}
          onClose={() => setIsBookingOpen(false)}
          onSuccess={handleModalSuccess}
        />
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Live Reception Queue</h1>
          <p className="text-slate-500 text-sm">
            {queue.filter(q => q.status !== 'Cancelled').length} appointments today
            {waiting.length > 0 && ` · ${waiting.length} waiting`}
            {inConsult.length > 0 && ` · ${inConsult.length} in consult`}
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setIsBookingOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold text-sm hover:bg-blue-700 transition shadow-sm"
          >
            <Stethoscope className="w-4 h-4" /> Book Appt
          </button>
          <button
            onClick={() => setIsWalkInOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 text-white rounded-lg font-semibold text-sm hover:bg-emerald-700 transition shadow-sm"
          >
            <UserPlus className="w-4 h-4" /> Walk-In
          </button>
        </div>
      </div>

      {errorMsg && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2 text-sm text-red-700">
          <AlertTriangle className="w-4 h-4 shrink-0" /> {errorMsg}
          <button onClick={() => setErrorMsg(null)} className="ml-auto text-red-500 hover:text-red-700">✕</button>
        </div>
      )}

      {/* Kanban */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Scheduled */}
        <div className={`${colClass} bg-slate-50 border-slate-200`}>
          <h3 className="font-bold text-slate-700 text-sm flex items-center justify-between shrink-0">
            Scheduled
            <span className="bg-slate-200 text-slate-600 px-2 py-0.5 rounded-full text-xs font-bold">{scheduled.length}</span>
          </h3>
          {scheduled.map(apt => renderCard(apt, (
            <>
              <button
                onClick={() => handleStatusChange(apt.id, 'check-in')}
                className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-lg transition"
                title="Check In"
                disabled={loadingId === apt.id}
              >
                <CheckCircle className="w-5 h-5" />
              </button>
              <button
                onClick={() => handleStatusChange(apt.id, 'cancel')}
                className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition"
                title="Cancel"
                disabled={loadingId === apt.id}
              >
                <XCircle className="w-5 h-5" />
              </button>
            </>
          )))}
          {scheduled.length === 0 && (
            <div className="flex-1 flex flex-col items-center justify-center text-slate-400 text-sm gap-2">
              <Stethoscope className="w-8 h-8 opacity-20" />
              No scheduled appointments
            </div>
          )}
        </div>

        {/* Waiting */}
        <div className={`${colClass} bg-amber-50/30 border-amber-100`}>
          <h3 className="font-bold text-slate-700 text-sm flex items-center justify-between shrink-0">
            Waiting / Checked In
            <span className="bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full text-xs font-bold">{waiting.length}</span>
          </h3>
          {waiting.map(apt => renderCard(apt, (
            <button
              onClick={() => handleStatusChange(apt.id, 'start-consult')}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 text-white text-xs font-bold rounded-lg hover:bg-blue-700 transition"
              disabled={loadingId === apt.id}
            >
              <Play className="w-3.5 h-3.5" /> Start
            </button>
          )))}
          {waiting.length === 0 && (
            <div className="flex-1 flex flex-col items-center justify-center text-slate-400 text-sm gap-2">
              <Clock className="w-8 h-8 opacity-20" />
              Queue is empty
            </div>
          )}
        </div>

        {/* In Consult + Completed */}
        <div className="space-y-5 h-[calc(100vh-200px)] overflow-y-auto">
          <div className="bg-emerald-50/30 rounded-2xl p-4 border border-emerald-100">
            <h3 className="font-bold text-slate-700 text-sm flex items-center justify-between mb-3">
              In Consultation
              <span className="bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full text-xs font-bold">{inConsult.length}</span>
            </h3>
            <div className="space-y-3">
              {inConsult.map(apt => renderCard(apt, (
                <button
                  onClick={() => handleStatusChange(apt.id, 'complete-consult')}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 text-white text-xs font-bold rounded-lg hover:bg-emerald-700 transition"
                  disabled={loadingId === apt.id}
                >
                  <CheckCircle className="w-3.5 h-3.5" /> Finish
                </button>
              )))}
              {inConsult.length === 0 && (
                <p className="text-sm text-slate-400 text-center py-4">No active consultations</p>
              )}
            </div>
          </div>

          <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200">
            <h3 className="font-bold text-slate-700 text-sm flex items-center justify-between mb-3">
              Completed Today
              <span className="bg-slate-200 text-slate-600 px-2 py-0.5 rounded-full text-xs font-bold">{completed.length}</span>
            </h3>
            <div className="space-y-3 opacity-70">
              {completed.map(apt => renderCard(apt, (
                <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                  <CheckCircle className="w-3.5 h-3.5" /> Done
                </span>
              )))}
              {completed.length === 0 && (
                <p className="text-sm text-slate-400 text-center py-4">No completed appointments yet</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
