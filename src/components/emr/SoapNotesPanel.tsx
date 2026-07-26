'use client'

import React, { useState, useEffect, useCallback, useRef } from 'react'
import { getSoapNoteAction, saveSoapNoteAction } from '@/actions/emr/soapActions'
import { Button } from '@/components/ui/Button'
import type { SoapNoteRow } from '@/types/emr'

const SOAP_FIELDS: { key: keyof Pick<SoapNoteRow, 'subjective' | 'objective' | 'assessment' | 'plan'>; label: string; description: string }[] = [
  { key: 'subjective', label: 'S — Subjective', description: "Patient's own description of their symptoms, history, and concerns." },
  { key: 'objective', label: 'O — Objective', description: 'Clinical findings from physical examination, observations, and measurements.' },
  { key: 'assessment', label: 'A — Assessment', description: "Doctor's clinical assessment and differential diagnosis." },
  { key: 'plan', label: 'P — Plan', description: 'Proposed treatment plan, medications, follow-up instructions.' },
]

export default function SoapNotesPanel({ visitId }: { visitId: string }) {
  const [soap, setSoap] = useState<SoapNoteRow | null>(null)
  const [form, setForm] = useState({ subjective: '', objective: '', assessment: '', plan: '' })
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const autoSaveRef = useRef<NodeJS.Timeout | null>(null)

  const loadSoap = useCallback(async () => {
    const res = await getSoapNoteAction(visitId)
    if (res.success && res.data) {
      setSoap(res.data)
      setForm({
        subjective: res.data.subjective || '',
        objective: res.data.objective || '',
        assessment: res.data.assessment || '',
        plan: res.data.plan || ''
      })
    }
  }, [visitId])

  useEffect(() => { loadSoap() }, [loadSoap])

  // Auto-save with 2-second debounce
  const triggerAutoSave = (updatedForm: typeof form) => {
    if (autoSaveRef.current) clearTimeout(autoSaveRef.current)
    autoSaveRef.current = setTimeout(async () => {
      setSaving(true)
      const res = await saveSoapNoteAction(visitId, updatedForm)
      if (res.success) {
        setSaved(true)
        setTimeout(() => setSaved(false), 2000)
      }
      setSaving(false)
    }, 2000)
  }

  const handleChange = (key: string, value: string) => {
    const updated = { ...form, [key]: value }
    setForm(updated)
    triggerAutoSave(updated)
  }

  const handleManualSave = async () => {
    if (autoSaveRef.current) clearTimeout(autoSaveRef.current)
    setSaving(true)
    await saveSoapNoteAction(visitId, form)
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <p className="text-sm text-slate-500">SOAP notes auto-save as you type.</p>
        <div className="flex items-center gap-2">
          {saving && <span className="text-xs text-slate-400 animate-pulse">Saving...</span>}
          {saved && <span className="text-xs text-green-600 font-semibold">✓ Saved</span>}
          <Button variant="outline" size="sm" onClick={handleManualSave} disabled={saving}>
            Save Now
          </Button>
        </div>
      </div>

      {SOAP_FIELDS.map(f => (
        <div key={f.key} className="space-y-1">
          <label className="block font-semibold text-slate-700">{f.label}</label>
          <p className="text-xs text-slate-400">{f.description}</p>
          <textarea
            value={form[f.key]}
            onChange={e => handleChange(f.key, e.target.value)}
            rows={4}
            className="w-full border border-slate-300 rounded-xl p-3 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 resize-y bg-white"
            placeholder={`Enter ${f.label.split(' — ')[1]} notes...`}
          />
        </div>
      ))}
    </div>
  )
}
