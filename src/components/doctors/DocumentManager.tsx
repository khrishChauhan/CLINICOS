'use client'

import React, { useState, useEffect } from 'react'
import { getDoctorDocumentsAction, uploadDoctorDocumentAction, deleteDoctorDocumentAction } from '@/actions/doctors/documentActions'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/Table'

export default function DocumentManager({ doctorId }: { doctorId: string }) {
  const [documents, setDocuments] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  
  const [file, setFile] = useState<File | null>(null)
  const [docType, setDocType] = useState('Medical Registration')
  const [docName, setDocName] = useState('')
  const [remarks, setRemarks] = useState('')

  useEffect(() => {
    getDoctorDocumentsAction(doctorId).then(res => {
      if (res.success) setDocuments(res.data)
    })
  }, [doctorId])

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!file) return
    setLoading(true)
    const formData = new FormData()
    formData.append('file', file)
    formData.append('document_type', docType)
    formData.append('document_name', docName)
    formData.append('remarks', remarks)

    const res = await uploadDoctorDocumentAction(doctorId, formData)
    if (res.success) {
      const refreshRes = await getDoctorDocumentsAction(doctorId)
      if (refreshRes.success) setDocuments(refreshRes.data)
      setFile(null)
      setDocName('')
      setRemarks('')
    }
    setLoading(false)
  }

  const handleDelete = async (id: string, filePath: string) => {
    if (!confirm('Delete this document?')) return
    const res = await deleteDoctorDocumentAction(id, filePath)
    if (res.success) {
      setDocuments(documents.filter(d => d.id !== id))
    }
  }

  return (
    <div className="space-y-6">
      <form onSubmit={handleUpload} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 items-end bg-slate-50 p-4 rounded-xl">
        <div>
          <label className="text-xs font-semibold text-slate-500 uppercase">Document Type</label>
          <select 
            className="w-full mt-1 border border-slate-300 rounded-lg p-2 text-sm outline-none"
            value={docType} onChange={e => setDocType(e.target.value)}
          >
            <option>Medical Registration</option>
            <option>Degree</option>
            <option>Government ID</option>
            <option>Experience Certificate</option>
            <option>Other</option>
          </select>
        </div>
        <div>
          <label className="text-xs font-semibold text-slate-500 uppercase">Document Name *</label>
          <Input required value={docName} onChange={e => setDocName(e.target.value)} placeholder="e.g. MBBS Degree" />
        </div>
        <div>
          <label className="text-xs font-semibold text-slate-500 uppercase">Remarks</label>
          <Input value={remarks} onChange={e => setRemarks(e.target.value)} />
        </div>
        <div>
          <label className="text-xs font-semibold text-slate-500 uppercase">File *</label>
          <Input type="file" accept=".pdf,image/*" onChange={e => setFile(e.target.files?.[0] || null)} required />
        </div>
        <Button type="submit" disabled={loading || !file}>{loading ? '...' : 'Upload'}</Button>
      </form>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Type</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Remarks</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {documents.map(d => (
            <TableRow key={d.id}>
              <TableCell className="font-semibold">{d.document_type}</TableCell>
              <TableCell>{d.document_name}</TableCell>
              <TableCell className="text-slate-500 text-sm">{d.remarks}</TableCell>
              <TableCell className="text-right space-x-2">
                {d.signedUrl && (
                  <Button variant="outline" size="sm" onClick={() => window.open(d.signedUrl, '_blank')}>View</Button>
                )}
                <Button variant="outline" size="sm" onClick={() => handleDelete(d.id, d.file_path)} className="text-red-600 border-red-200">Delete</Button>
              </TableCell>
            </TableRow>
          ))}
          {documents.length === 0 && (
            <TableRow>
              <TableCell colSpan={4} className="text-center text-slate-500 py-4">No documents uploaded.</TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  )
}
