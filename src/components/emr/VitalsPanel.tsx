'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { getVitalsAction, recordVitalsAction } from '@/actions/emr/vitalsActions'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import type { VitalsRow } from '@/types/emr'

interface VitalField {
  key: keyof Omit<VitalsRow, 'id' | 'clinic_id' | 'visit_id' | 'bmi' | 'recorded_by' | 'recorded_at'>
  label: string
  unit: string
  step?: string
  min?: number
  max?: number
}

const VITAL_FIELDS: VitalField[] = [
  { key: 'height_cm', label: 'Height', unit: 'cm', step: '0.1', min: 0, max: 300 },
  { key: 'weight_kg', label: 'Weight', unit: 'kg', step: '0.1', min: 0, max: 500 },
  { key: 'temperature_c', label: 'Temperature', unit: '°C', step: '0.1', min: 30, max: 45 },
  { key: 'pulse_rate', label: 'Pulse Rate', unit: 'bpm', min: 0, max: 300 },
  { key: 'respiratory_rate', label: 'Respiratory Rate', unit: '/min', min: 0, max: 60 },
  { key: 'oxygen_saturation', label: 'SpO₂', unit: '%', step: '0.1', min: 50, max: 100 },
  { key: 'blood_pressure_systolic', label: 'BP Systolic', unit: 'mmHg', min: 0, max: 300 },
  { key: 'blood_pressure_diastolic', label: 'BP Diastolic', unit: 'mmHg', min: 0, max: 200 },
  { key: 'blood_sugar', label: 'Blood Sugar', unit: 'mg/dL', step: '0.1', min: 0, max: 1000 },
  { key: 'pain_score', label: 'Pain Score', unit: '/10', min: 0, max: 10 },
]

function calculateBmi(h: number | null, w: number | null): string {
  if (!h || !w || h <= 0) return '—'
  const bmi = w / ((h / 100) ** 2)
  return bmi.toFixed(1)
}

export default function VitalsPanel({ visitId }: { visitId: string }) {
  const [history, setHistory] = useState<VitalsRow[]>([])
  const [form, setForm] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(false)
  const [saved, setSaved] = useState(false)

  const loadVitals = useCallback(async () => {
    const res = await getVitalsAction(visitId)
    if (res.success && res.data) setHistory(res.data)
  }, [visitId])

  useEffect(() => { loadVitals() }, [loadVitals])

  const liveBmi = calculateBmi(
    form.height_cm ? parseFloat(form.height_cm) : null,
    form.weight_kg ? parseFloat(form.weight_kg) : null
  )

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    const payload: any = {}
    VITAL_FIELDS.forEach(f => {
      if (form[f.key] !== undefined && form[f.key] !== '') {
        payload[f.key] = parseFloat(form[f.key])
      }
    })
    const res = await recordVitalsAction(visitId, payload)
    if (res.success) {
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
      setForm({})
      await loadVitals()
    }
    setLoading(false)
  }

  const latest = history[0]

  return (
    <div className="space-y-6">
      {/* Latest Vitals Summary */}
      {latest && (
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-100">
          <h4 className="text-xs font-bold text-blue-700 uppercase mb-3">Latest Recorded Vitals</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3">
            {latest.height_cm && <div className="text-center"><div className="text-lg font-bold text-slate-800">{latest.height_cm}</div><div className="text-xs text-slate-500">Height (cm)</div></div>}
            {latest.weight_kg && <div className="text-center"><div className="text-lg font-bold text-slate-800">{latest.weight_kg}</div><div className="text-xs text-slate-500">Weight (kg)</div></div>}
            {latest.bmi && <div className="text-center"><div className="text-lg font-bold text-indigo-700">{latest.bmi}</div><div className="text-xs text-slate-500">BMI</div></div>}
            {latest.temperature_c && <div className="text-center"><div className="text-lg font-bold text-slate-800">{latest.temperature_c}°C</div><div className="text-xs text-slate-500">Temp</div></div>}
            {latest.pulse_rate && <div className="text-center"><div className="text-lg font-bold text-red-600">{latest.pulse_rate}</div><div className="text-xs text-slate-500">Pulse (bpm)</div></div>}
            {latest.oxygen_saturation && <div className="text-center"><div className="text-lg font-bold text-blue-600">{latest.oxygen_saturation}%</div><div className="text-xs text-slate-500">SpO₂</div></div>}
            {(latest.blood_pressure_systolic && latest.blood_pressure_diastolic) && <div className="text-center"><div className="text-lg font-bold text-slate-800">{latest.blood_pressure_systolic}/{latest.blood_pressure_diastolic}</div><div className="text-xs text-slate-500">BP (mmHg)</div></div>}
            {latest.blood_sugar && <div className="text-center"><div className="text-lg font-bold text-amber-600">{latest.blood_sugar}</div><div className="text-xs text-slate-500">Sugar (mg/dL)</div></div>}
            {latest.pain_score !== null && <div className="text-center"><div className="text-lg font-bold text-orange-600">{latest.pain_score}/10</div><div className="text-xs text-slate-500">Pain Score</div></div>}
          </div>
        </div>
      )}

      {/* Record New Vitals */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <h4 className="font-semibold text-slate-700">Record New Vitals</h4>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {VITAL_FIELDS.map(f => (
            <div key={f.key}>
              <label className="text-xs font-semibold text-slate-500 uppercase">{f.label} ({f.unit})</label>
              <Input
                type="number"
                step={f.step || '1'}
                min={f.min}
                max={f.max}
                value={form[f.key] || ''}
                onChange={e => setForm({ ...form, [f.key]: e.target.value })}
                placeholder="—"
                className="mt-1"
              />
            </div>
          ))}
        </div>
        {/* Live BMI Preview */}
        {(form.height_cm || form.weight_kg) && (
          <div className="flex items-center gap-2 p-3 bg-indigo-50 rounded-lg border border-indigo-100 text-sm">
            <span className="text-indigo-600 font-semibold">Auto BMI:</span>
            <span className="font-bold text-indigo-800">{liveBmi}</span>
            <span className="text-indigo-500 text-xs">(calculated automatically on save)</span>
          </div>
        )}
        <Button type="submit" disabled={loading}>
          {loading ? 'Recording...' : saved ? '✓ Saved!' : 'Record Vitals'}
        </Button>
      </form>
    </div>
  )
}
