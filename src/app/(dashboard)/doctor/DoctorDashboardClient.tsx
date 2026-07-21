'use client'

import React, { useState } from 'react'
import { updateAppointmentStatusAction } from '@/actions/appointments/updateAppointmentStatus'
import FollowUpCreationDialog from '@/components/appointments/FollowUpCreationDialog'
import type { AppointmentRow } from '@/types/appointments'
import { Clock, Play, CheckCircle, User, FileText, Settings, CalendarPlus } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface ExtendedApt extends AppointmentRow {
  patient: { first_name: string; last_name: string; uhid: string }
}

interface Props {
  initialQueue: AppointmentRow[]
  doctorId: string
}

export default function DoctorDashboardClient({ initialQueue, doctorId }: Props) {
  const [queue, setQueue] = useState<ExtendedApt[]>(initialQueue as ExtendedApt[])
  const [loadingId, setLoadingId] = useState<string | null>(null)
  const [followUpApt, setFollowUpApt] = useState<ExtendedApt | null>(null)
  const router = useRouter()

  const handleStatusChange = async (id: string, action: 'start-consult' | 'complete-consult') => {
    setLoadingId(id)
    const res = await updateAppointmentStatusAction(id, action)
    if (res.ok && res.data && res.data.appointment) {
      setQueue(prev => prev.map(q => q.id === id ? { ...q, status: res.data.appointment.status } : q))
    } else {
      alert(`Error: ${res.error}`)
    }
    setLoadingId(null)
  }

  // Doctor only cares about Checked In, Waiting, and In Consultation
  const waiting = queue.filter(q => q.status === 'Checked In' || q.status === 'Waiting')
  const inConsult = queue.filter(q => q.status === 'In Consultation')
  const completed = queue.filter(q => q.status === 'Completed')

  const activeConsultation = inConsult[0] // Assuming one at a time

  return (
    <div className="flex-1 p-6 max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-3 gap-6">
      {followUpApt && (
        <FollowUpCreationDialog
          parentAppointmentId={followUpApt.id}
          patientId={followUpApt.patient_id}
          doctorId={doctorId}
          onClose={() => setFollowUpApt(null)}
          onSuccess={() => {
            setFollowUpApt(null)
            alert('Follow-up scheduled successfully')
          }}
        />
      )}
      
      {/* Left Column: Queue */}
      <div className="lg:col-span-1 space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold text-slate-800">My Queue</h1>
          <span className="text-sm font-semibold bg-blue-100 text-blue-700 px-3 py-1 rounded-full">
            {waiting.length} Waiting
          </span>
        </div>

        <div className="space-y-3 h-[calc(100vh-140px)] overflow-y-auto pr-2">
          {waiting.map(apt => (
            <div key={apt.id} className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 hover:border-blue-300 transition cursor-pointer flex flex-col gap-3">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-bold text-slate-800 text-sm">{apt.patient.first_name} {apt.patient.last_name}</h4>
                  <p className="text-xs text-slate-500 font-mono">{apt.patient.uhid}</p>
                </div>
                <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-700 flex items-center justify-center font-bold text-xs">
                  {apt.appointment_number || '-'}
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-400 flex items-center gap-1">
                  <Clock className="w-3 h-3" /> {apt.appointment_start_time.substring(0, 5)}
                </span>
                <button 
                  onClick={() => handleStatusChange(apt.id, 'start-consult')}
                  disabled={loadingId === apt.id || !!activeConsultation}
                  className="text-xs font-bold text-white bg-blue-600 px-3 py-1.5 rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
                >
                  Call Next
                </button>
              </div>
            </div>
          ))}
          {waiting.length === 0 && (
            <div className="text-center p-8 border-2 border-dashed border-slate-200 rounded-xl text-slate-400 text-sm font-semibold">
              No patients waiting.
            </div>
          )}
        </div>
      </div>

      {/* Right Column: Active Consultation */}
      <div className="lg:col-span-2">
        {activeConsultation ? (
          <div className="bg-white rounded-2xl shadow-sm border border-blue-200 overflow-hidden h-full flex flex-col">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 text-white flex justify-between items-start">
              <div>
                <span className="bg-white/20 text-white px-2 py-1 rounded text-xs font-bold mb-3 inline-block uppercase tracking-wider">
                  In Consultation • Apt {activeConsultation.appointment_number}
                </span>
                <h2 className="text-3xl font-bold">{activeConsultation.patient.first_name} {activeConsultation.patient.last_name}</h2>
                <p className="text-blue-100 font-mono mt-1">{activeConsultation.patient.uhid}</p>
              </div>
              <div className="flex gap-2">
                <button 
                  onClick={() => router.push(`/patients/${activeConsultation.patient_id}`)}
                  className="bg-white/10 hover:bg-white/20 p-2 rounded-lg transition" 
                  title="View Profile"
                >
                  <User className="w-5 h-5" />
                </button>
                <button className="bg-white/10 hover:bg-white/20 p-2 rounded-lg transition" title="Past Records">
                  <FileText className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Workspace Area */}
            <div className="flex-1 p-6 bg-slate-50 flex items-center justify-center">
              <div className="text-center max-w-md">
                <Settings className="w-16 h-16 text-slate-300 mx-auto mb-4 animate-spin-slow" />
                <h3 className="text-xl font-bold text-slate-700 mb-2">EMR Workspace</h3>
                <p className="text-slate-500">
                  The clinical documentation module (Vitals, Prescriptions, Diagnosis) is scheduled for the next Sprint. For now, you can complete the consultation flow.
                </p>
              </div>
            </div>

            {/* Footer Action */}
            <div className="p-6 border-t border-slate-100 bg-white flex justify-end gap-3">
              <button 
                onClick={() => handleStatusChange(activeConsultation.id, 'complete-consult')}
                disabled={loadingId === activeConsultation.id}
                className="px-6 py-3 rounded-lg font-bold text-white bg-emerald-600 hover:bg-emerald-700 transition flex items-center gap-2 shadow-sm"
              >
                <CheckCircle className="w-5 h-5" /> 
                {loadingId === activeConsultation.id ? 'Completing...' : 'Complete Consultation'}
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 h-full flex flex-col items-center justify-center p-12 text-center">
            <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mb-6">
              <User className="w-10 h-10 text-slate-300" />
            </div>
            <h2 className="text-2xl font-bold text-slate-800 mb-2">Ready for Next Patient</h2>
            <p className="text-slate-500 max-w-sm mb-8">
              Click "Call Next" on a patient from the queue to start their consultation.
            </p>
            
            {completed.length > 0 && (
              <div className="w-full max-w-sm text-left">
                <h4 className="font-bold text-slate-600 mb-3 text-sm">Completed Today</h4>
                <div className="space-y-2">
                  {completed.map(apt => (
                    <div key={apt.id} className="flex justify-between items-center p-3 bg-slate-50 rounded-lg text-sm border border-slate-100">
                      <span className="font-medium text-slate-700">{apt.patient.first_name}</span>
                      <div className="flex items-center gap-2">
                        <button 
                          onClick={() => setFollowUpApt(apt)}
                          className="text-xs text-blue-600 hover:text-blue-800 flex items-center gap-1 font-semibold"
                          title="Create Follow-up"
                        >
                          <CalendarPlus className="w-3.5 h-3.5" /> Follow-up
                        </button>
                        <span className="text-emerald-600 font-semibold text-xs flex items-center gap-1"><CheckCircle className="w-3 h-3"/> Done</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

    </div>
  )
}
