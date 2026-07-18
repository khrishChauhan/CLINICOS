'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ChevronLeft, Edit, FileText, Activity, CreditCard, Stethoscope, Mail, Phone, Calendar, Clock, Droplets, MapPin, Upload } from 'lucide-react'
import type { PatientListItem } from '@/types/patients'
import { createClient } from '@/lib/supabase/client'
import { linkPatientDocument } from '@/actions/patients/linkDocument'
import { usePermission } from '@/context/PermissionContext'
import { useAuth } from '@/context/AuthContext'

interface Props {
  patient: PatientListItem
}

export default function PatientProfileClient({ patient }: Props) {
  const router = useRouter()
  const { hasPermission } = usePermission()
  const { session } = useAuth()
  
  const [activeTab, setActiveTab] = useState<'overview' | 'encounters' | 'documents' | 'billing'>('overview')
  const [isUploading, setIsUploading] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setIsUploading(true)
    setUploadError(null)

    try {
      const supabase = createClient()
      
      // Get clinic ID from token or session metadata
      const clinicId = session?.clinic_id || 'unknown'
      
      const fileExt = file.name.split('.').pop()
      const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`
      const filePath = `${patient.id}/${fileName}`
      
      // Upload to Supabase Storage
      const { data: uploadData, error: uploadErr } = await supabase.storage
        .from('patient_documents')
        .upload(filePath, file)
        
      if (uploadErr) throw uploadErr
      
      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('patient_documents')
        .getPublicUrl(filePath)
        
      // Link to Database
      const result = await linkPatientDocument({
        patientId: patient.id,
        filePath: uploadData.path,
        fileUrl: publicUrl,
        fileName: fileName,
        originalFileName: file.name,
        fileExtension: fileExt || '',
        mimeType: file.type,
        fileSizeBytes: file.size,
        documentType: 'General',
        documentName: file.name
      })
      
      if (!result.ok) {
        throw new Error((result as any).error)
      }
      
      alert('Document uploaded successfully!')
      
    } catch (err: any) {
      setUploadError(err.message || 'Failed to upload document')
    } finally {
      setIsUploading(false)
    }
  }

  const tabs = [
    { id: 'overview', label: 'Overview', icon: Activity },
    { id: 'encounters', label: 'Encounters', icon: Stethoscope },
    { id: 'documents', label: 'Documents', icon: FileText },
    { id: 'billing', label: 'Billing', icon: CreditCard },
  ] as const

  return (
    <div className="flex-1 p-6 max-w-7xl mx-auto space-y-6 w-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => router.push('/patients')}
            className="w-10 h-10 rounded-full border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-slate-50 transition"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-xl font-bold shadow-sm">
              {patient.initials}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                {patient.fullName}
                <span className={`px-2 py-0.5 rounded text-xs font-bold ${
                  patient.status === 'Active' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'
                }`}>
                  {patient.status}
                </span>
              </h1>
              <p className="text-sm font-mono text-slate-500 mt-0.5">{patient.uhid}</p>
            </div>
          </div>
        </div>
        
        {hasPermission('patients.edit') && (
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-lg hover:bg-slate-50 font-semibold text-sm shadow-sm transition">
            <Edit className="w-4 h-4" /> Edit Profile
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        {/* Left Sidebar (Quick Stats) */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Quick Info</h3>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 shrink-0">
                  <Phone className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs text-slate-500">Mobile</p>
                  <p className="text-sm font-semibold text-slate-800">{patient.mobileNumber}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600 shrink-0">
                  <Calendar className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs text-slate-500">Age / Gender</p>
                  <p className="text-sm font-semibold text-slate-800">{patient.age} {patient.ageUnit}, {patient.gender}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-rose-50 flex items-center justify-center text-rose-600 shrink-0">
                  <Droplets className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs text-slate-500">Blood Group</p>
                  <p className="text-sm font-semibold text-slate-800">{patient.bloodGroup || 'Unknown'}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-amber-50 flex items-center justify-center text-amber-600 shrink-0">
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs text-slate-500">Registered</p>
                  <p className="text-sm font-semibold text-slate-800">
                    {new Date(patient.registrationDate).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="lg:col-span-3 space-y-6">
          
          {/* Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto border-b border-slate-200 hide-scrollbar pb-px">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-3 text-sm font-semibold transition border-b-2 whitespace-nowrap ${
                  activeTab === tab.id 
                    ? 'border-blue-600 text-blue-600' 
                    : 'border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-50'
                }`}
              >
                <tab.icon className="w-4 h-4" /> {tab.label}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 min-h-[400px]">
            {activeTab === 'overview' && (
              <div className="space-y-8">
                <div>
                  <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2 text-lg">
                    <Activity className="w-5 h-5 text-slate-400" /> Patient Overview
                  </h3>
                  <p className="text-slate-500 text-sm">
                    This module is currently read-only. Detailed patient history, demographics, and clinical timeline will be implemented in subsequent phases.
                  </p>
                </div>
              </div>
            )}

            {activeTab === 'documents' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-slate-800 text-lg flex items-center gap-2">
                    <FileText className="w-5 h-5 text-slate-400" /> Patient Documents
                  </h3>
                  
                  <div>
                    <input type="file" id="docUpload" className="hidden" onChange={handleFileUpload} />
                    <label htmlFor="docUpload" className={`flex items-center gap-2 px-4 py-2 bg-blue-600 text-white font-semibold text-sm rounded-lg shadow-sm transition ${isUploading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-700 cursor-pointer'}`}>
                      <Upload className="w-4 h-4" /> 
                      {isUploading ? 'Uploading...' : 'Upload Document'}
                    </label>
                  </div>
                </div>
                
                {uploadError && <p className="text-sm text-red-500">{uploadError}</p>}

                <div className="border-2 border-dashed border-slate-200 rounded-xl p-10 flex flex-col items-center justify-center text-center">
                  <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                    <FileText className="w-8 h-8 text-slate-400" />
                  </div>
                  <h4 className="font-bold text-slate-700 mb-1">No documents uploaded</h4>
                  <p className="text-sm text-slate-500 max-w-sm">
                    Upload medical reports, prescriptions, ID proofs, or any other relevant documents for this patient.
                  </p>
                </div>
              </div>
            )}
            
            {(activeTab === 'encounters' || activeTab === 'billing') && (
              <div className="flex flex-col items-center justify-center h-64 text-slate-500">
                <Stethoscope className="w-12 h-12 text-slate-200 mb-4" />
                <p className="font-medium text-slate-600">Module under construction</p>
                <p className="text-sm">This feature will be available in the upcoming Sprint.</p>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  )
}
