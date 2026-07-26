'use client'

import React, { useState, useEffect } from 'react'
import { getTodaysVisitsAction, startConsultationAction } from '@/actions/emr/visitActions'
import VisitWorkspace from '@/components/emr/VisitWorkspace'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import type { VisitRow } from '@/types/emr'

export default function EMRDashboard() {
  const [visits, setVisits] = useState<VisitRow[]>([])
  const [activeVisit, setActiveVisit] = useState<VisitRow | null>(null)
  const [loading, setLoading] = useState(true)

  const loadVisits = async () => {
    setLoading(true)
    const res = await getTodaysVisitsAction()
    if (res.success && res.data) setVisits(res.data)
    setLoading(false)
  }

  useEffect(() => { loadVisits() }, [])

  const handleVisitComplete = (visit: VisitRow) => {
    setVisits(prev => prev.map(v => v.id === visit.id ? visit : v))
    setActiveVisit(visit)
  }

  const statusVariant = (s: string) => {
    if (s === 'Completed') return 'success'
    if (s === 'Cancelled') return 'danger'
    return 'info'
  }

  return (
    <main className="flex-1 p-6 max-w-7xl w-full mx-auto space-y-6 z-10 relative">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">EMR — Consultation Desk</h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Today's active visits &amp; clinical records
          </p>
        </div>
        <Button onClick={loadVisits} variant="outline" size="sm">⟳ Refresh</Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Visit List */}
        <div className="space-y-3">
          <h2 className="font-semibold text-slate-700 text-sm uppercase tracking-wide">Today's Visits</h2>
          {loading && (
            <div className="text-slate-400 text-sm animate-pulse text-center py-8">Loading visits...</div>
          )}
          {!loading && visits.length === 0 && (
            <div className="text-center py-10 text-slate-400 text-sm bg-slate-50 rounded-xl border border-dashed border-slate-200">
              No visits recorded today.<br />
              <span className="text-xs">Visits are created when a consultation starts from an appointment.</span>
            </div>
          )}
          {visits.map(v => (
            <div
              key={v.id}
              onClick={() => setActiveVisit(v)}
              className={`p-4 rounded-xl border cursor-pointer transition-all ${
                activeVisit?.id === v.id
                  ? 'border-blue-500 bg-blue-50 shadow-sm'
                  : 'border-slate-200 bg-white hover:border-slate-300 hover:shadow-sm'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="font-mono font-bold text-blue-700 text-sm">{v.visit_number}</span>
                <Badge variant={statusVariant(v.consultation_status)}>{v.consultation_status}</Badge>
              </div>
              <div className="text-xs text-slate-500">{v.visit_date} · {v.visit_type}</div>
              {v.chief_complaint && (
                <div className="text-xs text-slate-700 mt-1 font-medium truncate">{v.chief_complaint}</div>
              )}
            </div>
          ))}
        </div>

        {/* Workspace */}
        <div className="lg:col-span-2">
          {activeVisit ? (
            <Card className="p-5">
              <VisitWorkspace visitId={activeVisit.id} onComplete={handleVisitComplete} />
            </Card>
          ) : (
            <Card className="p-10 flex flex-col items-center justify-center text-center min-h-[400px]">
              <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="font-semibold text-slate-700 mb-1">Select a Visit</h3>
              <p className="text-sm text-slate-400 max-w-xs">
                Select a visit from the list to open the consultation workspace with SOAP notes, vitals, and chief complaints.
              </p>
            </Card>
          )}
        </div>
      </div>
    </main>
  )
}