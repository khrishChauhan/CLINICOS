'use client'

import React, { useEffect, useRef } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { X, Loader2, Save, AlertCircle } from 'lucide-react'
import { updatePatientAction, type UpdatePatientInput } from '@/actions/patients/patientActions'
import type { PatientListItem } from '@/types/patients'

// ─────────────────────────────────────────────────────────────────────────────
// Schema (client-side mirror of server-side for instant feedback)
// ─────────────────────────────────────────────────────────────────────────────

const schema = z.object({
  first_name:       z.string().min(1, 'First name is required').max(100),
  middle_name:      z.string().max(100).optional().nullable(),
  last_name:        z.string().max(100).optional().nullable(),
  title:            z.string().max(20).optional().nullable(),
  gender:           z.string().max(50).optional().nullable(),
  date_of_birth:    z.string().optional().nullable(),
  age:              z.number().int().min(0).max(150).optional().nullable(),
  age_unit:         z.enum(['Years', 'Months', 'Days']).optional().nullable(),
  blood_group:      z.string().max(10).optional().nullable(),
  mobile_number:    z.string().min(10, 'Valid 10-digit mobile number required').max(20),
  alternate_mobile: z.string().max(20).optional().nullable(),
  email:            z.string().email('Enter a valid email').optional().nullable().or(z.literal('')),
  occupation:       z.string().max(100).optional().nullable(),
  marital_status:   z.string().max(50).optional().nullable(),
  nationality:      z.string().max(100).optional().nullable(),
  religion:         z.string().max(100).optional().nullable(),
  remarks:          z.string().max(1000).optional().nullable(),
})

type FormData = z.infer<typeof schema>

// ─────────────────────────────────────────────────────────────────────────────
// Field Components
// ─────────────────────────────────────────────────────────────────────────────

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs font-semibold text-slate-600 mb-1">{label}</label>
      {children}
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  )
}

const inputCls = "w-full px-3 py-2 rounded-lg border border-slate-200 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition placeholder:text-slate-300"
const selectCls = "w-full px-3 py-2 rounded-lg border border-slate-200 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition bg-white"

// ─────────────────────────────────────────────────────────────────────────────
// Props
// ─────────────────────────────────────────────────────────────────────────────

interface EditPatientDrawerProps {
  patient: PatientListItem
  open: boolean
  onClose: () => void
  onSuccess: () => void
}

// ─────────────────────────────────────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────────────────────────────────────

