'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { getChiefComplaintsAction, addChiefComplaintAction, deleteChiefComplaintAction } from '@/actions/emr/chiefComplaintActions'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Badge } from '@/components/ui/Badge'
import type { ChiefComplaintRow } from '@/types/emr'

const SEVERITY_COLORS: Record<string, 'warning' | 'danger' | 'default'> = {
  Mild: 'default',
  Moderate: 'warning',
  Severe: 'danger'
}

export default function ChiefComplaintsPanel({ visitId }: { visitId: string }) {
  const [complaints, setComplaints] = useState<ChiefComplaintRow[]>([])
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    complaint: '',
    duration: '',
    severity: '' as '' | 'Mild' | 'Moderate' | 'Severe',
    remarks: ''
  })

  const loadComplaints = useCallback(async () => {
    const res = await getChiefComplaintsAction(visitId)
    if (res.success && res.data) setComplaints(res.data)
  }, [visitId])

  useEffect(() => { loadComplaints() }, [loadComplaints])

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.complaint.trim()) return
    setLoading(true)
    const res = await addChiefComplaintAction(visitId, {
      complaint: form.complaint,
      duration: form.duration || undefined,
      severity: form.severity || undefined,
      remarks: form.remarks || undefined
    })
    if (res.success && res.data) {
      setComplaints([...complaints, res.data])
      setForm({ complaint: '', duration: '', severity: '', remarks: '' })
    }
    setLoading(false)
  }

  const handleDelete = async (id: string) => {
    const res = await deleteChiefComplaintAction(id)
    if (res.success) setComplaints(complaints.filter(c => c.id !== id))
  }

  return (
    <div className="space-y-6">
      {/* Complaints List */}
      {complaints.length > 0 && (
        <div className="space-y-3">
          {complaints.map(c => (
            <div key={c.id} className="flex items-start justify-between gap-4 p-4 rounded-xl border border-slate-200 bg-white shadow-sm">
              <div className="flex-1">
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <span className="font-semibold text-slate-800">{c.complaint}</span>
                  {c.severity && (
                    <Badge variant={SEVERITY_COLORS[c.severity] || 'default'}>{c.severity}</Badge>
                  )}
                </div>
                <div className="text-sm text-slate-500 space-x-3">
                  {c.duration && <span>Duration: <strong>{c.duration}</strong></span>}
                  {c.remarks && <span>Note: {c.remarks}</span>}
                </div>
              </div>
              <button
                type="button"
                onClick={() => handleDelete(c.id)}
                className="text-slate-400 hover:text-red-500 transition-colors text-lg leading-none"
              >
                &times;
              </button>
            </div>
          ))}
        </div>
      )}
      {complaints.length === 0 && (
        <div className="text-slate-400 text-sm text-center py-3">No chief complaints added yet.</div>
      )}

      {/* Add Complaint Form */}
      <form onSubmit={handleAdd} className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-4">
        <h4 className="font-semibold text-slate-700 text-sm">Add Complaint</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <label className="text-xs font-semibold text-slate-500 uppercase">Chief Complaint *</label>
            <Input
              required
              autoFocus
              value={form.complaint}
              onChange={e => setForm({ ...form, complaint: e.target.value })}
              placeholder="e.g. Severe headache, Chest pain..."
              className="mt-1"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-500 uppercase">Duration</label>
            <Input
              value={form.duration}
              onChange={e => setForm({ ...form, duration: e.target.value })}
              placeholder="e.g. 3 days, 2 weeks"
              className="mt-1"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-500 uppercase">Severity</label>
            <select
              className="w-full mt-1 border border-slate-300 rounded-lg p-2 text-sm outline-none focus:border-blue-500"
              value={form.severity}
              onChange={e => setForm({ ...form, severity: e.target.value as any })}
            >
              <option value="">— Select —</option>
              <option>Mild</option>
              <option>Moderate</option>
              <option>Severe</option>
            </select>
          </div>
          <div className="md:col-span-2">
            <label className="text-xs font-semibold text-slate-500 uppercase">Remarks</label>
            <Input
              value={form.remarks}
              onChange={e => setForm({ ...form, remarks: e.target.value })}
              placeholder="Optional remarks..."
              className="mt-1"
            />
          </div>
        </div>
        <Button type="submit" disabled={loading || !form.complaint.trim()}>
          {loading ? 'Adding...' : '+ Add Complaint'}
        </Button>
      </form>
    </div>
  )
}
