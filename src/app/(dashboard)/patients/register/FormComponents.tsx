'use client'

import React, { useCallback } from 'react'
import { useFormContext } from 'react-hook-form'
import type { PatientRegistrationInput } from '@/services/patients/validation'

interface FieldProps {
  label: string
  name: keyof PatientRegistrationInput
  required?: boolean
  type?: string
  placeholder?: string
  children?: React.ReactNode
  hint?: string
}

// ─────────────────────────────────────────────────────────────────────────────
// Reusable field wrappers that read errors from form context
// ─────────────────────────────────────────────────────────────────────────────

export function FormField({ label, name, required, type = 'text', placeholder, hint }: FieldProps) {
  const { register, formState: { errors } } = useFormContext<PatientRegistrationInput>()
  const error = errors[name]

  return (
    <div className="space-y-1">
      <label className="block text-xs font-semibold text-slate-600">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <input
        type={type}
        placeholder={placeholder}
        {...register(name, { valueAsNumber: type === 'number' })}
        className={`w-full px-3 py-2 text-sm border rounded-lg bg-white text-slate-800 placeholder-slate-400 transition
          focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500
          ${error ? 'border-red-400 bg-red-50/30' : 'border-slate-200 hover:border-slate-300'}`}
      />
      {hint && !error && <p className="text-[10px] text-slate-400">{hint}</p>}
      {error && <p className="text-[10px] text-red-500 font-medium">{error.message as string}</p>}
    </div>
  )
}

export function FormSelect({
  label, name, required, children, placeholder
}: FieldProps) {
  const { register, formState: { errors } } = useFormContext<PatientRegistrationInput>()
  const error = errors[name]

  return (
    <div className="space-y-1">
      <label className="block text-xs font-semibold text-slate-600">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <select
        {...register(name)}
        className={`w-full px-3 py-2 text-sm border rounded-lg bg-white text-slate-800 transition
          focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500
          ${error ? 'border-red-400 bg-red-50/30' : 'border-slate-200 hover:border-slate-300'}`}
      >
        {placeholder && <option value="">{placeholder}</option>}
        {children}
      </select>
      {error && <p className="text-[10px] text-red-500 font-medium">{error.message as string}</p>}
    </div>
  )
}

export function FormTextarea({ label, name, required, placeholder }: FieldProps) {
  const { register, formState: { errors } } = useFormContext<PatientRegistrationInput>()
  const error = errors[name]

  return (
    <div className="space-y-1">
      <label className="block text-xs font-semibold text-slate-600">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <textarea
        rows={3}
        placeholder={placeholder}
        {...register(name)}
        className={`w-full px-3 py-2 text-sm border rounded-lg bg-white text-slate-800 placeholder-slate-400 transition resize-none
          focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500
          ${error ? 'border-red-400 bg-red-50/30' : 'border-slate-200 hover:border-slate-300'}`}
      />
      {error && <p className="text-[10px] text-red-500 font-medium">{error.message as string}</p>}
    </div>
  )
}

export function StepHeader({ step, title, description }: { step: number; title: string; description: string }) {
  return (
    <div className="mb-6">
      <div className="flex items-center gap-2 mb-1">
        <span className="text-[10px] font-bold text-blue-500 uppercase tracking-widest">Step {step} of 11</span>
      </div>
      <h2 className="text-lg font-bold text-slate-800">{title}</h2>
      <p className="text-xs text-slate-500 mt-0.5">{description}</p>
    </div>
  )
}