export default function EditPatientDrawer({ patient, open, onClose, onSuccess }: EditPatientDrawerProps) {
  const firstInputRef = useRef<HTMLInputElement>(null)

  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isSubmitting, isDirty }
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      first_name:      patient.fullName.split(' ')[1] || '',
      last_name:       patient.fullName.split(' ').slice(2).join(' ') || '',
      title:           patient.title || '',
      gender:          patient.gender || '',
      blood_group:     patient.bloodGroup || '',
      mobile_number:   patient.mobileNumber || '',
      age:             patient.age ?? undefined,
      age_unit:        (patient.ageUnit as 'Years' | 'Months' | 'Days') || 'Years',
    }
  })

  // Focus first field on open
  useEffect(() => {
    if (open) {
      setTimeout(() => firstInputRef.current?.focus(), 100)
    }
  }, [open])

  // Trap escape key
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [onClose])

  const onSubmit = async (data: FormData) => {
    const result = await updatePatientAction(patient.id, data as UpdatePatientInput)
    if (result.ok) {
      onSuccess()
      onClose()
    } else {
      type ErrResult = { ok: false; error: string; message?: string; fieldErrors?: Record<string, string[]> }
      const errResult = result as ErrResult
      if (errResult.error === 'VALIDATION_ERROR' && errResult.fieldErrors) {
        for (const [field, messages] of Object.entries(errResult.fieldErrors)) {
          setError(field as keyof FormData, { message: messages[0] })
        }
      }
    }
  }

  if (!open) return null

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/40 z-40 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer Panel */}
      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Edit Patient Profile"
        className="fixed right-0 top-0 h-full w-full max-w-lg bg-white shadow-2xl z-50 flex flex-col overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50 shrink-0">
          <div>
            <h2 className="text-base font-bold text-slate-800">Edit Patient Profile</h2>
            <p className="text-xs text-slate-500 mt-0.5 font-mono">{patient.uhid}</p>
          </div>
          <button
            onClick={onClose}
            aria-label="Close drawer"
            className="w-8 h-8 flex items-center justify-center rounded-full text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit(onSubmit)} className="flex-1 overflow-y-auto">
          <div className="px-6 py-6 space-y-5">
            {/* Name Row */}
            <div className="grid grid-cols-3 gap-3">
              <Field label="Title" error={errors.title?.message}>
                <select {...register('title')} className={selectCls}>
                  <option value="">—</option>
                  {['Mr.', 'Mrs.', 'Ms.', 'Dr.', 'Master', 'Baby', 'Baby of'].map(t => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </Field>
              <div className="col-span-2">
                <Field label="First Name *" error={errors.first_name?.message}>
                  <input ref={firstInputRef} {...register('first_name')} className={inputCls} placeholder="First name" />
                </Field>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Field label="Middle Name" error={errors.middle_name?.message}>
                <input {...register('middle_name')} className={inputCls} placeholder="Middle name" />
              </Field>
              <Field label="Last Name" error={errors.last_name?.message}>
                <input {...register('last_name')} className={inputCls} placeholder="Last name" />
              </Field>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Field label="Gender" error={errors.gender?.message}>
                <select {...register('gender')} className={selectCls}>
                  <option value="">Select…</option>
                  {['Male', 'Female', 'Other', 'Prefer not to say'].map(g => (
                    <option key={g} value={g}>{g}</option>
                  ))}
                </select>
              </Field>
              <Field label="Blood Group" error={errors.blood_group?.message}>
                <select {...register('blood_group')} className={selectCls}>
                  <option value="">Select…</option>
                  {['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'].map(g => (
                    <option key={g} value={g}>{g}</option>
                  ))}
                </select>
              </Field>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Field label="Date of Birth" error={errors.date_of_birth?.message}>
                <input {...register('date_of_birth')} type="date" className={inputCls} />
              </Field>
              <div className="grid grid-cols-2 gap-2">
                <Field label="Age" error={errors.age?.message}>
                  <input {...register('age')} type="number" className={inputCls} placeholder="Age" min={0} />
                </Field>
                <Field label="Unit" error={errors.age_unit?.message}>
                  <select {...register('age_unit')} className={selectCls}>
                    <option value="Years">Years</option>
                    <option value="Months">Months</option>
                    <option value="Days">Days</option>
                  </select>
                </Field>
              </div>
            </div>

            <div className="h-px bg-slate-100" />

            <Field label="Mobile Number *" error={errors.mobile_number?.message}>
              <input {...register('mobile_number')} type="tel" className={inputCls} placeholder="+91 98765 43210" />
            </Field>

            <div className="grid grid-cols-2 gap-3">
              <Field label="Alternate Mobile" error={errors.alternate_mobile?.message}>
                <input {...register('alternate_mobile')} type="tel" className={inputCls} placeholder="Optional" />
              </Field>
              <Field label="Email" error={errors.email?.message}>
                <input {...register('email')} type="email" className={inputCls} placeholder="patient@email.com" />
              </Field>
            </div>

            <div className="h-px bg-slate-100" />

            <div className="grid grid-cols-2 gap-3">
              <Field label="Marital Status" error={errors.marital_status?.message}>
                <select {...register('marital_status')} className={selectCls}>
                  <option value="">Select…</option>
                  {['Single', 'Married', 'Divorced', 'Widowed', 'Separated'].map(s => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </Field>
              <Field label="Occupation" error={errors.occupation?.message}>
                <input {...register('occupation')} className={inputCls} placeholder="Occupation" />
              </Field>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Field label="Nationality" error={errors.nationality?.message}>
                <input {...register('nationality')} className={inputCls} placeholder="Indian" defaultValue="Indian" />
              </Field>
              <Field label="Religion" error={errors.religion?.message}>
                <input {...register('religion')} className={inputCls} placeholder="Optional" />
              </Field>
            </div>

            <Field label="Internal Remarks" error={errors.remarks?.message}>
              <textarea
                {...register('remarks')}
                className={`${inputCls} min-h-[80px] resize-none`}
                placeholder="Clinical or administrative notes (not visible to patient)"
              />
            </Field>
          </div>

          {/* Footer */}
          <div className="px-6 py-4 border-t border-slate-100 bg-slate-50 shrink-0 flex items-center justify-between gap-3 sticky bottom-0">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100 rounded-lg transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !isDirty}
              aria-busy={isSubmitting}
              className="flex items-center gap-2 px-5 py-2 bg-blue-600 text-white font-bold text-sm rounded-lg hover:bg-blue-700 transition disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              {isSubmitting ? 'Saving…' : 'Save Changes'}
            </button>
          </div>
        </form>
      </aside>
    </>
  )
}
