'use client'

import React, { useState, useEffect } from 'react'
import { uploadDoctorPhotoAction, getDoctorPhotoUrlAction } from '@/actions/doctors/doctorPhotoActions'
import { User } from 'lucide-react'

export default function PhotoUpload({ doctorId, currentPhoto }: { doctorId: string, currentPhoto: string | null }) {
  const [photoUrl, setPhotoUrl] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)

  useEffect(() => {
    if (currentPhoto) {
      getDoctorPhotoUrlAction(currentPhoto).then(res => {
        if (res.success) setPhotoUrl(res.url)
      })
    }
  }, [currentPhoto])

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    const formData = new FormData()
    formData.append('photo', file)
    
    const res = await uploadDoctorPhotoAction(doctorId, formData)
    if (res.success) {
      const urlRes = await getDoctorPhotoUrlAction(res.path)
      if (urlRes.success) setPhotoUrl(urlRes.url)
    }
    setUploading(false)
  }

  return (
    <div className="flex flex-col items-center space-y-4">
      <div className="w-32 h-32 rounded-full border-4 border-slate-100 shadow-sm overflow-hidden bg-slate-50 flex items-center justify-center relative group">
        {photoUrl ? (
          <img src={photoUrl} alt="Profile" className="w-full h-full object-cover" />
        ) : (
          <User className="w-12 h-12 text-slate-300" />
        )}
        
        <label className="absolute inset-0 bg-black/50 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity text-sm font-semibold">
          {uploading ? 'Uploading...' : 'Upload'}
          <input type="file" accept="image/*" className="hidden" onChange={handleFileChange} disabled={uploading} />
        </label>
      </div>
      <p className="text-xs text-slate-400">JPG, PNG under 2MB</p>
    </div>
  )
}
