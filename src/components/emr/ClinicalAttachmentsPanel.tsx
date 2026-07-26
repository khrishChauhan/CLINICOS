'use client'

import React, { useState, useEffect, useCallback, useRef } from 'react'
import { getClinicalAttachmentsAction, uploadClinicalAttachmentAction, deleteClinicalAttachmentAction, getAttachmentDownloadUrlAction } from '@/actions/emr/clinicalAttachmentActions'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import type { ClinicalAttachmentRow } from '@/types/emr'

const MAX_FILE_SIZE_MB = 50

export default function ClinicalAttachmentsPanel({ visitId }: { visitId: string }) {
  const [attachments, setAttachments] = useState<ClinicalAttachmentRow[]>([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [formType, setFormType] = useState('Medical Image')
  const [formRemarks, setFormRemarks] = useState('')

  const loadAttachments = useCallback(async () => {
    setLoading(true)
    const res = await getClinicalAttachmentsAction(visitId)
    if (res.success && res.data) setAttachments(res.data)
    setLoading(false)
  }, [visitId])

  useEffect(() => { loadAttachments() }, [loadAttachments])

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Client-side validation
    if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
      alert(`File size exceeds the ${MAX_FILE_SIZE_MB}MB limit.`)
      if (fileInputRef.current) fileInputRef.current.value = ''
      return
    }

    const mime = file.type || ''
    const isDicomExt = file.name.toLowerCase().endsWith('.dcm')
    const allowed = ['image/jpeg', 'image/png', 'application/pdf', 'application/dicom', 'image/dicom']
    
    if (!allowed.includes(mime) && !isDicomExt) {
      alert(`Invalid file type. Only JPEG, PNG, PDF, and DICOM are allowed. Received: ${mime || 'Unknown'}`)
      if (fileInputRef.current) fileInputRef.current.value = ''
      return
    }

    const formData = new FormData()
    formData.append('file', file)
    formData.append('attachment_type', formType)
    if (formRemarks) formData.append('remarks', formRemarks)

    setUploading(true)
    const res = await uploadClinicalAttachmentAction(visitId, formData)
    if (res.success && res.data) {
      setAttachments(prev => [res.data!, ...prev])
      setFormRemarks('')
      if (fileInputRef.current) fileInputRef.current.value = ''
    } else {
      alert(res.error || 'Upload failed')
    }
    setUploading(false)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this attachment?')) return
    const res = await deleteClinicalAttachmentAction(id)
    if (res.success) setAttachments(prev => prev.filter(a => a.id !== id))
  }

  const handlePreviewDownload = async (path: string, mime: string | null) => {
    const res = await getAttachmentDownloadUrlAction(path)
    if (!res.success || !res.url) return alert('Failed to generate download URL')
    
    if (mime === 'application/pdf' || mime?.startsWith('image/') && !mime.includes('dicom')) {
      // Preview standard formats in new tab
      window.open(res.url, '_blank')
    } else {
      // DICOM or others: force download behavior via an anchor tag
      const a = document.createElement('a')
      a.href = res.url
      a.download = ''
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
    }
  }

  return (
    <div className="space-y-6">
      {/* Upload Form */}
      <div className="bg-slate-50 p-5 rounded-xl border border-slate-200">
        <h3 className="font-semibold text-slate-800 border-b border-slate-200 pb-2 mb-4">Upload Clinical Attachment</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Attachment Type</label>
            <select
              className="w-full border border-slate-300 rounded-lg p-2 text-sm outline-none"
              value={formType}
              onChange={e => setFormType(e.target.value)}
            >
              <option>Medical Image</option>
              <option>Lab Report</option>
              <option>X-Ray</option>
              <option>MRI</option>
              <option>CT Scan</option>
              <option>Referral Document</option>
              <option>Consent Form</option>
              <option>Other</option>
            </select>
          </div>
          <div className="md:col-span-2">
            <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Remarks (Optional)</label>
            <Input value={formRemarks} onChange={e => setFormRemarks(e.target.value)} placeholder="e.g. Chest X-Ray PA View" />
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            accept=".jpg,.jpeg,.png,.pdf,.dcm,application/pdf,image/jpeg,image/png,application/dicom"
            onChange={handleFileChange}
          />
          <Button onClick={() => fileInputRef.current?.click()} disabled={uploading}>
            {uploading ? 'Uploading...' : '📁 Select File & Upload'}
          </Button>
          <span className="text-xs text-slate-400">Max size: {MAX_FILE_SIZE_MB}MB. Allowed: JPG, PNG, PDF, DICOM.</span>
        </div>
      </div>

      {/* Attachments List */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {loading && <div className="text-sm text-slate-400 p-4">Loading attachments...</div>}
        {!loading && attachments.length === 0 && (
          <div className="col-span-full text-center text-slate-400 text-sm py-10 border border-dashed border-slate-200 rounded-xl bg-slate-50">
            No clinical attachments uploaded for this visit.
          </div>
        )}
        {attachments.map(a => (
          <div key={a.id} className="border border-slate-200 rounded-xl bg-white p-4 shadow-sm flex flex-col">
            <div className="flex justify-between items-start mb-2">
              <span className="text-xs font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded">{a.attachment_type}</span>
              <button onClick={() => handleDelete(a.id)} className="text-slate-300 hover:text-red-500 transition-colors leading-none">&times;</button>
            </div>
            <div className="font-semibold text-sm text-slate-800 truncate mb-1" title={a.file_name}>{a.file_name}</div>
            <div className="text-xs text-slate-500 mb-2">
              Size: {(a.file_size / 1024 / 1024).toFixed(2)} MB · {new Date(a.uploaded_at).toLocaleDateString()}
            </div>
            {a.remarks && <p className="text-xs text-slate-600 bg-slate-50 p-2 rounded mb-3 flex-1">{a.remarks}</p>}
            {!a.remarks && <div className="flex-1" />}
            
            <Button
              variant="outline"
              size="sm"
              className="w-full mt-3"
              onClick={() => handlePreviewDownload(a.attachment_path, a.mime_type)}
            >
              {a.mime_type === 'application/pdf' || (a.mime_type?.startsWith('image/') && !a.mime_type.includes('dicom')) 
                ? '👁️ Preview'
                : '⬇️ Download'}
            </Button>
          </div>
        ))}
      </div>
    </div>
  )
}
