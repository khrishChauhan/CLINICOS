'use client'

import React from 'react'
import { useFieldArray, useFormContext } from 'react-hook-form'
import { Plus, Trash2 } from 'lucide-react'
import { StepHeader } from '../FormComponents'
import type { PatientRegistrationInput } from '@/services/patients/validation'

function ContactCard({ index, onRemove }: { index: number; onRemove: () => void }) {
  const { register, formState: { errors } } = useFormContext<PatientRegistrationInput>()
  const errs = (errors.emergency_contacts as Record<string, Record<string, { message: string }>> | undefined)

  return (
    <div className="border border-slate-200 rounded-xl p-4 bg-slate-50/50 space-y-4">
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold text-slate-600">Contact {index + 1}</span>
        {index > 0 && (
          <button type="button" onClick={onRemove} className="text-red-500 hover:text-red-700 transition">
            <Trash2 className="w-4 h-4" />
          </button>
        )}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="text-xs font-semibold text-slate-600">Full Name <span className="text-red-500">*</span></label>
          <input {...register(`emergency_contacts.${index}.contact_name`)}
            className={`mt-1 w-full px-3 py-2 text-sm border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/30
              ${errs?.[index]?.contact_name ? 'border-red-400' : 'border-slate-200'}`} />
          {errs?.[index]?.contact_name && <p className="text-[10px] text-red-500 mt-0.5">{errs[index].contact_name.message}</p>}
        </div>
        <div>
          <label className="text-xs font-semibold text-slate-600">Relationship</label>
          <select {...register(`emergency_contacts.${index}.relationship`)}
            className="mt-1 w-full px-3 py-2 text-sm border border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/30">
            <option value="">Select relationship...</option>
            {['Spouse', 'Parent', 'Child', 'Sibling', 'Relative', 'Friend', 'Guardian', 'Other'].map(r => (
              <option key={r} value={r}>{r}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-xs font-semibold text-slate-600">Mobile Number <span className="text-red-500">*</span></label>
          <input {...register(`emergency_contacts.${index}.mobile_number`)}
            className={`mt-1 w-full px-3 py-2 text-sm border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/30
              ${errs?.[index]?.mobile_number ? 'border-red-400' : 'border-slate-200'}`} />
          {errs?.[index]?.mobile_number && <p className="text-[10px] text-red-500 mt-0.5">{errs[index].mobile_number.message}</p>}
        </div>
        <div>
          <label className="text-xs font-semibold text-slate-600">Alternate Mobile</label>
          <input {...register(`emergency_contacts.${index}.alternate_mobile`)}
            className="mt-1 w-full px-3 py-2 text-sm border border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/30" />
        </div>
        <div className="sm:col-span-2">
          <label className="text-xs font-semibold text-slate-600">Address</label>
          <input {...register(`emergency_contacts.${index}.address`)}
            placeholder="Contact's address (optional)"
            className="mt-1 w-full px-3 py-2 text-sm border border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/30" />
        </div>
      </div>
    </div>
  )
}

export default function Step06_EmergencyContact() {
  const { control } = useFormContext<PatientRegistrationInput>()
  const { fields, append, remove } = useFieldArray({ control, name: 'emergency_contacts' })

  return (
    <div>
      <StepHeader step={6} title="Emergency Contacts" description="Add at least one emergency contact for the patient." />
      <div className="space-y-4">
        {fields.map((field, index) => (
          <ContactCard key={field.id} index={index} onRemove={() => remove(index)} />
        ))}
        <button type="button"
          onClick={() => append({ contact_name: '', mobile_number: '' })}
          className="flex items-center gap-2 text-sm font-semibold text-blue-600 hover:text-blue-700 bg-blue-50 border border-blue-200 border-dashed px-4 py-2.5 rounded-xl w-full justify-center transition hover:bg-blue-100">
          <Plus className="w-4 h-4" /> Add Emergency Contact
        </button>
      </div>
    </div>
  )
}
