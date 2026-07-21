'use client'

import React, { useState, useEffect } from 'react'
import { fetchAppointmentDocumentsAction, linkAppointmentDocumentAction, deleteAppointmentDocumentAction } from '@/actions/appointments/appointmentDocumentActions'
import { createClient } from '@/lib/supabase/client'
import type { AppointmentDocumentRow } from '@/types/appointments'
import { X, Upload, FileText, Trash2 } from 'lucide-react'

interface Props {
  appointmentId: string
  onClose: () => void
}

export default function AppointmentDocumentsDialog({ appointmentId, onClose }: Props) {
  const [documents, setDocuments] = useState<AppointmentDocumentRow[]>([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const supabase = createClient()

  useEffect(() => {
    loadDocs()
  }, [])

  const loadDocs = async () => {
    setLoading(true)
    const res = await fetchAppointmentDocumentsAction(appointmentId)
    if (res.success) setDocuments(res.data)
    setLoading(false)
  }

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return
    const file = e.target.files[0]
    setUploading(true)

    try {
      const ext = file.name.split('.').pop()
      const path = `${appointmentId}/${Date.now()}.${ext}`
      
      const { data: uploadData, error: uploadErr } = await supabase.storage
        .from('patient-documents') // reusing this bucket as decided
        .upload(path, file)

      if (uploadErr) throw uploadErr

      const res = await linkAppointmentDocumentAction(appointmentId, uploadData.path, 'General')
      if (res.success) {
        await loadDocs()
      } else {
        alert(res.error)
      }
    } catch (err: any) {
      alert(err.message)
    } finally {
      setUploading(false)
    }
  }

  const handleDelete = async (id: string, path: string) => {
    if (!confirm('Are you sure you want to delete this document?')) return
    const res = await deleteAppointmentDocumentAction(id, path)
    if (res.success) {
      setDocuments(prev => prev.filter(d => d.id !== id))
    } else {
      alert(res.error)
    }
  }

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden flex flex-col h-[80vh]">
        <div className="flex items-center justify-between p-6 border-b border-slate-100">
          <h2 className="text-xl font-bold text-slate-800">Appointment Documents</h2>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 rounded-lg transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
          <p className="text-sm text-slate-600">Upload and manage related documents.</p>
          <div>
            <input type="file" id="docUpload" className="hidden" onChange={handleUpload} />
            <label htmlFor="docUpload" className={`flex items-center gap-2 px-4 py-2 bg-blue-600 text-white font-semibold text-sm rounded-lg shadow-sm transition ${uploading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-700 cursor-pointer'}`}>
              <Upload className="w-4 h-4" /> 
              {uploading ? 'Uploading...' : 'Upload'}
            </label>
          </div>
        </div>

        <div className="flex-1 p-6 overflow-y-auto bg-slate-50">
          {loading ? (
            <p className="text-slate-500 text-center">Loading...</p>
          ) : documents.length === 0 ? (
            <div className="text-center py-12 text-slate-400">
              <FileText className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>No documents found.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {documents.map(doc => (
                <div key={doc.id} className="bg-white p-4 rounded-xl border border-slate-200 flex justify-between items-center shadow-sm">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                      <FileText className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-700 text-sm">{doc.attachment_id.split('/').pop()}</h4>
                      <p className="text-xs text-slate-400">{new Date(doc.uploaded_at).toLocaleString()}</p>
                    </div>
                  </div>
                  <button onClick={() => handleDelete(doc.id, doc.attachment_id)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
