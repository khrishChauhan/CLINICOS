'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createLabOrderAction } from '@/actions/laboratory/labOrderActions'
import { getMasterDataAction } from '@/actions/master/masterActions'
import { ArrowLeft, Save, Plus, Trash2, AlertCircle } from 'lucide-react'
import Link from 'next/link'

export default function NewLabOrderPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [testsMaster, setTestsMaster] = useState<any[]>([])

  // Basic form state
  const [patientId, setPatientId] = useState('')
  const [doctorId, setDoctorId] = useState('')
  const [visitId, setVisitId] = useState('')
  const [priority, setPriority] = useState<'Routine' | 'Urgent' | 'Stat'>('Routine')
  const [remarks, setRemarks] = useState('')
  const [items, setItems] = useState([{ test_id: '', test_name: '', sample_type: '', remarks: '' }])

  useEffect(() => {
    getMasterDataAction('laboratory_tests').then(res => {
      if (res.success && res.data) setTestsMaster(res.data)
    })
  }, [])

  const addItem = () => setItems([...items, { test_id: '', test_name: '', sample_type: '', remarks: '' }])
  const removeItem = (idx: number) => setItems(items.filter((_, i) => i !== idx))

  const updateItem = (idx: number, field: string, val: string) => {
    const newItems = [...items]
    const item = { ...newItems[idx], [field]: val }
    
    // Auto fill test_name if test_id changes
    if (field === 'test_id') {
      const match = testsMaster.find(t => t.id === val)
      if (match) item.test_name = match.test_name || match.generic_name || match.name || match.title || 'Unknown Test'
    }
    
    newItems[idx] = item
    setItems(newItems)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    
    const res = await createLabOrderAction({
      patient_id: patientId,
      visit_id: visitId,
      doctor_id: doctorId,
      priority,
      remarks,
      items: items.filter(i => i.test_id)
    })

    if (res.success) {
      router.push('/laboratory')
    } else {
      setError(res.error || 'Failed to create lab order')
      setLoading(false)
    }
  }

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/laboratory" className="p-2 bg-white text-slate-500 hover:text-slate-900 border border-slate-200 rounded-lg transition shadow-sm">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-slate-900">New Lab Order</h1>
          <p className="text-sm text-slate-500">Create a new laboratory order and clinical order reference</p>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-xl flex gap-3 text-red-800 text-sm">
          <AlertCircle className="w-5 h-5 text-red-500 shrink-0" />
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Core Order Info */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-6">
          <h2 className="text-lg font-bold text-slate-800 border-b border-slate-100 pb-3">Order Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Patient ID *</label>
              <input type="text" required value={patientId} onChange={e=>setPatientId(e.target.value)} className="w-full px-4 py-2 border rounded-lg text-sm" placeholder="UUID" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Doctor ID *</label>
              <input type="text" required value={doctorId} onChange={e=>setDoctorId(e.target.value)} className="w-full px-4 py-2 border rounded-lg text-sm" placeholder="UUID" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Visit ID *</label>
              <input type="text" required value={visitId} onChange={e=>setVisitId(e.target.value)} className="w-full px-4 py-2 border rounded-lg text-sm" placeholder="UUID" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Priority</label>
              <select value={priority} onChange={e=>setPriority(e.target.value as any)} className="w-full px-4 py-2 border rounded-lg text-sm bg-white">
                <option value="Routine">Routine</option>
                <option value="Urgent">Urgent</option>
                <option value="Stat">Stat</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Remarks</label>
            <textarea value={remarks} onChange={e=>setRemarks(e.target.value)} className="w-full px-4 py-2 border rounded-lg text-sm min-h-[80px]" placeholder="Optional notes for the lab..." />
          </div>
        </div>

        {/* Lab Tests */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h2 className="text-lg font-bold text-slate-800">Laboratory Tests</h2>
            <button type="button" onClick={addItem} className="inline-flex items-center gap-2 text-sm font-semibold text-blue-600 hover:text-blue-800">
              <Plus className="w-4 h-4" /> Add Test
            </button>
          </div>
          
          <div className="space-y-4">
            {items.map((item, idx) => (
              <div key={idx} className="flex flex-col md:flex-row gap-4 items-start bg-slate-50 p-4 rounded-lg border border-slate-200">
                <div className="flex-1">
                  <label className="block text-xs font-semibold text-slate-500 mb-1">Test *</label>
                  <select required value={item.test_id} onChange={e=>updateItem(idx, 'test_id', e.target.value)} className="w-full px-3 py-2 border rounded-lg text-sm bg-white">
                    <option value="">Select a test...</option>
                    {testsMaster.map(t => (
                      <option key={t.id} value={t.id}>{t.test_name || t.generic_name || t.name || t.title}</option>
                    ))}
                  </select>
                </div>
                <div className="w-full md:w-48">
                  <label className="block text-xs font-semibold text-slate-500 mb-1">Sample Type</label>
                  <input type="text" value={item.sample_type} onChange={e=>updateItem(idx, 'sample_type', e.target.value)} className="w-full px-3 py-2 border rounded-lg text-sm" placeholder="e.g. Blood" />
                </div>
                <div className="flex-1">
                  <label className="block text-xs font-semibold text-slate-500 mb-1">Remarks</label>
                  <input type="text" value={item.remarks} onChange={e=>updateItem(idx, 'remarks', e.target.value)} className="w-full px-3 py-2 border rounded-lg text-sm" placeholder="Optional..." />
                </div>
                {items.length > 1 && (
                  <button type="button" onClick={() => removeItem(idx)} className="mt-6 p-2 text-slate-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition">
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-end pt-4">
          <button type="submit" disabled={loading} className="inline-flex items-center gap-2 bg-blue-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-blue-700 transition disabled:opacity-50">
            <Save className="w-5 h-5" />
            {loading ? 'Creating Order...' : 'Submit Order'}
          </button>
        </div>
      </form>
    </div>
  )
}
