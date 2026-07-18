'use client'

import React from 'react'
import { useFieldArray, useFormContext } from 'react-hook-form'
import { Plus, Trash2 } from 'lucide-react'
import { StepHeader } from '../FormComponents'
import type { PatientRegistrationInput } from '@/services/patients/validation'

function InsuranceCard({ index, onRemove }: { index: number; onRemove: () => void }) {
  const { register, formState: { errors } } = useFormContext<PatientRegistrationInput>()
  const errs = (errors.insurance as Record<string, Record<string, { message: string }>> | undefined)

  return (
    <div className="border border-slate-200 rounded-xl p-4 bg-slate-50/50 space-y-4">
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold text-slate-600">Insurance Policy {index + 1}</span>
        <button type="button" onClick={onRemove} className="text-red-500 hover:text-red-700 transition">
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="text-xs font-semibold text-slate-600">Insurance Provider <span className="text-red-500">*</span></label>
          <input {...register(`insurance.${index}.insurance_provider`)}
            className={`mt-1 w-full px-3 py-2 text-sm border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/30
              ${errs?.[index]?.insurance_provider ? 'border-red-400' : 'border-slate-200'}`} />
          {errs?.[index]?.insurance_provider && <p className="text-[10px] text-red-500 mt-0.5">{errs[index].insurance_provider.message}</p>}
        </div>
        <div>
          <label className="text-xs font-semibold text-slate-600">Policy Number <span className="text-red-500">*</span></label>
          <input {...register(`insurance.${index}.policy_number`)}
            className={`mt-1 w-full px-3 py-2 text-sm border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/30
              ${errs?.[index]?.policy_number ? 'border-red-400' : 'border-slate-200'}`} />
          {errs?.[index]?.policy_number && <p className="text-[10px] text-red-500 mt-0.5">{errs[index].policy_number.message}</p>}
        </div>
        <div>
          <label className="text-xs font-semibold text-slate-600">Member ID</label>
          <input {...register(`insurance.${index}.member_id`)}
            className="mt-1 w-full px-3 py-2 text-sm border border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/30" />
        </div>
        <div>
          <label className="text-xs font-semibold text-slate-600">Coverage Amount</label>
          <input type="number" {...register(`insurance.${index}.coverage_amount`, { valueAsNumber: true })}
            className="mt-1 w-full px-3 py-2 text-sm border border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/30" />
        </div>
        <div>
          <label className="text-xs font-semibold text-slate-600">Valid From</label>
          <input type="date" {...register(`insurance.${index}.valid_from`)}
            className="mt-1 w-full px-3 py-2 text-sm border border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/30" />
        </div>
        <div>
          <label className="text-xs font-semibold text-slate-600">Valid To</label>
          <input type="date" {...register(`insurance.${index}.valid_to`)}
            className="mt-1 w-full px-3 py-2 text-sm border border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/30" />
        </div>
        <div>
          <label className="text-xs font-semibold text-slate-600">Insurance Type</label>
          <select {...register(`insurance.${index}.insurance_type`)}
            className="mt-1 w-full px-3 py-2 text-sm border border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/30">
            <option value="">Select type...</option>
            {['Health', 'Life', 'Accident', 'Dental', 'Vision', 'Other'].map(t => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-xs font-semibold text-slate-600">Status</label>
          <select {...register(`insurance.${index}.status`)}
            className="mt-1 w-full px-3 py-2 text-sm border border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/30">
            {['Active', 'Expired', 'Pending'].map(s => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>
      </div>
    </div>
  )
}

export default function Step07_Insurance() {
  const { control } = useFormContext<PatientRegistrationInput>()
  const { fields, append, remove } = useFieldArray({ control, name: 'insurance' })

  return (
    <div>
      <StepHeader step={7} title="Insurance Details" description="Add patient insurance policies (optional)." />
      <div className="space-y-4">
        {fields.map((field, index) => (
          <InsuranceCard key={field.id} index={index} onRemove={() => remove(index)} />
        ))}
        <button type="button"
          onClick={() => append({ insurance_provider: '', policy_number: '', status: 'Active' })}
          className="flex items-center gap-2 text-sm font-semibold text-blue-600 hover:text-blue-700 bg-blue-50 border border-blue-200 border-dashed px-4 py-2.5 rounded-xl w-full justify-center transition hover:bg-blue-100">
          <Plus className="w-4 h-4" /> Add Insurance
        </button>
      </div>
    </div>
  )
}
