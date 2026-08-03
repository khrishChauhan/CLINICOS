'use client'

import React, { useState, useTransition } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import BookAppointmentModal from '../queue/BookAppointmentModal'
import WalkInRegistrationModal from '../queue/WalkInRegistrationModal'
import CancelAppointmentDialog from '@/components/appointments/CancelAppointmentDialog'
import RescheduleAppointmentDialog from '@/components/appointments/RescheduleAppointmentDialog'
import AppointmentDocumentsDialog from '@/components/appointments/AppointmentDocumentsDialog'
import AppointmentCommunicationDialog from '@/components/appointments/AppointmentCommunicationDialog'
import AppointmentFeedbackDialog from '@/components/appointments/AppointmentFeedbackDialog'
import AppointmentAuditTimeline from '@/components/appointments/AppointmentAuditTimeline'
import { CalendarDays, Filter, Plus, Search, Clock, FileText, Bell, Star, Activity, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'
import { Badge } from '@/components/ui/Badge'
import type { AppointmentRow } from '@/types/appointments'
import type { DoctorForDropdown } from '@/actions/appointments/getDoctorsForClinicAction'

interface ExtendedApt extends AppointmentRow {
  patient?: { id: string; first_name: string; last_name: string; uhid: string; mobile_number: string | null }
  doctor?: { id: string; first_name: string; last_name: string }
}

interface Props {
  initialAppointments: ExtendedApt[]
  stats: { total: number; scheduled: number; checkedIn: number; inConsultation: number; completed: number; cancelled: number }
  doctors: DoctorForDropdown[]
  currentDate: string
  currentDoctorId: string
}

export default function AppointmentsClient({ initialAppointments, stats, doctors, currentDate, currentDoctorId }: Props) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isPending, startTransition] = useTransition()
  
  const [isBookingOpen, setIsBookingOpen] = useState(false)
  const [isWalkInOpen, setIsWalkInOpen] = useState(false)
  const [cancelAptId, setCancelAptId] = useState<string | null>(null)
  const [rescheduleAptId, setRescheduleAptId] = useState<string | null>(null)
  const [docsAptId, setDocsAptId] = useState<string | null>(null)
  const [commAptId, setCommAptId] = useState<string | null>(null)
  const [feedbackAptId, setFeedbackAptId] = useState<string | null>(null)
  const [auditAptId, setAuditAptId] = useState<string | null>(null)

  const [searchQuery, setSearchQuery] = useState('')

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newDate = e.target.value
    const params = new URLSearchParams(searchParams.toString())
    params.set('date', newDate)
    startTransition(() => {
      router.push(`/appointments?${params.toString()}`)
    })
  }

  const handleDoctorChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newDoc = e.target.value
    const params = new URLSearchParams(searchParams.toString())
    if (newDoc && newDoc !== 'All') {
      params.set('doctorId', newDoc)
    } else {
      params.delete('doctorId')
    }
    startTransition(() => {
      router.push(`/appointments?${params.toString()}`)
    })
  }

  const handleModalSuccess = () => {
    setIsBookingOpen(false)
    setIsWalkInOpen(false)
    setCancelAptId(null)
    setRescheduleAptId(null)
    startTransition(() => {
      router.refresh()
    })
  }

  const filteredAppointments = initialAppointments.filter(apt => {
    if (!searchQuery) return true
    const q = searchQuery.toLowerCase()
    const p = apt.patient
    if (!p) return false
    return (
      (p.first_name && p.first_name.toLowerCase().includes(q)) ||
      (p.last_name && p.last_name.toLowerCase().includes(q)) ||
      (p.uhid && p.uhid.toLowerCase().includes(q)) ||
      (p.mobile_number && p.mobile_number.includes(q))
    )
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed': return 'success'
      case 'In Consultation': return 'info'
      case 'Scheduled': return 'secondary'
      case 'Checked In': return 'warning'
      case 'Cancelled': return 'destructive'
      default: return 'secondary'
    }
  }

  const getPatientName = (apt: ExtendedApt) => {
    if (apt.patient?.first_name) return `${apt.patient.first_name} ${apt.patient.last_name}`
    return 'Unknown Patient'
  }

  const getDoctorName = (apt: ExtendedApt) => {
    if (apt.doctor?.first_name) return `Dr. ${apt.doctor.first_name} ${apt.doctor.last_name}`
    return 'Unknown Doctor'
  }

  return (
    <main className="flex-1 p-6 max-w-7xl w-full mx-auto space-y-6 z-10 relative">
      {isBookingOpen && <BookAppointmentModal doctors={doctors} onClose={() => setIsBookingOpen(false)} onSuccess={handleModalSuccess} />}
      {isWalkInOpen && <WalkInRegistrationModal doctors={doctors} onClose={() => setIsWalkInOpen(false)} onSuccess={handleModalSuccess} />}
      {cancelAptId && <CancelAppointmentDialog appointmentId={cancelAptId} onClose={() => setCancelAptId(null)} onSuccess={handleModalSuccess} />}
      {rescheduleAptId && <RescheduleAppointmentDialog appointmentId={rescheduleAptId} onClose={() => setRescheduleAptId(null)} onSuccess={handleModalSuccess} />}
      {docsAptId && <AppointmentDocumentsDialog appointmentId={docsAptId} onClose={() => setDocsAptId(null)} />}
      {commAptId && <AppointmentCommunicationDialog appointmentId={commAptId} onClose={() => setCommAptId(null)} />}
      {feedbackAptId && <AppointmentFeedbackDialog appointmentId={feedbackAptId} onClose={() => setFeedbackAptId(null)} />}
      {auditAptId && <AppointmentAuditTimeline appointmentId={auditAptId} onClose={() => setAuditAptId(null)} />}
      
      <div className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 bg-white p-4 rounded-xl border border-slate-100 shadow-sm relative">
          {isPending && (
            <div className="absolute inset-0 bg-white/50 backdrop-blur-[1px] rounded-xl flex items-center justify-center z-10">
              <Loader2 className="w-6 h-6 animate-spin text-blue-500" />
            </div>
          )}
          <div className="text-center p-3 border-r border-slate-100">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Queue Total</p>
            <h4 className="text-2xl font-black text-slate-700 mt-1">{stats.total}</h4>
          </div>
          <div className="text-center p-3 border-r border-slate-100">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider text-amber-500">In Waiting</p>
            <h4 className="text-2xl font-black text-amber-600 mt-1">{stats.checkedIn}</h4>
          </div>
          <div className="text-center p-3 border-r border-slate-100">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider text-emerald-500">Served</p>
            <h4 className="text-2xl font-black text-emerald-600 mt-1">{stats.completed}</h4>
          </div>
          <div className="text-center p-3">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider text-red-500">Cancelled</p>
            <h4 className="text-2xl font-black text-red-600 mt-1">{stats.cancelled}</h4>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-5">
            <Card className="p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div className="flex flex-wrap items-center gap-4">
                <div className="flex items-center gap-2">
                  <CalendarDays className="w-5 h-5 text-blue-500" />
                  <input 
                    className="font-bold text-slate-700 bg-transparent focus:outline-none text-sm border-b border-slate-200" 
                    type="date" 
                    value={currentDate}
                    onChange={handleDateChange}
                    disabled={isPending}
                  />
                </div>
                <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-lg text-xs">
                  <Filter className="w-3.5 h-3.5 text-slate-400" />
                  <span className="text-slate-500">Doctor:</span>
                  <select 
                    className="bg-transparent font-bold text-slate-700 focus:outline-none text-xs w-32 truncate"
                    value={currentDoctorId}
                    onChange={handleDoctorChange}
                    disabled={isPending}
                  >
                    <option value="All">All Doctors</option>
                    {doctors.map(doc => (
                      <option key={doc.id} value={doc.id}>Dr. {doc.first_name} {doc.last_name}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="flex gap-2">
                <Button size="sm" onClick={() => setIsWalkInOpen(true)} className="bg-emerald-600 hover:bg-emerald-700 whitespace-nowrap">
                  <Plus className="w-3.5 h-3.5" /> Book Walk-In
                </Button>
                <Button size="sm" onClick={() => setIsBookingOpen(true)} className="whitespace-nowrap">
                  <Plus className="w-3.5 h-3.5" /> Book Appt
                </Button>
              </div>
            </Card>

            <div className="relative">
              <Input 
                icon={<Search className="w-4.5 h-4.5" />} 
                placeholder="Search appointments by Patient name, UHID, or phone..." 
                className="py-2.5 bg-white shadow-sm"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
              />
            </div>

            <Card className="overflow-hidden relative min-h-[300px]">
              {isPending && (
                <div className="absolute inset-0 bg-white/50 backdrop-blur-[1px] z-10 flex justify-center pt-20">
                  <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
                </div>
              )}
              <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
                <h3 className="font-bold text-slate-800 text-sm">Schedule for {new Date(currentDate).toLocaleDateString()}</h3>
                <span className="text-xs text-slate-400">{filteredAppointments.length} Appointments</span>
              </div>
              <div className="divide-y divide-slate-100">
                {filteredAppointments.length === 0 && !isPending && (
                  <div className="p-8 text-center text-slate-500 text-sm flex flex-col items-center">
                    <CalendarDays className="w-10 h-10 opacity-20 mb-3" />
                    No appointments found for the selected criteria.
                  </div>
                )}
                {filteredAppointments.map((apt, idx) => (
                  <div key={apt.id} className="p-4 hover:bg-slate-50/50 transition flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
                    <div className="flex gap-4 items-start min-w-0">
                      <div className="w-11 h-11 rounded-lg bg-blue-50 border border-blue-100 text-blue-600 flex flex-col items-center justify-center font-bold text-xs shrink-0">
                        <span className="text-[9px] uppercase tracking-wider font-semibold opacity-60">Token</span>
                        <span className="text-sm font-black leading-none mt-0.5">{apt.appointment_number ? apt.appointment_number.split('-').pop() : '—'}</span>
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-800 text-sm truncate">{getPatientName(apt)}</span>
                          <span className="text-[10px] text-slate-400 font-mono truncate shrink-0">({apt.patient?.uhid || '—'})</span>
                        </div>
                        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500 mt-1">
                          <span className="text-slate-700 font-medium">{getDoctorName(apt)}</span>
                          <span>•</span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3 text-slate-400" /> {apt.appointment_start_time?.substring(0, 5) || '—'}
                          </span>
                          <span>•</span>
                          <span className="px-1.5 py-0.2 bg-slate-100 text-slate-600 rounded text-[10px]">{apt.visit_type}</span>
                        </div>
                        <p className="text-xs text-slate-400 italic mt-1 line-clamp-1 truncate">"{apt.reason_for_visit || 'No reason provided'}"</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 w-full sm:w-auto justify-end border-t sm:border-t-0 pt-2 sm:pt-0 shrink-0 flex-wrap">
                      <Badge variant={getStatusColor(apt.status || 'Scheduled') as any}>
                        {apt.status}
                      </Badge>
                      <div className="flex gap-1">
                        <button onClick={() => setDocsAptId(apt.id)} className="px-2 py-1 bg-slate-100 text-slate-600 hover:bg-slate-200 rounded text-xs font-semibold transition" title="Documents">
                          <FileText className="w-3.5 h-3.5" />
                        </button>
                        <button onClick={() => setCommAptId(apt.id)} className="px-2 py-1 bg-slate-100 text-slate-600 hover:bg-slate-200 rounded text-xs font-semibold transition" title="Comm History">
                          <Bell className="w-3.5 h-3.5" />
                        </button>
                        {apt.status !== 'Completed' && apt.status !== 'Cancelled' && (
                          <button onClick={() => setRescheduleAptId(apt.id)} className="px-2 py-1 bg-slate-100 text-slate-600 hover:bg-slate-200 rounded text-xs font-semibold transition">
                            Reschedule
                          </button>
                        )}
                        {apt.status === 'Completed' && (
                          <button onClick={() => setFeedbackAptId(apt.id)} className="px-2 py-1 bg-amber-50 text-amber-600 hover:bg-amber-100 rounded text-xs font-semibold transition flex items-center gap-1" title="Patient Feedback">
                            <Star className="w-3.5 h-3.5" />
                          </button>
                        )}
                        <button onClick={() => setAuditAptId(apt.id)} className="px-2 py-1 bg-slate-100 text-slate-600 hover:bg-slate-200 rounded text-xs font-semibold transition" title="Audit Trail">
                          <Activity className="w-3.5 h-3.5" />
                        </button>
                        {apt.status !== 'Completed' && apt.status !== 'Cancelled' && (
                          <button onClick={() => setCancelAptId(apt.id)} className="px-2 py-1 bg-red-50 text-red-600 hover:bg-red-100 rounded text-xs font-semibold transition" title="Cancel">
                            Cancel
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
          
          <div className="space-y-6">
            <Card className="p-5 bg-gradient-to-br from-blue-600 to-blue-800 text-white border-none">
              <h3 className="font-bold mb-1">Quick Actions</h3>
              <p className="text-xs text-blue-200 mb-4">Fast access to common tasks</p>
              <div className="space-y-2">
                <button className="w-full bg-white/10 hover:bg-white/20 transition px-3 py-2 rounded-lg text-sm text-left flex items-center justify-between">
                  <span>Block Doctor Calendar</span>
                  <CalendarDays className="w-4 h-4 opacity-70" />
                </button>
                <button className="w-full bg-white/10 hover:bg-white/20 transition px-3 py-2 rounded-lg text-sm text-left flex items-center justify-between">
                  <span>Reschedule Bulk Tokens</span>
                  <Clock className="w-4 h-4 opacity-70" />
                </button>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </main>
  )
}
