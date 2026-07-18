'use client'

import React from 'react'
import { StepHeader, FormField, FormSelect } from '../FormComponents'

export default function Step02_BasicInfo() {
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
          {['Male', 'Female', 'Other', 'Prefer not to say'].map(g => (
            <option key={g} value={g}>{g}</option>
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
          {['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-', 'Unknown'].map(g => (
            <option key={g} value={g}>{g}</option>
          ))}
        </FormSelect>
        <FormSelect label="Marital Status" name="marital_status" placeholder="Select status...">
          {['Single', 'Married', 'Divorced', 'Widowed', 'Separated'].map(s => (
            <option key={s} value={s}>{s}</option>
          ))}
        </FormSelect>
      </div>
    </div>
  )
}
