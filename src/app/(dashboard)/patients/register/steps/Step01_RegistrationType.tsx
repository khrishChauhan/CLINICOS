'use client'

import React, { useEffect, useState } from 'react'
import { StepHeader, FormField, FormSelect } from '../FormComponents'
import { getDoctorsForClinicAction, type DoctorForDropdown } from '@/actions/appointments/getDoctorsForClinicAction'
import { useFormContext } from 'react-hook-form'
import type { PatientRegistrationInput } from '@/services/patients/validation'

export default function Step01_RegistrationType() {
  const { watch, setValue } = useFormContext<PatientRegistrationInput>()
  const [doctors, setDoctors] = useState<DoctorForDropdown[]>([])
  const [dropdownValue, setDropdownValue] = useState<string>('')
  
  const referredByValue = watch('referred_by')

  useEffect(() => {
    getDoctorsForClinicAction().then(res => {
      if (res.success) setDoctors(res.data)
    })
  }, [])

  useEffect(() => {
    if (referredByValue) {
      const isDoctor = doctors.some(d => `Dr. ${d.first_name} ${d.last_name}` === referredByValue)
      if (isDoctor) {
        setDropdownValue(referredByValue)
      } else {
        setDropdownValue('Other')
      }
    } else {
      setDropdownValue('')
    }
  }, [doctors, referredByValue])

  const handleDropdownChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value
    setDropdownValue(val)
    if (val === 'Other') {
      setValue('referred_by', '')
    } else {
      setValue('referred_by', val)
    }
  }

  return (
    <div>
      <StepHeader
        step={1}
        title="Registration Type"
        description="Select the type of visit and referral information."
      />
      <div className="grid grid-cols-1 gap-5">
        <FormSelect label="Patient Type" name="patient_type" required placeholder="Select patient type...">
          <option value="OPD">OPD – Out-Patient Department</option>
          <option value="IPD">IPD – In-Patient Department</option>
          <option value="Emergency">Emergency</option>
        </FormSelect>

        <div className="space-y-3">
          <div className="space-y-1">
            <label className="block text-xs font-semibold text-slate-600">Referred By</label>
            <select
              value={dropdownValue}
              onChange={handleDropdownChange}
              className="w-full px-3 py-2 text-sm border rounded-lg bg-white text-slate-800 transition focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 border-slate-200 hover:border-slate-300"
            >
              <option value="">Select referring doctor or source (optional)</option>
              {doctors.map(d => (
                <option key={d.id} value={`Dr. ${d.first_name} ${d.last_name}`}>
                  Dr. {d.first_name} {d.last_name}
                </option>
              ))}
              <option value="Other">Other (Custom Source)</option>
            </select>
          </div>

          {dropdownValue === 'Other' && (
            <FormField label="Specify Custom Source" name="referred_by" placeholder="Type referral name..." />
          )}
        </div>
      </div>
    </div>
  )
}

