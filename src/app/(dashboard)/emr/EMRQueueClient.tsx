'use client'

import React, { useState, useTransition } from 'react'
import { startConsultationAction } from '@/actions/emr/visitActions'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { useRouter } from 'next/navigation'
import type { AppointmentRow } from '@/types/appointments'

interface Props {
  initialAppointments: AppointmentRow[]
  initialStats: Record<string, number>
}

export default function EMRQueueClient({ initialAppointments, initialStats }: Props) {
  const router = useRouter()
  const [appointments] = useState<AppointmentRow[]>(initialAppointments)
  const [stats] = useState(initialStats)
  const [starting, setStarting] = useState<string | null>(null)
  const [, startTransition] = useTransition()

  const handleStartConsultation = async (appt: AppointmentRow) => {
    setStarting(appt.id)
    const res = await startConsultationAction(appt.id, appt.patient_id, appt.doctor_id)
    if (res.success && res.data) {
      router.push(`/emr/${res.data.id}`)
    } else {
      alert('Failed to start consultation: ' + res.error)
      setStarting(null)
    }
  }

  const handleRefresh = () => {
    startTransition(() => { router.refresh() })
  }

  return (
    <main className="flex-1 p-6 max-w-7xl w-full mx-auto space-y-6 z-10 relative">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Doctor's Active Queue</h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Patients waiting for consultation today
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex gap-4 text-sm">
            <div className="bg-white px-4 py-2 rounded-lg border shadow-sm flex flex-col items-center">
              <span className="text-slate-500 text-xs font-semibold uppercase">Waiting</span>
              <span className="text-lg font-bold text-blue-600">{stats.checkedIn || 0}</span>
            </div>
            <div className="bg-white px-4 py-2 rounded-lg border shadow-sm flex flex-col items-center">
              <span className="text-slate-500 text-xs font-semibold uppercase">In Progress</span>
              <span className="text-lg font-bold text-orange-500">{stats.inConsultation || 0}</span>
            </div>
            <div className="bg-white px-4 py-2 rounded-lg border shadow-sm flex flex-col items-center">
              <span className="text-slate-500 text-xs font-semibold uppercase">Completed</span>
              <span className="text-lg font-bold text-emerald-600">{stats.completed || 0}</span>
            </div>
          </div>
          <Button onClick={handleRefresh} variant="outline" size="sm">⟳ Refresh</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {appointments.length === 0 && (
          <div className="col-span-full text-center py-16 text-slate-400 text-sm bg-slate-50 rounded-xl border border-dashed border-slate-200">
            <div className="text-4xl mb-3">☕</div>
            No patients currently waiting.<br />
            <span className="text-xs">Enjoy your break!</span>
          </div>
        )}
        {appointments.map((appt: any) => (
          <Card key={appt.id} className="p-5 flex flex-col border-slate-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="font-bold text-slate-800 text-lg">
                  {appt.patient?.first_name} {appt.patient?.last_name}
                </h3>
                <div className="text-sm text-slate-500 font-mono mt-1">UHID: {appt.patient?.uhid}</div>
              </div>
              <Badge variant={appt.status === 'In Consultation' ? 'warning' : 'info'}>
                {appt.status}
              </Badge>
            </div>

            <div className="space-y-2 mb-6">
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Appt #</span>
                {/* BUG-04 FIX: was appt.token_number — correct column is appointment_number */}
                <span className="font-semibold">{appt.appointment_number || 'N/A'}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Type</span>
                {/* BUG-04 FIX: was appt.appointment_type — correct fields are visit_type/consultation_type */}
                <span className="font-medium">{appt.visit_type || appt.consultation_type || '—'}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Time</span>
                <span className="font-medium text-slate-700">{appt.appointment_start_time?.substring(0, 5) || '—'}</span>
              </div>
            </div>

            <div className="mt-auto">
              <Button 
                className="w-full"
                variant={appt.status === 'In Consultation' ? 'outline' : 'primary'}
                disabled={starting === appt.id}
                onClick={() => handleStartConsultation(appt)}
              >
                {starting === appt.id 
                  ? 'Loading...' 
                  : appt.status === 'In Consultation' 
                    ? 'Resume Consultation' 
                    : 'Start Consultation'}
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </main>
  )
}
