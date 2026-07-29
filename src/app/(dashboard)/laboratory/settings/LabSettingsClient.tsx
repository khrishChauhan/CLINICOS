'use client'

import React, { useState } from 'react'
import {
  createReferenceRangeAction, deleteReferenceRangeAction,
  createSpecimenTypeAction, createLabConsumableAction
} from '@/actions/laboratory/labPhase5Actions'
import { Settings, Plus, Trash2, FlaskConical, Package, BookOpen } from 'lucide-react'
import { LaboratoryTabs } from '../LaboratoryTabs'

type Tab = 'ranges' | 'specimens' | 'consumables'

export default function LabSettingsClient({
  referenceRanges: initRanges,
  specimenTypes: initSpecimens,
  consumables: initConsumables
}: {
  referenceRanges: any[]
  specimenTypes: any[]
  consumables: any[]
}) {
  const [activeTab, setActiveTab] = useState<Tab>('ranges')
  const [ranges, setRanges] = useState(initRanges)
  const [specimens, setSpecimens] = useState(initSpecimens)
  const [consumables, setConsumables] = useState(initConsumables)
  const [showForm, setShowForm] = useState(false)
  const [loading, setLoading] = useState(false)

  // Reference Range form
  const [rangeForm, setRangeForm] = useState({
    test_id: '', test_name: '', gender: 'Any', age_from: 0, age_to: 999,
    low_value: 0, high_value: 0, unit: '', parameter_name: '', is_active: true
  })

  // Specimen form
  const [specimenForm, setSpecimenForm] = useState({
    specimen_code: '', specimen_name: '', storage_requirement: '', status: 'Active' as const
  })

  // Consumable form
  const [consumableForm, setConsumableForm] = useState({
    item_code: '', item_name: '', unit: '', minimum_stock: 0, current_stock: 0, status: 'Active' as const
  })

  const handleCreateRange = async (e: React.FormEvent) => {
    e.preventDefault(); setLoading(true)
    const res = await createReferenceRangeAction(rangeForm as any)
    if (res.success) { setRanges(p => [res.data, ...p]); setShowForm(false) }
    setLoading(false)
  }

  const handleDeleteRange = async (id: string) => {
    const res = await deleteReferenceRangeAction(id)
    if (res.success) setRanges(p => p.filter(r => r.id !== id))
  }

  const handleCreateSpecimen = async (e: React.FormEvent) => {
    e.preventDefault(); setLoading(true)
    const res = await createSpecimenTypeAction(specimenForm)
    if (res.success) { setSpecimens(p => [res.data, ...p]); setShowForm(false) }
    setLoading(false)
  }

  const handleCreateConsumable = async (e: React.FormEvent) => {
    e.preventDefault(); setLoading(true)
    const res = await createLabConsumableAction(consumableForm)
    if (res.success) { setConsumables(p => [res.data, ...p]); setShowForm(false) }
    setLoading(false)
  }

  const tabConfig = [
    { key: 'ranges' as Tab, label: 'Reference Ranges', icon: BookOpen, count: ranges.length },
    { key: 'specimens' as Tab, label: 'Specimen Types', icon: FlaskConical, count: specimens.length },
    { key: 'consumables' as Tab, label: 'Consumables', icon: Package, count: consumables.length },
  ]

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <Settings className="w-6 h-6 text-blue-500" /> Lab Settings
          </h1>
          <p className="text-sm text-slate-500">Manage reference ranges, specimen types, and consumables</p>
        </div>
        <button onClick={() => setShowForm(!showForm)}
          className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 text-sm">
          <Plus className="w-4 h-4" /> Add New
        </button>
      </div>

      <LaboratoryTabs />

      {/* Sub-tabs */}
      <div className="flex gap-1 bg-slate-100 rounded-xl p-1 w-fit">
        {tabConfig.map(t => (
          <button key={t.key} onClick={() => { setActiveTab(t.key); setShowForm(false) }}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition ${
              activeTab === t.key ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-800'
            }`}>
            <t.icon className="w-4 h-4" /> {t.label}
            <span className="bg-slate-200 text-slate-600 text-xs px-1.5 py-0.5 rounded-full">{t.count}</span>
          </button>
        ))}
      </div>

      {/* ── REFERENCE RANGES ── */}
      {activeTab === 'ranges' && (
        <>
          {showForm && (
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
              <h3 className="font-bold text-slate-800 mb-4 border-b border-slate-100 pb-3">New Reference Range</h3>
              <form onSubmit={handleCreateRange} className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="col-span-2">
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Test Name *</label>
                  <input required value={rangeForm.test_name} onChange={e => setRangeForm(f => ({ ...f, test_name: e.target.value }))}
                    placeholder="e.g. Haemoglobin" className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Parameter (optional)</label>
                  <input value={rangeForm.parameter_name} onChange={e => setRangeForm(f => ({ ...f, parameter_name: e.target.value }))}
                    placeholder="For composite tests" className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Gender</label>
                  <select value={rangeForm.gender} onChange={e => setRangeForm(f => ({ ...f, gender: e.target.value }))}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm bg-white outline-none">
                    <option>Any</option><option>Male</option><option>Female</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Age From</label>
                  <input type="number" value={rangeForm.age_from} onChange={e => setRangeForm(f => ({ ...f, age_from: +e.target.value }))}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Age To</label>
                  <input type="number" value={rangeForm.age_to} onChange={e => setRangeForm(f => ({ ...f, age_to: +e.target.value }))}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Low Value *</label>
                  <input required type="number" step="0.01" value={rangeForm.low_value} onChange={e => setRangeForm(f => ({ ...f, low_value: +e.target.value }))}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">High Value *</label>
                  <input required type="number" step="0.01" value={rangeForm.high_value} onChange={e => setRangeForm(f => ({ ...f, high_value: +e.target.value }))}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Unit</label>
                  <input value={rangeForm.unit} onChange={e => setRangeForm(f => ({ ...f, unit: e.target.value }))}
                    placeholder="e.g. g/dL" className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm outline-none" />
                </div>
                <div className="col-span-full flex justify-end gap-3 pt-2">
                  <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 text-sm text-slate-600 hover:bg-slate-100 rounded-lg">Cancel</button>
                  <button type="submit" disabled={loading} className="px-5 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold disabled:opacity-50">Save Range</button>
                </div>
              </form>
            </div>
          )}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <table className="w-full text-sm text-left text-slate-600">
              <thead className="bg-slate-50 text-slate-500 border-b border-slate-200">
                <tr>
                  <th className="px-6 py-4 font-semibold">Test / Parameter</th>
                  <th className="px-6 py-4 font-semibold">Gender</th>
                  <th className="px-6 py-4 font-semibold">Age Range</th>
                  <th className="px-6 py-4 font-semibold">Normal Range</th>
                  <th className="px-6 py-4 font-semibold">Unit</th>
                  <th className="px-6 py-4 font-semibold"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {!ranges.length ? (
                  <tr><td colSpan={6} className="px-6 py-12 text-center text-slate-500">No reference ranges defined yet.</td></tr>
                ) : ranges.map(r => (
                  <tr key={r.id} className="hover:bg-slate-50/50">
                    <td className="px-6 py-4">
                      <p className="font-semibold text-slate-800">{r.test_name}</p>
                      {r.parameter_name && <p className="text-xs text-slate-400">{r.parameter_name}</p>}
                    </td>
                    <td className="px-6 py-4">{r.gender}</td>
                    <td className="px-6 py-4">{r.age_from} – {r.age_to} yrs</td>
                    <td className="px-6 py-4 font-mono font-semibold text-blue-700">{r.low_value} – {r.high_value}</td>
                    <td className="px-6 py-4 text-slate-500">{r.unit ?? '—'}</td>
                    <td className="px-6 py-4">
                      <button onClick={() => handleDeleteRange(r.id)} className="text-red-400 hover:text-red-600 transition">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {/* ── SPECIMEN TYPES ── */}
      {activeTab === 'specimens' && (
        <>
          {showForm && (
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
              <h3 className="font-bold text-slate-800 mb-4 border-b border-slate-100 pb-3">New Specimen Type</h3>
              <form onSubmit={handleCreateSpecimen} className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Specimen Code *</label>
                  <input required value={specimenForm.specimen_code} onChange={e => setSpecimenForm(f => ({ ...f, specimen_code: e.target.value }))}
                    placeholder="e.g. BLD" className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Specimen Name *</label>
                  <input required value={specimenForm.specimen_name} onChange={e => setSpecimenForm(f => ({ ...f, specimen_name: e.target.value }))}
                    placeholder="e.g. Whole Blood" className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm outline-none" />
                </div>
                <div className="col-span-2">
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Storage Requirement</label>
                  <input value={specimenForm.storage_requirement} onChange={e => setSpecimenForm(f => ({ ...f, storage_requirement: e.target.value }))}
                    placeholder="e.g. 2-8°C Refrigerated" className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm outline-none" />
                </div>
                <div className="col-span-2 flex justify-end gap-3 pt-2">
                  <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 text-sm text-slate-600 hover:bg-slate-100 rounded-lg">Cancel</button>
                  <button type="submit" disabled={loading} className="px-5 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold disabled:opacity-50">Save</button>
                </div>
              </form>
            </div>
          )}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <table className="w-full text-sm text-left text-slate-600">
              <thead className="bg-slate-50 text-slate-500 border-b border-slate-200">
                <tr>
                  <th className="px-6 py-4 font-semibold">Code</th>
                  <th className="px-6 py-4 font-semibold">Specimen Name</th>
                  <th className="px-6 py-4 font-semibold">Storage Requirement</th>
                  <th className="px-6 py-4 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {!specimens.length ? (
                  <tr><td colSpan={4} className="px-6 py-12 text-center text-slate-500">No specimen types defined yet.</td></tr>
                ) : specimens.map(s => (
                  <tr key={s.id} className="hover:bg-slate-50/50">
                    <td className="px-6 py-4 font-mono font-semibold text-slate-900">{s.specimen_code}</td>
                    <td className="px-6 py-4 font-medium text-slate-800">{s.specimen_name}</td>
                    <td className="px-6 py-4 text-slate-500">{s.storage_requirement ?? '—'}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${s.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-600'}`}>{s.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {/* ── CONSUMABLES ── */}
      {activeTab === 'consumables' && (
        <>
          {showForm && (
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
              <h3 className="font-bold text-slate-800 mb-4 border-b border-slate-100 pb-3">New Consumable</h3>
              <form onSubmit={handleCreateConsumable} className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Item Code *</label>
                  <input required value={consumableForm.item_code} onChange={e => setConsumableForm(f => ({ ...f, item_code: e.target.value }))}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Item Name *</label>
                  <input required value={consumableForm.item_name} onChange={e => setConsumableForm(f => ({ ...f, item_name: e.target.value }))}
                    placeholder="e.g. EDTA Vacutainer" className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Unit</label>
                  <input value={consumableForm.unit} onChange={e => setConsumableForm(f => ({ ...f, unit: e.target.value }))}
                    placeholder="e.g. Pieces" className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Minimum Stock</label>
                  <input type="number" value={consumableForm.minimum_stock} onChange={e => setConsumableForm(f => ({ ...f, minimum_stock: +e.target.value }))}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Current Stock</label>
                  <input type="number" value={consumableForm.current_stock} onChange={e => setConsumableForm(f => ({ ...f, current_stock: +e.target.value }))}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm outline-none" />
                </div>
                <div className="col-span-full flex justify-end gap-3 pt-2">
                  <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 text-sm text-slate-600 hover:bg-slate-100 rounded-lg">Cancel</button>
                  <button type="submit" disabled={loading} className="px-5 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold disabled:opacity-50">Save</button>
                </div>
              </form>
            </div>
          )}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <table className="w-full text-sm text-left text-slate-600">
              <thead className="bg-slate-50 text-slate-500 border-b border-slate-200">
                <tr>
                  <th className="px-6 py-4 font-semibold">Code</th>
                  <th className="px-6 py-4 font-semibold">Item Name</th>
                  <th className="px-6 py-4 font-semibold">Unit</th>
                  <th className="px-6 py-4 font-semibold">Min. Stock</th>
                  <th className="px-6 py-4 font-semibold">Current Stock</th>
                  <th className="px-6 py-4 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {!consumables.length ? (
                  <tr><td colSpan={6} className="px-6 py-12 text-center text-slate-500">No consumables registered yet.</td></tr>
                ) : consumables.map(c => (
                  <tr key={c.id} className={`hover:bg-slate-50/50 ${c.current_stock < c.minimum_stock ? 'bg-red-50/30' : ''}`}>
                    <td className="px-6 py-4 font-mono font-semibold text-slate-900">{c.item_code}</td>
                    <td className="px-6 py-4 font-medium text-slate-800">{c.item_name}</td>
                    <td className="px-6 py-4 text-slate-500">{c.unit ?? '—'}</td>
                    <td className="px-6 py-4">{c.minimum_stock}</td>
                    <td className={`px-6 py-4 font-bold ${c.current_stock < c.minimum_stock ? 'text-red-600' : 'text-slate-800'}`}>{c.current_stock}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${c.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-600'}`}>{c.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  )
}
