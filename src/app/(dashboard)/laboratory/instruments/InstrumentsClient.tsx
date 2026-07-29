'use client'

import React, { useState } from 'react'
import { createLabInstrumentAction, updateInstrumentStatusAction } from '@/actions/laboratory/labOperationsActions'
import { Cpu, Plus, Search } from 'lucide-react'
import dayjs from 'dayjs'
import { LaboratoryTabs } from '../LaboratoryTabs'

const STATUS_STYLES: Record<string, string> = {
  'Active': 'bg-green-100 text-green-700',
  'Inactive': 'bg-slate-100 text-slate-600',
  'Under Maintenance': 'bg-amber-100 text-amber-700',
  'Decommissioned': 'bg-red-100 text-red-700',
}

export default function InstrumentsClient({ instruments: initial }: { instruments: any[] }) {
  const [instruments, setInstruments] = useState(initial)
  const [showForm, setShowForm] = useState(false)
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    instrument_code: '', instrument_name: '', manufacturer: '', model: '',
    serial_number: '', status: 'Active' as const
  })

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault(); setLoading(true)
    const res = await createLabInstrumentAction({ ...form, status: form.status as any })
    if (res.success) {
      setInstruments(prev => [res.data, ...prev])
      setShowForm(false)
      setForm({ instrument_code: '', instrument_name: '', manufacturer: '', model: '', serial_number: '', status: 'Active' })
    }
    setLoading(false)
  }

  const handleStatusChange = async (id: string, status: string) => {
    const res = await updateInstrumentStatusAction(id, status)
    if (res.success) {
      setInstruments(prev => prev.map(i => i.id === id ? { ...i, status } : i))
    }
  }

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Lab Instruments</h1>
          <p className="text-sm text-slate-500">Manage laboratory analyzers and equipment</p>
        </div>
        <button onClick={() => setShowForm(true)}
          className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 text-sm transition">
          <Plus className="w-4 h-4" /> Register Instrument
        </button>
      </div>

      <LaboratoryTabs />

      {showForm && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
          <h2 className="text-base font-bold text-slate-800 mb-4 border-b border-slate-100 pb-3">New Instrument</h2>
          <form onSubmit={handleCreate} className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {[
              { field: 'instrument_code', label: 'Instrument Code *', placeholder: 'e.g. BC-620' },
              { field: 'instrument_name', label: 'Instrument Name *', placeholder: 'e.g. Hematology Analyzer' },
              { field: 'manufacturer', label: 'Manufacturer', placeholder: 'e.g. Mindray' },
              { field: 'model', label: 'Model', placeholder: 'e.g. BC-620 Pro' },
              { field: 'serial_number', label: 'Serial Number', placeholder: '' },
            ].map(({ field, label, placeholder }) => (
              <div key={field}>
                <label className="block text-xs font-semibold text-slate-600 mb-1">{label}</label>
                <input
                  type="text"
                  value={(form as any)[field]}
                  onChange={e => setForm(f => ({ ...f, [field]: e.target.value }))}
                  placeholder={placeholder}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500"
                  required={field === 'instrument_code' || field === 'instrument_name'}
                />
              </div>
            ))}
            <div className="col-span-full flex justify-end gap-3 pt-2">
              <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 text-sm text-slate-600 hover:bg-slate-100 rounded-lg">Cancel</button>
              <button type="submit" disabled={loading} className="px-5 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 disabled:opacity-50">
                Save Instrument
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-4 border-b border-slate-200 bg-slate-50">
          <div className="relative w-full max-w-sm">
            <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
            <input type="text" placeholder="Search instruments..." className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg text-sm outline-none" />
          </div>
        </div>
        <table className="w-full text-sm text-left text-slate-600">
          <thead className="bg-slate-50 text-slate-500 border-b border-slate-200">
            <tr>
              <th className="px-6 py-4 font-semibold">Code</th>
              <th className="px-6 py-4 font-semibold">Name</th>
              <th className="px-6 py-4 font-semibold">Manufacturer</th>
              <th className="px-6 py-4 font-semibold">Model</th>
              <th className="px-6 py-4 font-semibold">Serial No.</th>
              <th className="px-6 py-4 font-semibold">Status</th>
              <th className="px-6 py-4 font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {!instruments.length ? (
              <tr><td colSpan={7} className="px-6 py-12 text-center">
                <Cpu className="w-10 h-10 text-slate-300 mx-auto mb-3" />
                <p className="font-medium text-slate-800">No instruments registered</p>
              </td></tr>
            ) : instruments.map(inst => (
              <tr key={inst.id} className="hover:bg-slate-50/50 transition">
                <td className="px-6 py-4 font-mono font-semibold text-slate-900">{inst.instrument_code}</td>
                <td className="px-6 py-4 font-medium text-slate-800">{inst.instrument_name}</td>
                <td className="px-6 py-4">{inst.manufacturer ?? '—'}</td>
                <td className="px-6 py-4">{inst.model ?? '—'}</td>
                <td className="px-6 py-4 font-mono text-xs text-slate-500">{inst.serial_number ?? '—'}</td>
                <td className="px-6 py-4">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${STATUS_STYLES[inst.status] ?? ''}`}>{inst.status}</span>
                </td>
                <td className="px-6 py-4">
                  <select value={inst.status} onChange={e => handleStatusChange(inst.id, e.target.value)}
                    className="text-xs border border-slate-300 rounded-lg px-2 py-1 bg-white outline-none">
                    <option>Active</option>
                    <option>Inactive</option>
                    <option>Under Maintenance</option>
                    <option>Decommissioned</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
