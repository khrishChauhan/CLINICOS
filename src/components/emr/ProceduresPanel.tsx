'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { getProceduresAction, addProcedureAction, updateProcedureAction, deleteProcedureAction } from '@/actions/emr/procedureActions'
import { getMasterDataAction } from '@/actions/master/masterActions'
import type { MasterProcedureCode } from '@/types/master'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Badge } from '@/components/ui/Badge'
import type { ProcedureRow, ProcedureStatus } from '@/types/emr'

const STATUS_COLORS: Record<ProcedureStatus, 'info' | 'warning' | 'success' | 'danger'> = {
  'Planned': 'info',
  'In Progress': 'warning',
  'Completed': 'success',
  'Cancelled': 'danger'
}

export default function ProceduresPanel({ visitId }: { visitId: string }) {
  const [procedures, setProcedures] = useState<ProcedureRow[]>([])
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    procedure_name: '',
    procedure_code: '',
    procedure_date: '',
    remarks: '',
    status: 'Planned' as ProcedureStatus
  })

  const [masterProcedures, setMasterProcedures] = useState<MasterProcedureCode[]>([])

  const loadProcedures = useCallback(async () => {
    const res = await getProceduresAction(visitId)
    if (res.success && res.data) setProcedures(res.data)
  }, [visitId])

  useEffect(() => { 
    loadProcedures()
    getMasterDataAction<MasterProcedureCode>('procedure_codes').then(res => {
      if (res.success && res.data) setMasterProcedures(res.data)
    })
  }, [loadProcedures])

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    const res = await addProcedureAction(visitId, {
      procedure_name: form.procedure_name,
      procedure_code: form.procedure_code || undefined,
      procedure_date: form.procedure_date || undefined,
      remarks: form.remarks || undefined,
      status: form.status,
      master_procedure_id: masterProcedures.find(m => m.procedure_name === form.procedure_name)?.id
    })
    if (res.success && res.data) {
      setProcedures(prev => [...prev, res.data!])
      setForm({ procedure_name: '', procedure_code: '', procedure_date: '', remarks: '', status: 'Planned' })
    }
    setLoading(false)
  }

  const handleStatusChange = async (p: ProcedureRow, status: ProcedureStatus) => {
    const res = await updateProcedureAction(p.id, { status })
    if (res.success) setProcedures(prev => prev.map(x => x.id === p.id ? { ...x, status } : x))
  }

  const handleDelete = async (id: string) => {
    const res = await deleteProcedureAction(id)
    if (res.success) setProcedures(prev => prev.filter(p => p.id !== id))
  }

  return (
    <div className="space-y-6">
      {/* List */}
      <div className="space-y-3">
        {procedures.map(p => (
          <div key={p.id} className="flex items-start justify-between gap-4 p-4 rounded-xl border border-slate-200 bg-white shadow-sm">
            <div className="flex-1">
              <div className="flex items-center gap-2 flex-wrap mb-1">
                <span className="font-semibold text-slate-800">{p.procedure_name}</span>
                {p.procedure_code && <span className="text-xs font-mono bg-slate-100 px-2 py-0.5 rounded text-slate-600">{p.procedure_code}</span>}
                <Badge variant={STATUS_COLORS[p.status]}>{p.status}</Badge>
              </div>
              <div className="text-xs text-slate-500 space-x-3">
                {p.procedure_date && <span>Date: <strong>{p.procedure_date}</strong></span>}
                {p.remarks && <span>{p.remarks}</span>}
              </div>
              {/* Quick status change */}
              <div className="flex gap-1 mt-2 flex-wrap">
                {(['Planned', 'In Progress', 'Completed', 'Cancelled'] as ProcedureStatus[]).map(s => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => handleStatusChange(p, s)}
                    className={`text-xs px-2 py-0.5 rounded-full border transition-all ${
                      p.status === s ? 'bg-blue-600 text-white border-blue-600' : 'border-slate-200 text-slate-500 hover:border-blue-400'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
            <button type="button" onClick={() => handleDelete(p.id)} className="text-slate-400 hover:text-red-500 text-lg leading-none">&times;</button>
          </div>
        ))}
        {procedures.length === 0 && (
          <div className="text-slate-400 text-sm text-center py-4">No procedures recorded for this visit.</div>
        )}
      </div>

      {/* Add Form */}
      <form onSubmit={handleAdd} className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-4">
        <h4 className="font-semibold text-slate-700 text-sm">Add Procedure</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="lg:col-span-2">
            <label className="text-xs font-semibold text-slate-500 uppercase">Procedure Name *</label>
            <Input required list="procedure-list" value={form.procedure_name} onChange={e => {
              const val = e.target.value
              const match = masterProcedures.find(m => m.procedure_name === val)
              setForm(prev => ({
                ...prev,
                procedure_name: val,
                procedure_code: match?.procedure_code || prev.procedure_code
              }))
            }} placeholder="e.g. ECG, Dressing, IV Line" className="mt-1" />
            <datalist id="procedure-list">
              {masterProcedures.map(m => (
                <option key={m.id} value={m.procedure_name}>{m.procedure_code ? `[${m.procedure_code}] ` : ''}{m.category}</option>
              ))}
            </datalist>
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-500 uppercase">Code</label>
            <Input value={form.procedure_code} onChange={e => setForm({...form, procedure_code: e.target.value})} placeholder="e.g. PROC-001" className="mt-1" />
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-500 uppercase">Date</label>
            <Input type="date" value={form.procedure_date} onChange={e => setForm({...form, procedure_date: e.target.value})} className="mt-1" />
          </div>
          <div className="lg:col-span-2">
            <label className="text-xs font-semibold text-slate-500 uppercase">Remarks</label>
            <Input value={form.remarks} onChange={e => setForm({...form, remarks: e.target.value})} placeholder="Optional remarks..." className="mt-1" />
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-500 uppercase">Status</label>
            <select className="w-full mt-1 border border-slate-300 rounded-lg p-2 text-sm outline-none focus:border-blue-500" value={form.status} onChange={e => setForm({...form, status: e.target.value as ProcedureStatus})}>
              <option>Planned</option>
              <option>In Progress</option>
              <option>Completed</option>
              <option>Cancelled</option>
            </select>
          </div>
        </div>
        <Button type="submit" disabled={loading || !form.procedure_name.trim()}>
          {loading ? 'Adding...' : '+ Add Procedure'}
        </Button>
      </form>
    </div>
  )
}
