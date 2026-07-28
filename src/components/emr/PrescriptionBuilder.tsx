'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { getPrescriptionAction, savePrescriptionAction, addPrescriptionItemAction, deletePrescriptionItemAction } from '@/actions/emr/prescriptionActions'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import PrescriptionPrintView from './PrescriptionPrintView'
import { getMasterDataAction } from '@/actions/master/masterActions'
import type { PrescriptionRow, PrescriptionItemRow } from '@/types/emr'
import type { MasterMedicine, MasterFrequency, MasterUnitOfMeasure, MasterRouteOfAdministration } from '@/types/master'

interface MedicineForm {
  medicine_name: string
  dosage: string
  frequency: string
  duration: string
  quantity: string
  route: string
  before_after_food: string
  instructions: string
}

const BLANK_MED: MedicineForm = {
  medicine_name: '', dosage: '', frequency: '', duration: '',
  quantity: '', route: 'Oral', before_after_food: 'After Food', instructions: ''
}

interface PrescriptionBuilderProps {
  visitId: string
  doctorId: string
  patientName?: string
  doctorName?: string
  clinicName?: string
}

export default function PrescriptionBuilder({ visitId, doctorId, patientName, doctorName, clinicName }: PrescriptionBuilderProps) {
  const [prescription, setPrescription] = useState<PrescriptionRow | null>(null)
  const [items, setItems] = useState<PrescriptionItemRow[]>([])
  const [addingMed, setAddingMed] = useState(false)
  const [medForm, setMedForm] = useState<MedicineForm>({ ...BLANK_MED })
  const [advice, setAdvice] = useState('')
  const [dietaryAdvice, setDietaryAdvice] = useState('')
  const [nextVisit, setNextVisit] = useState('')
  const [saving, setSaving] = useState(false)
  const [showPrint, setShowPrint] = useState(false)

  const [masterMedicines, setMasterMedicines] = useState<MasterMedicine[]>([])
  const [masterFrequencies, setMasterFrequencies] = useState<MasterFrequency[]>([])
  const [masterUnits, setMasterUnits] = useState<MasterUnitOfMeasure[]>([])
  const [masterRoutes, setMasterRoutes] = useState<MasterRouteOfAdministration[]>([])

  const loadPrescription = useCallback(async () => {
    const res = await getPrescriptionAction(visitId, doctorId)
    if (res.success && res.data) {
      setPrescription(res.data.prescription)
      setItems(res.data.items)
      setAdvice(res.data.prescription.advice || '')
      setDietaryAdvice(res.data.prescription.dietary_advice || '')
      setNextVisit(res.data.prescription.next_visit || '')
    }
  }, [visitId, doctorId])

  useEffect(() => { 
    loadPrescription() 
    getMasterDataAction<MasterMedicine>('medicines').then(res => res.success && res.data && setMasterMedicines(res.data))
    getMasterDataAction<MasterFrequency>('frequencies').then(res => res.success && res.data && setMasterFrequencies(res.data))
    getMasterDataAction<MasterUnitOfMeasure>('units_of_measure').then(res => res.success && res.data && setMasterUnits(res.data))
    getMasterDataAction<MasterRouteOfAdministration>('routes_of_administration').then(res => res.success && res.data && setMasterRoutes(res.data))
  }, [loadPrescription])

  const handleSave = async () => {
    setSaving(true)
    await savePrescriptionAction(visitId, doctorId, {
      advice: advice || undefined,
      dietary_advice: dietaryAdvice || undefined,
      next_visit: nextVisit || undefined
    })
    setSaving(false)
  }

  const handleAddMedicine = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!prescription || !medForm.medicine_name.trim()) return
    const res = await addPrescriptionItemAction(prescription.id, {
      medicine_name: medForm.medicine_name,
      dosage: medForm.dosage || undefined,
      frequency: medForm.frequency || undefined,
      duration: medForm.duration || undefined,
      quantity: medForm.quantity ? parseInt(medForm.quantity) : undefined,
      route: medForm.route || undefined,
      before_after_food: medForm.before_after_food || undefined,
      instructions: medForm.instructions || undefined,
      master_medicine_id: masterMedicines.find(m => m.generic_name === medForm.medicine_name || m.brand_name === medForm.medicine_name)?.id,
      master_frequency_id: masterFrequencies.find(f => f.frequency_name === medForm.frequency)?.id,
      master_route_id: masterRoutes.find(r => r.route_name === medForm.route)?.id
    })
    if (res.success && res.data) {
      setItems(prev => [...prev, res.data!])
      setMedForm({ ...BLANK_MED })
      setAddingMed(false)
    }
  }

  const handleDeleteItem = async (itemId: string) => {
    const res = await deletePrescriptionItemAction(itemId)
    if (res.success) setItems(prev => prev.filter(i => i.id !== itemId))
  }

  return (
    <div className="space-y-6">
      {/* Prescription Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        {prescription && (
          <div className="text-xs text-slate-500">
            Rx ID: <span className="font-mono font-semibold text-slate-700">{prescription.id.slice(0, 8).toUpperCase()}</span>
            {' · '}Date: <strong>{prescription.prescription_date}</strong>
            {prescription.digital_signature && (
              <span className="ml-2 text-green-600 font-semibold">✓ Signature Attached</span>
            )}
          </div>
        )}
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => { handleSave(); setShowPrint(true) }}>
            🖨️ Print / Export PDF
          </Button>
        </div>
      </div>

      {/* Medicine Table */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h4 className="font-semibold text-slate-700 flex items-center gap-1">
            <span className="text-blue-700 font-serif italic text-xl">Rx</span> Medicines
          </h4>
          <Button size="sm" onClick={() => setAddingMed(true)} disabled={addingMed}>+ Add Medicine</Button>
        </div>
        <div className="rounded-xl border border-slate-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="text-left p-3 text-xs font-semibold text-slate-500 uppercase">Medicine</th>
                <th className="text-left p-3 text-xs font-semibold text-slate-500 uppercase">Dosage</th>
                <th className="text-left p-3 text-xs font-semibold text-slate-500 uppercase">Frequency</th>
                <th className="text-left p-3 text-xs font-semibold text-slate-500 uppercase">Duration</th>
                <th className="text-left p-3 text-xs font-semibold text-slate-500 uppercase">Instructions</th>
                <th className="p-3"></th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, i) => (
                <tr key={item.id} className={`border-b border-slate-100 ${i % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'}`}>
                  <td className="p-3 font-medium text-slate-800">{item.medicine_name}</td>
                  <td className="p-3 text-slate-600">{item.dosage || '—'}</td>
                  <td className="p-3 text-slate-600">{item.frequency || '—'}</td>
                  <td className="p-3 text-slate-600">{item.duration || '—'}</td>
                  <td className="p-3 text-slate-500 text-xs">
                    {[item.before_after_food, item.route, item.instructions].filter(Boolean).join(' · ') || '—'}
                  </td>
                  <td className="p-3 text-center">
                    <button type="button" onClick={() => handleDeleteItem(item.id)} className="text-slate-400 hover:text-red-500 transition-colors">&times;</button>
                  </td>
                </tr>
              ))}
              {items.length === 0 && (
                <tr><td colSpan={6} className="p-6 text-center text-slate-400 text-sm">No medicines added yet.</td></tr>
              )}
              {/* Inline Add Medicine Row */}
              {addingMed && (
                <tr className="border-b border-blue-100 bg-blue-50/30">
                  <td className="p-2">
                    <Input required list="medicine-list" value={medForm.medicine_name} onChange={e => setMedForm({...medForm, medicine_name: e.target.value})} placeholder="Medicine name *" />
                    <datalist id="medicine-list">
                      {masterMedicines.map(m => (
                        <option key={m.id} value={m.generic_name}>{m.brand_name ? `(${m.brand_name})` : ''}</option>
                      ))}
                    </datalist>
                  </td>
                  <td className="p-2">
                    <Input value={medForm.dosage} onChange={e => setMedForm({...medForm, dosage: e.target.value})} placeholder="e.g. 500mg" />
                  </td>
                  <td className="p-2">
                    <Input list="freq-list" value={medForm.frequency} onChange={e => setMedForm({...medForm, frequency: e.target.value})} placeholder="e.g. 1-0-1 or OD" />
                    <datalist id="freq-list">
                      {masterFrequencies.map(f => (
                        <option key={f.id} value={f.frequency_name}>{f.instructions}</option>
                      ))}
                    </datalist>
                  </td>
                  <td className="p-2"><Input value={medForm.duration} onChange={e => setMedForm({...medForm, duration: e.target.value})} placeholder="e.g. 5 Days" /></td>
                  <td className="p-2">
                    <select className="w-full border border-slate-300 rounded-lg p-2 text-xs outline-none mb-1" value={medForm.route} onChange={e => setMedForm({...medForm, route: e.target.value})}>
                      {masterRoutes.length > 0 ? masterRoutes.map(r => (
                        <option key={r.id} value={r.route_name}>{r.route_name}</option>
                      )) : (
                        <>
                          <option>Oral</option>
                          <option>IV</option>
                          <option>Topical</option>
                        </>
                      )}
                    </select>
                    <select className="w-full border border-slate-300 rounded-lg p-2 text-xs outline-none" value={medForm.before_after_food} onChange={e => setMedForm({...medForm, before_after_food: e.target.value})}>
                      <option>After Food</option>
                      <option>Before Food</option>
                      <option>With Food</option>
                      <option>At Bedtime</option>
                    </select>
                  </td>
                  <td className="p-2">
                    <div className="flex gap-1">
                      <Button size="sm" onClick={handleAddMedicine as any}>✓</Button>
                      <Button size="sm" variant="outline" onClick={() => { setAddingMed(false); setMedForm({...BLANK_MED}) }}>✕</Button>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Advice & Follow-up */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Advice / Instructions</label>
          <textarea rows={3} value={advice} onChange={e => setAdvice(e.target.value)} placeholder="e.g. Rest, avoid cold food..." className="w-full border border-slate-300 rounded-xl p-3 text-sm outline-none focus:border-blue-500 resize-none" />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Dietary Advice</label>
          <textarea rows={3} value={dietaryAdvice} onChange={e => setDietaryAdvice(e.target.value)} placeholder="e.g. Low sodium diet, increase fluids..." className="w-full border border-slate-300 rounded-xl p-3 text-sm outline-none focus:border-blue-500 resize-none" />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Next Visit Date</label>
          <Input type="date" value={nextVisit} onChange={e => setNextVisit(e.target.value)} />
        </div>
      </div>

      <div className="flex gap-3">
        <Button onClick={handleSave} disabled={saving}>
          {saving ? 'Saving...' : '💾 Save Prescription'}
        </Button>
      </div>

      {/* Print View Modal */}
      {showPrint && prescription && (
        <PrescriptionPrintView
          prescription={prescription}
          items={items}
          patientName={patientName}
          doctorName={doctorName}
          clinicName={clinicName}
          advice={advice}
          dietaryAdvice={dietaryAdvice}
          nextVisit={nextVisit}
          onClose={() => setShowPrint(false)}
        />
      )}
    </div>
  )
}
