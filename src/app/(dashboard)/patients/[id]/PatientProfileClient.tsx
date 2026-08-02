'use client'

import React, { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { ChevronLeft, Edit, FileText, Activity, CreditCard, Stethoscope, Mail, Phone, Calendar, Clock, Droplets, MapPin, Upload, CheckCircle, XCircle } from 'lucide-react'
import type { PatientListItem } from '@/types/patients'
import { createClient } from '@/lib/supabase/client'
import { linkPatientDocument } from '@/actions/patients/linkDocument'
import { updatePatientStatusAction } from '@/actions/patients/patientActions'
import { usePermission } from '@/context/PermissionContext'
import { useAuth } from '@/context/AuthContext'
import EditPatientDrawer from './EditPatientDrawer'

interface Props {
  patient: PatientListItem
}

// ─────────────────────────────────────────────────────────────────────────────
// Confirmation Dialog (inline, no external dep)
// ─────────────────────────────────────────────────────────────────────────────

function ConfirmStatusDialog({
  patient,
  targetStatus,
  onConfirm,
  onCancel,
  isPending
}: {
  patient: PatientListItem
  targetStatus: 'Active' | 'Inactive'
  onConfirm: () => void
  onCancel: () => void
  isPending: boolean
}) {
  return (
    <div className="fixed inset-0 bg-slate-900/50 z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-label="Confirm status change">
      <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-6 space-y-4">
        <div className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto ${targetStatus === 'Inactive' ? 'bg-red-50' : 'bg-emerald-50'}`}>
          {targetStatus === 'Inactive'
            ? <XCircle className="w-6 h-6 text-red-500" />
            : <CheckCircle className="w-6 h-6 text-emerald-500" />
          }
        </div>
        <div className="text-center">
          <h3 className="font-bold text-slate-800 text-base">
            {targetStatus === 'Inactive' ? 'Deactivate Patient?' : 'Reactivate Patient?'}
          </h3>
          <p className="text-sm text-slate-500 mt-1">
            {targetStatus === 'Inactive'
              ? `${patient.fullName} will be marked as inactive and hidden from the default patient list.`
              : `${patient.fullName} will be reactivated and visible in the patient registry.`
            }
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            disabled={isPending}
            className="flex-1 px-4 py-2 border border-slate-200 rounded-lg font-semibold text-sm text-slate-600 hover:bg-slate-50 transition"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={isPending}
            aria-busy={isPending}
            className={`flex-1 px-4 py-2 rounded-lg font-bold text-sm text-white transition disabled:opacity-60 ${
              targetStatus === 'Inactive' ? 'bg-red-600 hover:bg-red-700' : 'bg-emerald-600 hover:bg-emerald-700'
            }`}
          >
            {isPending ? 'Updating…' : 'Confirm'}
          </button>
        </div>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Main Profile Client
// ─────────────────────────────────────────────────────────────────────────────

export default function PatientProfileClient({ patient: initialPatient }: Props) {
  const router = useRouter()
  const { hasPermission } = usePermission()
  const { session } = useAuth()

  const [patient, setPatient] = useState<PatientListItem>(initialPatient)
  const [activeTab, setActiveTab] = useState<'overview' | 'encounters' | 'documents' | 'billing'>('overview')
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [statusDialogOpen, setStatusDialogOpen] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)
  const [statusError, setStatusError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  const targetStatus: 'Active' | 'Inactive' = patient.status === 'Active' ? 'Inactive' : 'Active'

  // ── Edit success → refresh patient data from server
  const handleEditSuccess = () => {
    router.refresh()  // revalidatePath fires on server, Next.js re-fetches the page
  }

  // ── Status toggle
  const handleStatusConfirm = () => {
    startTransition(async () => {
      const result = await updatePatientStatusAction(patient.id, targetStatus)
      if (result.ok) {
        setPatient(prev => ({ ...prev, status: targetStatus }))
        setStatusDialogOpen(false)
      } else {
        const errResult = result as { ok: false; error: string; message?: string }
        setStatusError(errResult.message || 'Failed to update status')
        setStatusDialogOpen(false)
      }
    })
  }

  // ── Document upload
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setIsUploading(true)
    setUploadError(null)

    try {
      const supabase = createClient()
      const clinicId = session?.clinic_id || 'unknown'
      const fileExt = file.name.split('.').pop()
      const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`
      const filePath = `${patient.id}/${fileName}`

      const { data: uploadData, error: uploadErr } = await supabase.storage
        .from('patient_documents')
        .upload(filePath, file)
      if (uploadErr) throw uploadErr

      const { data: { publicUrl } } = supabase.storage
        .from('patient_documents')
        .getPublicUrl(filePath)

      const result = await linkPatientDocument({
        patientId: patient.id,
        filePath: uploadData.path,
        fileUrl: publicUrl,
        fileName,
        originalFileName: file.name,
        fileExtension: fileExt || '',
        mimeType: file.type,
        fileSizeBytes: file.size,
        documentType: 'General',
        documentName: file.name
      })

      if (!result.ok) throw new Error((result as any).error)

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
      {/* Edit Drawer */}
      {isEditOpen && (
        <EditPatientDrawer
          patient={patient}
          open={isEditOpen}
          onClose={() => setIsEditOpen(false)}
          onSuccess={handleEditSuccess}
        />
      )}

      {/* Status Confirm Dialog */}
      {statusDialogOpen && (
        <ConfirmStatusDialog
          patient={patient}
          targetStatus={targetStatus}
          onConfirm={handleStatusConfirm}
          onCancel={() => setStatusDialogOpen(false)}
          isPending={isPending}
        />
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.push('/patients')}
            aria-label="Back to patient list"
            className="w-10 h-10 rounded-full border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-slate-50 transition"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-xl font-bold shadow-sm" aria-hidden="true">
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

        <div className="flex items-center gap-2 flex-wrap">
          {/* Status Toggle */}
          {hasPermission('patients.edit') && (
            <button
              onClick={() => setStatusDialogOpen(true)}
              disabled={isPending}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg border font-semibold text-sm transition ${
                patient.status === 'Active'
                  ? 'border-red-200 bg-red-50 text-red-600 hover:bg-red-100'
                  : 'border-emerald-200 bg-emerald-50 text-emerald-600 hover:bg-emerald-100'
              }`}
            >
              {patient.status === 'Active'
                ? <><XCircle className="w-4 h-4" /> Deactivate</>
                : <><CheckCircle className="w-4 h-4" /> Reactivate</>
              }
            </button>
          )}

          {/* Edit Button */}
          {hasPermission('patients.edit') && (
            <button
              onClick={() => setIsEditOpen(true)}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-lg hover:bg-slate-50 font-semibold text-sm shadow-sm transition"
              aria-label="Edit patient profile"
            >
              <Edit className="w-4 h-4" /> Edit Profile
            </button>
          )}
        </div>
      </div>

      {/* Status error toast */}
      {statusError && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-700 flex items-center gap-2">
          <XCircle className="w-4 h-4 shrink-0" />
          {statusError}
          <button onClick={() => setStatusError(null)} className="ml-auto text-red-500 hover:text-red-700 text-xs">Dismiss</button>
        </div>
      )}

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
                    {patient.registrationDate ? new Date(patient.registrationDate).toLocaleDateString() : 'Unknown'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="lg:col-span-3 space-y-6">
          {/* Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto border-b border-slate-200 hide-scrollbar pb-px" role="tablist">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                role="tab"
                aria-selected={activeTab === tab.id}
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
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 min-h-[400px]" role="tabpanel">
            {activeTab === 'overview' && (
              <div className="space-y-8">
                <div>
                  <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2 text-lg">
                    <Activity className="w-5 h-5 text-slate-400" /> Patient Overview
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-slate-50 rounded-lg p-3">
                      <p className="text-xs text-slate-500">Patient Type</p>
                      <p className="font-semibold text-slate-800 mt-0.5">{patient.patientType || '—'}</p>
                    </div>
                    <div className="bg-slate-50 rounded-lg p-3">
                      <p className="text-xs text-slate-500">Status</p>
                      <p className="font-semibold text-slate-800 mt-0.5">{patient.status}</p>
                    </div>
                  </div>
                  <p className="text-slate-500 text-sm mt-4">
                    Detailed clinical history, vitals, and EMR timeline will be available via the EMR module.
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
                    <input type="file" id="docUpload" className="hidden" onChange={handleFileUpload} aria-label="Upload document" />
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
                <p className="text-sm">This feature will be available in the upcoming Integration Phase.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
