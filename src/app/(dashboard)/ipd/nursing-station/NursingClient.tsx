'use client'

import React, { useState } from 'react'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { toast } from 'sonner'
import { logNursingVitalsAction } from '@/actions/ipd/ipdActions'
import dayjs from 'dayjs'

export function NursingClient({ admission }: { admission: any }) {
  const [expanded, setExpanded] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [vitals, setVitals] = useState({
    heart_rate: '',
    blood_pressure_systolic: '',
    blood_pressure_diastolic: '',
    temperature_celsius: '',
    spo2: '',
    respiratory_rate: '',
    remarks: ''
  })

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    const parsedVitals = {
      heart_rate: vitals.heart_rate ? parseInt(vitals.heart_rate) : null,
      blood_pressure_systolic: vitals.blood_pressure_systolic ? parseInt(vitals.blood_pressure_systolic) : null,
      blood_pressure_diastolic: vitals.blood_pressure_diastolic ? parseInt(vitals.blood_pressure_diastolic) : null,
      temperature_celsius: vitals.temperature_celsius ? parseFloat(vitals.temperature_celsius) : null,
      spo2: vitals.spo2 ? parseInt(vitals.spo2) : null,
      respiratory_rate: vitals.respiratory_rate ? parseInt(vitals.respiratory_rate) : null,
      remarks: vitals.remarks
    }

    const res = await logNursingVitalsAction(admission.id, parsedVitals)
    setIsSubmitting(false)
    if (res.ok) {
      toast.success('Vitals logged successfully!')
      setVitals({
        heart_rate: '', blood_pressure_systolic: '', blood_pressure_diastolic: '', 
        temperature_celsius: '', spo2: '', respiratory_rate: '', remarks: ''
      })
    } else {
      toast.error(res.error)
    }
  }

  const activeBed = admission.bed_allocations?.find((ba: any) => !ba.end_time)

  return (
    <Card className="p-6">
      <div className="flex justify-between items-center cursor-pointer" onClick={() => setExpanded(!expanded)}>
        <div className="flex flex-col">
          <div className="flex items-center gap-3">
            <h3 className="text-xl font-bold text-slate-800">
              {admission.patient?.first_name} {admission.patient?.last_name}
            </h3>
            {activeBed && (
              <Badge variant="info" className="bg-emerald-50 text-emerald-700">
                {activeBed.bed?.ward?.name} - Bed {activeBed.bed?.bed_number}
              </Badge>
            )}
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Admitted: {dayjs(admission.admission_date).format('DD MMM YYYY, HH:mm')} | Dr. {admission.doctor?.last_name}
          </p>
        </div>
        <Button variant="outline">{expanded ? 'Hide Details' : 'Record Vitals'}</Button>
      </div>

      {expanded && (
        <div className="mt-6 pt-6 border-t border-slate-100 grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Vitals Form */}
          <div className="bg-slate-50 p-5 rounded-xl border border-slate-200">
            <h4 className="font-semibold text-slate-800 mb-4">New Vitals Reading</h4>
            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-600">Heart Rate (bpm)</label>
                  <input type="number" className="w-full p-2 text-sm border rounded-lg" value={vitals.heart_rate} onChange={e => setVitals({...vitals, heart_rate: e.target.value})} />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-600">SpO2 (%)</label>
                  <input type="number" className="w-full p-2 text-sm border rounded-lg" value={vitals.spo2} onChange={e => setVitals({...vitals, spo2: e.target.value})} />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-600">BP Systolic</label>
                  <input type="number" className="w-full p-2 text-sm border rounded-lg" value={vitals.blood_pressure_systolic} onChange={e => setVitals({...vitals, blood_pressure_systolic: e.target.value})} />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-600">BP Diastolic</label>
                  <input type="number" className="w-full p-2 text-sm border rounded-lg" value={vitals.blood_pressure_diastolic} onChange={e => setVitals({...vitals, blood_pressure_diastolic: e.target.value})} />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-600">Temp (°C)</label>
                  <input type="number" step="0.1" className="w-full p-2 text-sm border rounded-lg" value={vitals.temperature_celsius} onChange={e => setVitals({...vitals, temperature_celsius: e.target.value})} />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-600">Resp. Rate</label>
                  <input type="number" className="w-full p-2 text-sm border rounded-lg" value={vitals.respiratory_rate} onChange={e => setVitals({...vitals, respiratory_rate: e.target.value})} />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600">Remarks / Nursing Notes</label>
                <textarea className="w-full p-2 text-sm border rounded-lg h-20" value={vitals.remarks} onChange={e => setVitals({...vitals, remarks: e.target.value})} />
              </div>
              <Button type="submit" disabled={isSubmitting} className="w-full">
                {isSubmitting ? 'Saving...' : 'Save Vitals'}
              </Button>
            </form>
          </div>

          {/* Vitals History */}
          <div>
            <h4 className="font-semibold text-slate-800 mb-4">Vitals History</h4>
            <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
              {(!admission.vitals || admission.vitals.length === 0) ? (
                <p className="text-sm text-slate-500 italic">No vitals recorded yet.</p>
              ) : (
                admission.vitals.map((v: any) => (
                  <div key={v.id} className="p-3 bg-white border border-slate-200 rounded-lg text-sm shadow-sm">
                    <div className="flex justify-between items-center mb-2 border-b border-slate-100 pb-1">
                      <span className="font-medium text-blue-700">{dayjs(v.timestamp).format('DD MMM, HH:mm')}</span>
                    </div>
                    <div className="grid grid-cols-2 gap-1 text-slate-600">
                      {v.heart_rate && <span>HR: {v.heart_rate} bpm</span>}
                      {v.spo2 && <span>SpO2: {v.spo2}%</span>}
                      {v.blood_pressure_systolic && v.blood_pressure_diastolic && <span>BP: {v.blood_pressure_systolic}/{v.blood_pressure_diastolic}</span>}
                      {v.temperature_celsius && <span>Temp: {v.temperature_celsius}°C</span>}
                    </div>
                    {v.remarks && <p className="mt-2 pt-2 border-t border-slate-50 text-xs italic">Note: {v.remarks}</p>}
                  </div>
                ))
              )}
            </div>
          </div>

        </div>
      )}
    </Card>
  )
}
