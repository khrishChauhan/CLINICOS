'use client'

import React, { useState, useEffect } from 'react'
import { StepHeader, FormField, FormSelect } from '../FormComponents'
import { getMasterDataAction } from '@/actions/master/masterActions'
import type { MasterGender, MasterBloodGroup, MasterMaritalStatus } from '@/types/master'

export default function Step02_BasicInfo() {
  const [genders, setGenders] = useState<MasterGender[]>([])
  const [bloodGroups, setBloodGroups] = useState<MasterBloodGroup[]>([])
  const [maritalStatuses, setMaritalStatuses] = useState<MasterMaritalStatus[]>([])

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
          {genders.map(g => (
            <option key={g.id} value={g.gender_name}>{g.gender_name}</option>
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
          {bloodGroups.map(bg => (
            <option key={bg.id} value={bg.blood_group}>{bg.blood_group}</option>
          ))}
        </FormSelect>
        <FormSelect label="Marital Status" name="marital_status" placeholder="Select status...">
          {maritalStatuses.map(s => (
            <option key={s.id} value={s.status_name}>{s.status_name}</option>
          ))}
        </FormSelect>
      </div>
    </div>
  )
}
