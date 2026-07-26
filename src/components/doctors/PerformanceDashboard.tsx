'use client'

import React, { useState, useEffect } from 'react'
import { getDoctorPerformanceHistoryAction, refreshDoctorPerformanceAction } from '@/actions/doctors/performanceActions'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/Table'

export default function PerformanceDashboard({ doctorId }: { doctorId: string }) {
  const [history, setHistory] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [targetMonth, setTargetMonth] = useState(() => {
    const d = new Date()
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
  })

  const fetchHistory = async () => {
    const res = await getDoctorPerformanceHistoryAction(doctorId)
    if (res.success) setHistory(res.data)
  }

  useEffect(() => {
    fetchHistory()
  }, [doctorId])

  const handleRefresh = async () => {
    if (!targetMonth) return
    setLoading(true)
    const res = await refreshDoctorPerformanceAction(doctorId, targetMonth)
    if (res.success) {
      await fetchHistory()
    }
    setLoading(false)
  }

  return (
    <div className="space-y-6">
      <div className="flex gap-4 items-end bg-slate-50 p-4 rounded-xl">
        <div>
          <label className="text-xs font-semibold text-slate-500 uppercase">Generate Report For Month</label>
          <Input type="month" value={targetMonth} onChange={e => setTargetMonth(e.target.value)} required />
        </div>
        <Button onClick={handleRefresh} disabled={loading}>{loading ? 'Generating...' : 'Generate & Refresh'}</Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Month</TableHead>
            <TableHead>Total Patients</TableHead>
            <TableHead>Completed</TableHead>
            <TableHead>Follow-ups</TableHead>
            <TableHead>Cancelled</TableHead>
            <TableHead>Revenue ($)</TableHead>
            <TableHead>Avg Time (m)</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {history.map(h => (
            <TableRow key={h.id}>
              <TableCell className="font-semibold">{h.report_month}</TableCell>
              <TableCell>{h.total_patients}</TableCell>
              <TableCell className="text-green-600">{h.completed_consultations}</TableCell>
              <TableCell>{h.followups}</TableCell>
              <TableCell className="text-red-600">{h.cancelled_appointments}</TableCell>
              <TableCell className="font-semibold">${h.revenue_generated}</TableCell>
              <TableCell>{h.average_consultation_time} min</TableCell>
            </TableRow>
          ))}
          {history.length === 0 && (
            <TableRow>
              <TableCell colSpan={7} className="text-center text-slate-500 py-4">No performance records generated.</TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  )
}
