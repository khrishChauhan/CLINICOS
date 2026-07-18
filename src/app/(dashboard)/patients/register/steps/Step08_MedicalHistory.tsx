'use client'

import React from 'react'
import { useFieldArray, useFormContext } from 'react-hook-form'
import { Plus, Trash2 } from 'lucide-react'
import { StepHeader } from '../FormComponents'
import type { PatientRegistrationInput } from '@/services/patients/validation'

function MedicalHistoryCard({ index, onRemove }: { index: number; onRemove: () => void }) {
  const { register, formState: { errors } } = useFormContext<PatientRegistrationInput>()
  const errs = (errors.medical_history as Record<string, Record<string, { message: string }>> | undefined)

  return (
    <div className="border border-slate-200 rounded-xl p-4 bg-slate-50/50 space-y-4">
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold text-slate-600">Condition {index + 1}</span>
        <button type="button" onClick={onRemove} className="text-red-500 hover:text-red-700 transition">
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="sm:col-span-2">
          <label className="text-xs font-semibold text-slate-600">Disease / Condition Name <span className="text-red-500">*</span></label>
          <input {...register(`medical_history.${index}.disease_name`)}
            className={`mt-1 w-full px-3 py-2 text-sm border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/30
              ${errs?.[index]?.disease_name ? 'border-red-400' : 'border-slate-200'}`} />
          {errs?.[index]?.disease_name && <p className="text-[10px] text-red-500 mt-0.5">{errs[index].disease_name.message}</p>}
        </div>
        <div>
          <label className="text-xs font-semibold text-slate-600">Diagnosis Date</label>
          <input type="date" {...register(`medical_history.${index}.diagnosis_date`)}
            className="mt-1 w-full px-3 py-2 text-sm border border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/30" />
        </div>
        <div>
          <label className="text-xs font-semibold text-slate-600">Treatment Status</label>
          <select {...register(`medical_history.${index}.treatment_status`)}
            className="mt-1 w-full px-3 py-2 text-sm border border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/30">
            <option value="">Select status...</option>
            {['Ongoing', 'Completed', 'Chronic', 'Resolved'].map(s => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-xs font-semibold text-slate-600">Treated By (Doctor)</label>
          <input {...register(`medical_history.${index}.treated_by`)}
            className="mt-1 w-full px-3 py-2 text-sm border border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/30" />
        </div>
        <div>
          <label className="text-xs font-semibold text-slate-600">Hospital Name</label>
          <input {...register(`medical_history.${index}.hospital_name`)}
            className="mt-1 w-full px-3 py-2 text-sm border border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/30" />
        </div>
        <div className="sm:col-span-2">
          <label className="text-xs font-semibold text-slate-600">Remarks</label>
          <input {...register(`medical_history.${index}.remarks`)}
            className="mt-1 w-full px-3 py-2 text-sm border border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/30" />
        </div>
      </div>
    </div>
  )
}

export default function Step08_MedicalHistory() {
  const { control } = useFormContext<PatientRegistrationInput>()
  const { fields, append, remove } = useFieldArray({ control, name: 'medical_history' })

  return (
    <div>
      <StepHeader step={8} title="Medical History" description="Record past medical conditions and treatments (optional)." />
      <div className="space-y-4">
        {fields.map((field, index) => (
          <MedicalHistoryCard key={field.id} index={index} onRemove={() => remove(index)} />
        ))}
        <button type="button"
          onClick={() => append({ disease_name: '' })}
          className="flex items-center gap-2 text-sm font-semibold text-blue-600 hover:text-blue-700 bg-blue-50 border border-blue-200 border-dashed px-4 py-2.5 rounded-xl w-full justify-center transition hover:bg-blue-100">
          <Plus className="w-4 h-4" /> Add Medical History
        </button>
      </div>
    </div>
  )
}
