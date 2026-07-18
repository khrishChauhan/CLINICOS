'use client'

import { useState } from 'react'
import type { FullConsultationData } from '@/types/consultations'
import { 
  saveSoapNoteAction, 
  addDiagnosisAction, 
  addPrescriptionItemAction, 
  lockConsultationAction 
} from '@/actions/consultations/consultationActions'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

interface Props {
  patientId: string
  initialData: FullConsultationData
}

export default function ConsultationWorkspaceClient({ patientId, initialData }: Props) {
  const router = useRouter()
  const [data, setData] = useState(initialData)
  const isLocked = data.consultation.is_locked

  // SOAP State
  const [subjective, setSubjective] = useState(data.soap?.subjective || '')
  const [objective, setObjective] = useState(data.soap?.objective || '')
  const [assessment, setAssessment] = useState(data.soap?.assessment || '')
  const [plan, setPlan] = useState(data.soap?.plan || '')

  // Rx State
  const [rxMedicine, setRxMedicine] = useState('')
  const [rxDosage, setRxDosage] = useState('')
  const [rxFreq, setRxFreq] = useState('')
  const [rxDays, setRxDays] = useState('')
  const [rxInst, setRxInst] = useState('')

  // Dx State
  const [dxDesc, setDxDesc] = useState('')
  const [dxType, setDxType] = useState<'Primary' | 'Secondary'>('Primary')

  async function handleSaveSoap() {
    if (isLocked) return
    const res = await saveSoapNoteAction(data.consultation.id, subjective, objective, assessment, plan)
    if (res.ok) toast.success('SOAP Notes Auto-saved')
    else toast.error('Failed to save SOAP: ' + res.error)
  }

  async function handleAddDiagnosis() {
    if (!dxDesc) return
    const res = await addDiagnosisAction(data.consultation.id, dxDesc, dxType)
    if (res.ok) {
      toast.success('Diagnosis added')
      setDxDesc('')
      router.refresh() // Will re-fetch data from server
    } else {
      toast.error('Failed: ' + res.error)
    }
  }

  async function handleAddRx() {
    if (!rxMedicine) return
    const res = await addPrescriptionItemAction(
      data.consultation.id, 
      patientId, 
      rxMedicine, 
      rxDosage, 
      rxFreq, 
      Number(rxDays), 
      rxInst
    )
    if (res.ok) {
      toast.success('Prescription added')
      setRxMedicine(''); setRxDosage(''); setRxFreq(''); setRxDays(''); setRxInst('')
      router.refresh()
    } else {
      toast.error('Failed: ' + res.error)
    }
  }

  async function handleLock() {
    if (!confirm('Are you sure you want to complete and lock this consultation? It cannot be edited afterwards.')) return
    
    const res = await lockConsultationAction(data.consultation.id)
    if (res.ok) {
      toast.success('Consultation Locked')
      router.push('/doctor')
    } else {
      toast.error('Failed to lock: ' + res.error)
    }
  }

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      
      {/* LEFT SIDEBAR - Patient History */}
      <div className="w-1/3 border-r bg-white flex flex-col">
        <div className="p-4 bg-slate-900 text-white shadow">
          <h2 className="text-xl font-bold">Patient Vitals & History</h2>
          <p className="text-sm text-slate-300">ID: {patientId}</p>
          <div className="mt-4 grid grid-cols-2 gap-4">
            <div className="bg-slate-800 p-2 rounded">
              <span className="text-xs text-slate-400 block">Status</span>
              <span className="font-semibold text-emerald-400">{isLocked ? 'LOCKED' : 'ACTIVE'}</span>
            </div>
            <div className="bg-slate-800 p-2 rounded">
              <span className="text-xs text-slate-400 block">Consultation ID</span>
              <span className="font-mono text-xs">{data.consultation.id.slice(0,8)}</span>
            </div>
          </div>
        </div>
        <div className="p-4 overflow-y-auto flex-1">
          <p className="text-sm text-gray-500 italic">No past history found.</p>
        </div>
      </div>

      {/* RIGHT SIDEBAR - EMR Workspace */}
      <div className="flex-1 flex flex-col overflow-y-auto">
        
        {/* Header Action Bar */}
        <div className="bg-white border-b p-4 flex justify-between items-center sticky top-0 z-10 shadow-sm">
          <h1 className="text-2xl font-bold text-slate-800">EMR Workspace</h1>
          {!isLocked && (
            <button 
              onClick={handleLock}
              className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg shadow-md font-semibold transition-all"
            >
              Complete & Lock
            </button>
          )}
        </div>

        <div className="p-6 space-y-8 max-w-5xl mx-auto w-full">
          
          {/* SOAP Notes */}
          <section className="bg-white rounded-xl shadow-sm border p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-slate-800">S.O.A.P. Notes</h3>
              {!isLocked && <button onClick={handleSaveSoap} className="text-sm text-blue-600 hover:underline">Save Draft</button>}
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold mb-1">Subjective (Symptoms)</label>
                <textarea disabled={isLocked} value={subjective} onChange={e => setSubjective(e.target.value)} onBlur={handleSaveSoap} className="w-full border rounded p-2 h-24" placeholder="Patient complains of..."></textarea>
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">Objective (Observations)</label>
                <textarea disabled={isLocked} value={objective} onChange={e => setObjective(e.target.value)} onBlur={handleSaveSoap} className="w-full border rounded p-2 h-24" placeholder="Vitals, physical exam..."></textarea>
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">Assessment (Diagnosis Info)</label>
                <textarea disabled={isLocked} value={assessment} onChange={e => setAssessment(e.target.value)} onBlur={handleSaveSoap} className="w-full border rounded p-2 h-24" placeholder="Probable cause..."></textarea>
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">Plan (Treatment)</label>
                <textarea disabled={isLocked} value={plan} onChange={e => setPlan(e.target.value)} onBlur={handleSaveSoap} className="w-full border rounded p-2 h-24" placeholder="Medication, rest, etc."></textarea>
              </div>
            </div>
          </section>

          {/* Diagnoses */}
          <section className="bg-white rounded-xl shadow-sm border p-6">
            <h3 className="text-lg font-bold text-slate-800 mb-4">Diagnoses</h3>
            
            <ul className="mb-4 space-y-2">
              {data.diagnoses.map(dx => (
                <li key={dx.id} className="p-3 bg-slate-50 rounded border flex justify-between">
                  <div>
                    <span className={`text-xs font-bold px-2 py-1 rounded mr-2 ${dx.type === 'Primary' ? 'bg-blue-100 text-blue-800' : 'bg-gray-200'}`}>{dx.type}</span>
                    <span className="font-medium">{dx.description}</span>
                  </div>
                </li>
              ))}
            </ul>

            {!isLocked && (
              <div className="flex gap-2 bg-slate-50 p-4 rounded-lg border">
                <input value={dxDesc} onChange={e => setDxDesc(e.target.value)} placeholder="Diagnosis description..." className="flex-1 border p-2 rounded" />
                <select value={dxType} onChange={e => setDxType(e.target.value as any)} className="border p-2 rounded">
                  <option value="Primary">Primary</option>
                  <option value="Secondary">Secondary</option>
                </select>
                <button onClick={handleAddDiagnosis} className="bg-slate-800 text-white px-4 rounded font-medium">Add</button>
              </div>
            )}
          </section>

          {/* Prescriptions */}
          <section className="bg-white rounded-xl shadow-sm border p-6">
            <h3 className="text-lg font-bold text-slate-800 mb-4">Prescription (Rx)</h3>
            
            <div className="overflow-x-auto mb-4">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-100 text-slate-600 text-sm">
                    <th className="p-2 border-b">Medicine</th>
                    <th className="p-2 border-b">Dosage</th>
                    <th className="p-2 border-b">Frequency</th>
                    <th className="p-2 border-b">Days</th>
                    <th className="p-2 border-b">Instructions</th>
                  </tr>
                </thead>
                <tbody>
                  {data.prescriptionItems.map(item => (
                    <tr key={item.id} className="border-b text-sm">
                      <td className="p-2 font-medium">{item.medicine_name}</td>
                      <td className="p-2">{item.dosage}</td>
                      <td className="p-2">{item.frequency}</td>
                      <td className="p-2">{item.duration_days}</td>
                      <td className="p-2 text-gray-500">{item.instructions}</td>
                    </tr>
                  ))}
                  {data.prescriptionItems.length === 0 && (
                    <tr><td colSpan={5} className="p-4 text-center text-gray-400">No medicines prescribed yet.</td></tr>
                  )}
                </tbody>
              </table>
            </div>

            {!isLocked && (
              <div className="grid grid-cols-6 gap-2 bg-slate-50 p-4 rounded-lg border items-end">
                <div className="col-span-2">
                  <label className="text-xs font-semibold block mb-1">Medicine Name</label>
                  <input value={rxMedicine} onChange={e => setRxMedicine(e.target.value)} className="w-full border p-2 rounded" />
                </div>
                <div>
                  <label className="text-xs font-semibold block mb-1">Dosage</label>
                  <input value={rxDosage} onChange={e => setRxDosage(e.target.value)} placeholder="e.g. 500mg" className="w-full border p-2 rounded" />
                </div>
                <div>
                  <label className="text-xs font-semibold block mb-1">Frequency</label>
                  <input value={rxFreq} onChange={e => setRxFreq(e.target.value)} placeholder="1-0-1" className="w-full border p-2 rounded" />
                </div>
                <div>
                  <label className="text-xs font-semibold block mb-1">Days</label>
                  <input type="number" value={rxDays} onChange={e => setRxDays(e.target.value)} placeholder="5" className="w-full border p-2 rounded" />
                </div>
                <div>
                  <label className="text-xs font-semibold block mb-1">Instr.</label>
                  <input value={rxInst} onChange={e => setRxInst(e.target.value)} placeholder="After food" className="w-full border p-2 rounded" />
                </div>
                <div className="col-span-6 flex justify-end mt-2">
                  <button onClick={handleAddRx} className="bg-slate-800 text-white px-6 py-2 rounded shadow font-medium">Add Medicine</button>
                </div>
              </div>
            )}
          </section>
          
        </div>
      </div>
    </div>
  )
}
