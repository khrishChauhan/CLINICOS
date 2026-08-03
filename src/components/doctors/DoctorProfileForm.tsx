'use client'

import React, { useState, useEffect } from 'react'
import { createDoctorAction, getDoctorByIdAction, updateDoctorAction, deleteDoctorAction } from '@/actions/doctors/doctorActions'
import { getMasterDataAction } from '@/actions/master/masterActions'
import type { MasterGender, MasterBloodGroup } from '@/types/master'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import PhotoUpload from './PhotoUpload'

interface Props {
  doctorId: string | null
  onSaveSuccess?: () => void
}

export default function DoctorProfileForm({ doctorId, onSaveSuccess }: Props) {
  const [loading, setLoading] = useState(!!doctorId)
  const [submitting, setSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    gender: '',
    blood_group: '',
    mobile_number: '',
    email: '',
    experience_years: ''
  })
  const [genders, setGenders] = useState<MasterGender[]>([])
  const [bloodGroups, setBloodGroups] = useState<MasterBloodGroup[]>([])
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  useEffect(() => {
    async function load() {
      if (doctorId) {
        setLoading(true)
        const docRes = await getDoctorByIdAction(doctorId)
        if (docRes.success && docRes.data) {
          const doc = docRes.data
          setFormData({
            first_name: doc.first_name || '',
            last_name: doc.last_name || '',
            gender: doc.gender || '',
            blood_group: doc.blood_group || '',
            mobile_number: doc.mobile_number || '',
            email: doc.email || '',
            experience_years: doc.experience_years !== null && doc.experience_years !== undefined ? String(doc.experience_years) : ''
          })
        } else {
          setError(docRes.error || 'Failed to load doctor profile')
        }
        setLoading(false)
      }

      const [gRes, bRes] = await Promise.all([
        getMasterDataAction<MasterGender>('genders'),
        getMasterDataAction<MasterBloodGroup>('blood_groups')
      ])
      if (gRes.success && gRes.data) setGenders(gRes.data)
      if (bRes.success && bRes.data) setBloodGroups(bRes.data)
    }
    load()
  }, [doctorId])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setError(null)
    setSuccess(null)

    const payload = {
      ...formData,
      experience_years: formData.experience_years ? parseFloat(formData.experience_years) : null
    }

    if (doctorId) {
      // Update existing doctor
      const res = await updateDoctorAction(doctorId, payload)
      if (res.success) {
        setSuccess('Doctor profile updated successfully!')
        if (onSaveSuccess) setTimeout(onSaveSuccess, 500)
      } else {
        setError(res.error || 'Failed to update doctor profile')
      }
    } else {
      // Create new doctor
      const res = await createDoctorAction(payload)
      if (res.success) {
        setSuccess('Profile created successfully! Redirecting...')
        setTimeout(() => window.location.href = `/doctors/${res.data.id}/profile`, 1000)
      } else {
        setError(res.error || 'Failed to create doctor profile')
      }
    }
    setSubmitting(false)
  }

  const handleDelete = async () => {
    if (!doctorId) return
    if (!window.confirm('Are you sure you want to delete this doctor profile? This action cannot be undone.')) return
    setSubmitting(true)
    const res = await deleteDoctorAction(doctorId)
    if (res.success) {
      window.location.href = '/doctors'
    } else {
      setError(res.error || 'Failed to delete doctor profile')
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="py-12 flex justify-center items-center text-slate-400 text-sm">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mr-3"></div>
        Loading doctor profile...
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
      {error && <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg">{error}</div>}
      {success && <div className="p-3 bg-green-50 text-green-600 text-sm rounded-lg">{success}</div>}

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
                <option value="">Select Gender</option>
                {(genders.length > 0
                  ? genders.map(g => ({ id: g.id, label: g.gender_name || (g as any).name || (g as any).label }))
                  : [{ id: 'm', label: 'Male' }, { id: 'f', label: 'Female' }, { id: 'o', label: 'Other' }]
                ).map(g => (
                  <option key={g.id} value={g.label}>{g.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-sm font-semibold text-slate-700">Blood Group</label>
              <select 
                className="w-full mt-1 border border-slate-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                value={formData.blood_group} onChange={e => setFormData({...formData, blood_group: e.target.value})}
              >
                <option value="">Select Blood Group</option>
                {(bloodGroups.length > 0
                  ? bloodGroups.map(bg => ({ id: bg.id, label: bg.blood_group || (bg as any).name || (bg as any).label }))
                  : ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'].map(b => ({ id: b, label: b }))
                ).map(bg => (
                  <option key={bg.id} value={bg.label}>{bg.label}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-semibold text-slate-700">Experience (Years)</label>
              <Input type="number" step="0.5" value={formData.experience_years} onChange={e => setFormData({...formData, experience_years: e.target.value})} />
            </div>
          </div>
        </div>
      </div>

      <div className="pt-4 border-t border-slate-100 flex justify-between items-center">
        {doctorId ? (
          <Button type="button" variant="outline" className="text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700" onClick={handleDelete} disabled={submitting}>
            Delete Doctor
          </Button>
        ) : <div />}
        <Button type="submit" disabled={submitting}>
          {submitting ? 'Saving...' : doctorId ? 'Update Profile' : 'Save Profile'}
        </Button>
      </div>
    </form>
  )
}
