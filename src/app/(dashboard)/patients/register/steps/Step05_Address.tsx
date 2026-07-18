'use client'

import React from 'react'
import { useFieldArray, useFormContext } from 'react-hook-form'
import { Plus, Trash2 } from 'lucide-react'
import { StepHeader } from '../FormComponents'
import type { PatientRegistrationInput } from '@/services/patients/validation'

function AddressCard({ index, onRemove }: { index: number; onRemove: () => void }) {
  const { register, formState: { errors } } = useFormContext<PatientRegistrationInput>()
  const base = `addresses.${index}` as const

  const fieldError = (field: string) => {
    const errs = errors.addresses as Record<string, Record<string, { message: string }>> | undefined
    return errs?.[index]?.[field]?.message
  }

  return (
    <div className="border border-slate-200 rounded-xl p-4 bg-slate-50/50 space-y-4 relative">
      <div className="flex items-center justify-between mb-1">
        <span className="text-xs font-bold text-slate-600">Address {index + 1}</span>
        {index > 0 && (
          <button type="button" onClick={onRemove}
            className="text-red-500 hover:text-red-700 transition">
            <Trash2 className="w-4 h-4" />
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="text-xs font-semibold text-slate-600">Address Type</label>
          <select {...register(`addresses.${index}.address_type`)}
            className="mt-1 w-full px-3 py-2 text-sm border border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/30">
            {['Home', 'Office', 'Other'].map(t => <option key={t}>{t}</option>)}
          </select>
        </div>
        <div>
          <label className="text-xs font-semibold text-slate-600">Country</label>
          <select {...register(`addresses.${index}.country`)}
            className="mt-1 w-full px-3 py-2 text-sm border border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/30">
            {['India', 'Other'].map(c => <option key={c}>{c}</option>)}
          </select>
        </div>
      </div>

      <div>
        <label className="text-xs font-semibold text-slate-600">Address Line 1 <span className="text-red-500">*</span></label>
        <input {...register(`addresses.${index}.address_line_1`)}
          placeholder="House / Flat / Plot number, Street / Colony"
          className={`mt-1 w-full px-3 py-2 text-sm border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/30
            ${fieldError('address_line_1') ? 'border-red-400' : 'border-slate-200'}`} />
        {fieldError('address_line_1') && <p className="text-[10px] text-red-500 mt-0.5">{fieldError('address_line_1')}</p>}
      </div>
      <div>
        <label className="text-xs font-semibold text-slate-600">Address Line 2</label>
        <input {...register(`addresses.${index}.address_line_2`)}
          placeholder="Landmark, area, locality (optional)"
          className="mt-1 w-full px-3 py-2 text-sm border border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/30" />
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {[
          { field: 'city', label: 'City' },
          { field: 'district', label: 'District' },
          { field: 'state', label: 'State' },
          { field: 'pincode', label: 'Pincode' },
        ].map(({ field, label }) => (
          <div key={field}>
            <label className="text-xs font-semibold text-slate-600">{label}</label>
            <input {...register(`addresses.${index}.${field}` as Parameters<typeof register>[0])}
              className="mt-1 w-full px-3 py-2 text-sm border border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/30" />
          </div>
        ))}
      </div>
    </div>
  )
}

export default function Step05_Address() {
  const { control } = useFormContext<PatientRegistrationInput>()
  const { fields, append, remove } = useFieldArray({ control, name: 'addresses' })

  return (
    <div>
      <StepHeader step={5} title="Address Details" description="Enter the patient's residential or contact address." />
      <div className="space-y-4">
        {fields.map((field, index) => (
          <AddressCard key={field.id} index={index} onRemove={() => remove(index)} />
        ))}
        <button type="button"
          onClick={() => append({ address_type: 'Home', address_line_1: '', country: 'India', is_primary: fields.length === 0 })}
          className="flex items-center gap-2 text-sm font-semibold text-blue-600 hover:text-blue-700 bg-blue-50 border border-blue-200 border-dashed px-4 py-2.5 rounded-xl w-full justify-center transition hover:bg-blue-100">
          <Plus className="w-4 h-4" /> Add Address
        </button>
      </div>
    </div>
  )
}
