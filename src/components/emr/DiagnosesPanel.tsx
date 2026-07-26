'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { getDiagnosesAction, addDiagnosisAction, updateDiagnosisAction, deleteDiagnosisAction } from '@/actions/emr/diagnosisActions'
import { resolveDiagnosisTxAction } from '@/actions/emr/diagnosisHistoryActions'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Badge } from '@/components/ui/Badge'
import type { DiagnosisRow, DiagnosisType, DiagnosisStatus } from '@/types/emr'

const STATUS_COLORS: Record<DiagnosisStatus, 'success' | 'warning' | 'danger' | 'info' | 'default'> = {
  'Active': 'info',
  'Resolved': 'success',
  'Chronic': 'warning',
  'Ruled Out': 'default'
}

const TYPE_COLORS: Record<DiagnosisType, 'danger' | 'default'> = {
  'Primary': 'danger',
  'Secondary': 'default'
}

export default function DiagnosesPanel({ visitId, patientId }: { visitId: string; patientId: string }) {
  const [diagnoses, setDiagnoses] = useState<DiagnosisRow[]>([])
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    diagnosis_name: '',
    diagnosis_type: 'Secondary' as DiagnosisType,
    diagnosis_code: '',
    icd_code: '',
    diagnosis_notes: '',
    status: 'Active' as DiagnosisStatus
  })

  const loadDiagnoses = useCallback(async () => {
    const res = await getDiagnosesAction(visitId)
    if (res.success && res.data) setDiagnoses(res.data)
  }, [visitId])

  useEffect(() => { loadDiagnoses() }, [loadDiagnoses])

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.diagnosis_name.trim()) return
    setLoading(true)
    const res = await addDiagnosisAction(visitId, {
      diagnosis_name: form.diagnosis_name,
      diagnosis_type: form.diagnosis_type,
      diagnosis_code: form.diagnosis_code || undefined,
      icd_code: form.icd_code || undefined,
      diagnosis_notes: form.diagnosis_notes || undefined,
      status: form.status
    })
    if (res.success && res.data) {
      await loadDiagnoses() // Reload to see demoted primaries
      setForm({ diagnosis_name: '', diagnosis_type: 'Secondary', diagnosis_code: '', icd_code: '', diagnosis_notes: '', status: 'Active' })
    }
    setLoading(false)
  }

  const handleStatusChange = async (d: DiagnosisRow, status: DiagnosisStatus) => {
    if (status === 'Resolved' || status === 'Ruled Out') {
      const res = await resolveDiagnosisTxAction(d.id, status, patientId)
      if (res.success) setDiagnoses(prev => prev.map(x => x.id === d.id ? { ...x, status } : x))
    } else {
      const res = await updateDiagnosisAction(visitId, d.id, { status })
      if (res.success) setDiagnoses(prev => prev.map(x => x.id === d.id ? { ...x, status } : x))
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Remove this diagnosis?')) return
    const res = await deleteDiagnosisAction(id)
    if (res.success) setDiagnoses(prev => prev.filter(d => d.id !== id))
  }

  return (
    <div className="space-y-6">
      {/* Diagnoses List */}
      <div className="space-y-3">
        {diagnoses.map(d => (
          <div key={d.id} className="flex items-start justify-between gap-4 p-4 rounded-xl border border-slate-200 bg-white shadow-sm">
            <div className="flex-1">
              <div className="flex items-center gap-2 flex-wrap mb-1">
                <Badge variant={TYPE_COLORS[d.diagnosis_type]}>{d.diagnosis_type}</Badge>
                <span className="font-semibold text-slate-800">{d.diagnosis_name}</span>
                {d.icd_code && <span className="text-xs font-mono bg-slate-100 px-2 py-0.5 rounded text-slate-600">{d.icd_code}</span>}
                {d.diagnosis_code && <span className="text-xs text-slate-400">({d.diagnosis_code})</span>}
              </div>
              {d.diagnosis_notes && <p className="text-xs text-slate-500 mb-2">{d.diagnosis_notes}</p>}
              <div className="flex gap-1 flex-wrap">
                {(['Active', 'Resolved', 'Chronic', 'Ruled Out'] as DiagnosisStatus[]).map(s => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => handleStatusChange(d, s)}
                    className={`text-xs px-2 py-0.5 rounded-full border transition-all ${
                      d.status === s
                        ? 'bg-blue-600 text-white border-blue-600'
                        : 'border-slate-200 text-slate-500 hover:border-blue-400'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
            <button type="button" onClick={() => handleDelete(d.id)} className="text-slate-400 hover:text-red-500 text-lg leading-none">&times;</button>
          </div>
        ))}
        {diagnoses.length === 0 && (
          <div className="text-slate-400 text-sm text-center py-4">No diagnoses added. A visit should have at least one Primary diagnosis.</div>
        )}
      </div>

      {/* Add Form */}
      <form onSubmit={handleAdd} className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-4">
        <h4 className="font-semibold text-slate-700 text-sm">Add Diagnosis</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2">
            <label className="text-xs font-semibold text-slate-500 uppercase">Diagnosis Name *</label>
            <Input required value={form.diagnosis_name} onChange={e => setForm({...form, diagnosis_name: e.target.value})} placeholder="e.g. Essential Hypertension" className="mt-1" />
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-500 uppercase">Type</label>
            <select className="w-full mt-1 border border-slate-300 rounded-lg p-2 text-sm outline-none focus:border-blue-500" value={form.diagnosis_type} onChange={e => setForm({...form, diagnosis_type: e.target.value as DiagnosisType})}>
              <option>Primary</option>
              <option>Secondary</option>
            </select>
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-500 uppercase">Diagnosis Code</label>
            <Input value={form.diagnosis_code} onChange={e => setForm({...form, diagnosis_code: e.target.value})} placeholder="e.g. I10" className="mt-1" />
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-500 uppercase">ICD Code</label>
            <Input value={form.icd_code} onChange={e => setForm({...form, icd_code: e.target.value})} placeholder="e.g. I10.0" className="mt-1" />
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-500 uppercase">Initial Status</label>
            <select className="w-full mt-1 border border-slate-300 rounded-lg p-2 text-sm outline-none focus:border-blue-500" value={form.status} onChange={e => setForm({...form, status: e.target.value as DiagnosisStatus})}>
              <option>Active</option>
              <option>Resolved</option>
              <option>Chronic</option>
              <option>Ruled Out</option>
            </select>
          </div>
          <div className="lg:col-span-3">
            <label className="text-xs font-semibold text-slate-500 uppercase">Notes</label>
            <Input value={form.diagnosis_notes} onChange={e => setForm({...form, diagnosis_notes: e.target.value})} placeholder="Additional clinical notes..." className="mt-1" />
          </div>
        </div>
        <Button type="submit" disabled={loading || !form.diagnosis_name.trim()}>
          {loading ? 'Adding...' : '+ Add Diagnosis'}
        </Button>
      </form>
    </div>
  )
}
