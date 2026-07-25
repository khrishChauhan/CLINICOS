'use client'

import React, { useState } from 'react'
import { createDoctorAction } from '@/actions/doctors/doctorActions'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import PhotoUpload from './PhotoUpload'

interface Props {
  doctorId: string | null
}

export default function DoctorProfileForm({ doctorId }: Props) {
  const [submitting, setSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    gender: 'Male',
    mobile_number: '',
    email: '',
    experience_years: ''
  })
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (doctorId) return // Update not implemented in this demo snippet
    
    setSubmitting(true)
    setError(null)
    const payload = {
      ...formData,
      experience_years: formData.experience_years ? parseFloat(formData.experience_years) : null
    }
    const res = await createDoctorAction(payload)
    if (res.success) {
      setSuccess(true)
      // Normally redirect to the new doctor's page
      setTimeout(() => window.location.href = `/doctors/${res.data.id}/profile`, 1000)
    } else {
      setError(res.error)
    }
    setSubmitting(false)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
      {error && <div className="p-3 bg-red-50 text-red-600 text-sm rounded">{error}</div>}
      {success && <div className="p-3 bg-green-50 text-green-600 text-sm rounded">Profile created! Redirecting...</div>}

      <div className="flex gap-6 items-start">
        {doctorId && <PhotoUpload doctorId={doctorId} currentPhoto={null} />}
        
        <div className="flex-1 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-semibold text-slate-700">First Name *</label>
              <Input required value={formData.first_name} onChange={e => setFormData({...formData, first_name: e.target.value})} />
            </div>
            <div>
              <label className="text-sm font-semibold text-slate-700">Last Name *</label>
              <Input required value={formData.last_name} onChange={e => setFormData({...formData, last_name: e.target.value})} />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-semibold text-slate-700">Email</label>
              <Input type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
            </div>
            <div>
              <label className="text-sm font-semibold text-slate-700">Mobile</label>
              <Input value={formData.mobile_number} onChange={e => setFormData({...formData, mobile_number: e.target.value})} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-semibold text-slate-700">Gender</label>
              <select 
                className="w-full mt-1 border border-slate-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                value={formData.gender} onChange={e => setFormData({...formData, gender: e.target.value})}
              >
                <option>Male</option>
                <option>Female</option>
                <option>Other</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-semibold text-slate-700">Experience (Years)</label>
              <Input type="number" step="0.5" value={formData.experience_years} onChange={e => setFormData({...formData, experience_years: e.target.value})} />
            </div>
          </div>
        </div>
      </div>

      <div className="pt-4 border-t border-slate-100 flex justify-end">
        <Button type="submit" disabled={submitting}>
          {submitting ? 'Saving...' : 'Save Profile'}
        </Button>
      </div>
    </form>
  )
}
