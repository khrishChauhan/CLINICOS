'use client'

import React, { useState, useEffect } from 'react'
import { StepHeader, FormField, FormSelect } from '../FormComponents'
import { getMasterDataAction } from '@/actions/master/masterActions'
import type { MasterGender, MasterBloodGroup, MasterMaritalStatus } from '@/types/master'
import { useFormContext } from 'react-hook-form'

export default function Step02_BasicInfo() {
  const { watch, setValue } = useFormContext()
  const [genders, setGenders] = useState<MasterGender[]>([])
  const [bloodGroups, setBloodGroups] = useState<MasterBloodGroup[]>([])
  const [maritalStatuses, setMaritalStatuses] = useState<MasterMaritalStatus[]>([])
  
  const dob = watch('date_of_birth')

  useEffect(() => {
    if (dob) {
      const birthDate = new Date(dob)
      const today = new Date()
      let age = today.getFullYear() - birthDate.getFullYear()
      const m = today.getMonth() - birthDate.getMonth()
      if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--
      }
      // Only auto-populate if we have a valid age calculation
      if (age >= 0 && !isNaN(age)) {
        setValue('age', age)
        setValue('age_unit', 'Years')
      }
    }
  }, [dob, setValue])

  useEffect(() => {
    async function loadMasterData() {
      const [gRes, bRes, mRes] = await Promise.all([
        getMasterDataAction<MasterGender>('genders'),
        getMasterDataAction<MasterBloodGroup>('blood_groups'),
        getMasterDataAction<MasterMaritalStatus>('marital_statuses')
      ])
      if (gRes.success && gRes.data) setGenders(gRes.data)
      if (bRes.success && bRes.data) setBloodGroups(bRes.data)
      if (mRes.success && mRes.data) setMaritalStatuses(mRes.data)
    }
    loadMasterData()
  }, [])

  return (
    <div>
      <StepHeader
        step={2}
        title="Basic Information"
        description="Enter the patient's name and core identity details."
      />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <FormSelect label="Title" name="title" placeholder="Select title...">
          {['Mr.', 'Mrs.', 'Ms.', 'Dr.', 'Master', 'Baby', 'Baby of'].map(t => (
            <option key={t} value={t}>{t}</option>
          ))}
        </FormSelect>
        <div /> {/* spacer */}
        <FormField label="First Name" name="first_name" required placeholder="First name" />
        <FormField label="Middle Name" name="middle_name" placeholder="Middle name (optional)" />
        <FormField label="Last Name" name="last_name" placeholder="Last name" />
        <FormSelect label="Gender" name="gender" placeholder="Select gender...">
          {(genders.length > 0
            ? genders.map(g => ({ id: g.id, label: g.gender_name || (g as any).name || (g as any).label }))
            : [{ id: 'm', label: 'Male' }, { id: 'f', label: 'Female' }, { id: 'o', label: 'Other' }]
          ).map(g => (
            <option key={g.id} value={g.label}>{g.label}</option>
          ))}
        </FormSelect>
        <FormField label="Date of Birth" name="date_of_birth" type="date" />
        <FormField label="Age" name="age" type="number" placeholder="Age" hint="Enter age if DOB is not known" />
        <FormSelect label="Age Unit" name="age_unit">
          {['Years', 'Months', 'Days'].map(u => (
            <option key={u} value={u}>{u}</option>
          ))}
        </FormSelect>
        <FormSelect label="Blood Group" name="blood_group" placeholder="Select blood group...">
          {(bloodGroups.length > 0
            ? bloodGroups.map(bg => ({ id: bg.id, label: bg.blood_group || (bg as any).name || (bg as any).label }))
            : ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'].map(b => ({ id: b, label: b }))
          ).map(bg => (
            <option key={bg.id} value={bg.label}>{bg.label}</option>
          ))}
        </FormSelect>
        <FormSelect label="Marital Status" name="marital_status" placeholder="Select status...">
          {(maritalStatuses.length > 0
            ? maritalStatuses.map(s => ({ id: s.id, label: s.status_name || (s as any).name || (s as any).label }))
            : ['Single', 'Married', 'Divorced', 'Widowed'].map(s => ({ id: s, label: s }))
          ).map(s => (
            <option key={s.id} value={s.label}>{s.label}</option>
          ))}
        </FormSelect>

        <div>
          <FormSelect label="Religion" name="religion" placeholder="Select religion...">
            {['Hindu', 'Muslim', 'Christian', 'Sikh', 'Buddhist', 'Jain', 'Other'].map(r => (
              <option key={r} value={r}>{r}</option>
            ))}
          </FormSelect>
          {watch('religion') === 'Other' && (
            <div className="mt-2">
              <FormField label="Specify Religion" name="religion_other" placeholder="Specify your religion" />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
