'use client'

import React, { useState } from 'react'
import { recordQualityControlAction } from '@/actions/laboratory/labOperationsActions'
import { ShieldCheck, Plus, Search, CheckCircle, XCircle } from 'lucide-react'
import dayjs from 'dayjs'
import { LaboratoryTabs } from '../LaboratoryTabs'

const STATUS_STYLES: Record<string, string> = {
  'Pass': 'bg-green-100 text-green-700',
  'Fail': 'bg-red-100 text-red-700',
  'Pending': 'bg-amber-100 text-amber-700',
}

const QC_TYPES = ['Calibration', 'Daily QC', 'Weekly QC', 'Monthly Maintenance', 'Proficiency Testing', 'Internal QC']

export default function QualityControlClient({
  qcHistory: initial,
  instruments
}: {
  qcHistory: any[]
  instruments: any[]
}) {
  const [qcHistory, setQcHistory] = useState(initial)
  const [showForm, setShowForm] = useState(false)
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    instrument_id: '',
    qc_date: dayjs().format('YYYY-MM-DD'),
    qc_type: 'Daily QC',
    result: 'Pass',
    status: 'Pass',
    remarks: ''
  })

  const handleRecord = async (e: React.FormEvent) => {
    e.preventDefault(); setLoading(true)
    const res = await recordQualityControlAction({
      instrument_id: form.instrument_id,
      qc_date: form.qc_date,
      qc_type: form.qc_type,
      performed_by: '', // set server-side
      result: form.result,
      status: form.result === 'Pass' ? 'Pass' : 'Fail',
      remarks: form.remarks || undefined
    })
    if (res.success) {
      setQcHistory(prev => [res.data, ...prev])
      setShowForm(false)
    }
    setLoading(false)
  }

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Quality Control</h1>
          <p className="text-sm text-slate-500">Immutable QC audit log — records cannot be deleted or modified</p>
        </div>
        <button onClick={() => setShowForm(true)}
          className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 text-sm transition">
          <Plus className="w-4 h-4" /> Record QC
        </button>
      </div>

      <LaboratoryTabs />

      {showForm && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
          <h2 className="text-base font-bold text-slate-800 mb-4 border-b border-slate-100 pb-3">New QC Record</h2>
          <form onSubmit={handleRecord} className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Instrument *</label>
              <select required value={form.instrument_id} onChange={e => setForm(f => ({ ...f, instrument_id: e.target.value }))}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm bg-white outline-none">
                <option value="">Select Instrument</option>
                {instruments.map(i => <option key={i.id} value={i.id}>{i.instrument_name} ({i.instrument_code})</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">QC Date *</label>
              <input type="date" required value={form.qc_date} onChange={e => setForm(f => ({ ...f, qc_date: e.target.value }))}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm outline-none" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">QC Type *</label>
              <select value={form.qc_type} onChange={e => setForm(f => ({ ...f, qc_type: e.target.value }))}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm bg-white outline-none">
                {QC_TYPES.map(t => <option key={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Result *</label>
              <select required value={form.result} onChange={e => setForm(f => ({ ...f, result: e.target.value }))}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm bg-white outline-none">
                <option value="Pass">Pass</option>
                <option value="Fail">Fail</option>
              </select>
            </div>
            <div className="col-span-2">
              <label className="block text-xs font-semibold text-slate-600 mb-1">Remarks</label>
              <input type="text" value={form.remarks} onChange={e => setForm(f => ({ ...f, remarks: e.target.value }))}
                placeholder="Optional observations..." className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm outline-none" />
            </div>
            <div className="col-span-full flex justify-end gap-3 pt-2">
              <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 text-sm text-slate-600 hover:bg-slate-100 rounded-lg">Cancel</button>
              <button type="submit" disabled={loading} className="px-5 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 disabled:opacity-50">
                Save QC Record
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-4 border-b border-slate-200 bg-slate-50 flex items-center gap-3">
          <div className="relative w-full max-w-sm">
            <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
            <input type="text" placeholder="Search QC records..." className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg text-sm outline-none" />
          </div>
          <select className="border border-slate-300 rounded-lg text-sm px-3 py-2 bg-white outline-none">
            <option value="">All Instruments</option>
            {instruments.map(i => <option key={i.id} value={i.id}>{i.instrument_name}</option>)}
          </select>
        </div>

        <table className="w-full text-sm text-left text-slate-600">
          <thead className="bg-slate-50 text-slate-500 border-b border-slate-200">
            <tr>
              <th className="px-6 py-4 font-semibold">Instrument</th>
              <th className="px-6 py-4 font-semibold">QC Type</th>
              <th className="px-6 py-4 font-semibold">QC Date</th>
              <th className="px-6 py-4 font-semibold">Performed By</th>
              <th className="px-6 py-4 font-semibold">Result</th>
              <th className="px-6 py-4 font-semibold">Remarks</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {!qcHistory.length ? (
              <tr><td colSpan={6} className="px-6 py-12 text-center">
                <ShieldCheck className="w-10 h-10 text-slate-300 mx-auto mb-3" />
                <p className="font-medium text-slate-800">No QC records yet</p>
                <p className="text-sm text-slate-500 mt-1">Record your first quality control check to get started.</p>
              </td></tr>
            ) : qcHistory.map(qc => (
              <tr key={qc.id} className="hover:bg-slate-50/50 transition">
                <td className="px-6 py-4">
                  <p className="font-semibold text-slate-800">{qc.instrument?.instrument_name}</p>
                  <p className="text-xs text-slate-400 font-mono">{qc.instrument?.instrument_code}</p>
                </td>
                <td className="px-6 py-4">{qc.qc_type}</td>
                <td className="px-6 py-4">{dayjs(qc.qc_date).format('DD MMM YYYY')}</td>
                <td className="px-6 py-4">{qc.performer?.first_name} {qc.performer?.last_name}</td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold ${STATUS_STYLES[qc.result] ?? 'bg-slate-100 text-slate-600'}`}>
                    {qc.result === 'Pass' ? <CheckCircle className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                    {qc.result}
                  </span>
                </td>
                <td className="px-6 py-4 text-slate-500 text-xs italic">{qc.remarks || '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
