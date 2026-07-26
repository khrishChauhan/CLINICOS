'use client'

import React, { useState, useEffect } from 'react'
import { getDoctorSignaturesAction, uploadDoctorSignatureAction, deleteDoctorSignatureAction } from '@/actions/doctors/signatureActions'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'

export default function SignatureManager({ doctorId }: { doctorId: string }) {
  const [signatures, setSignatures] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [file, setFile] = useState<File | null>(null)
  const [signatureType, setSignatureType] = useState('Scanned')

  useEffect(() => {
    getDoctorSignaturesAction(doctorId).then(res => {
      if (res.success) setSignatures(res.data)
    })
  }, [doctorId])

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!file) return
    setLoading(true)
    const formData = new FormData()
    formData.append('file', file)
    formData.append('signature_type', signatureType)

    const res = await uploadDoctorSignatureAction(doctorId, formData)
    if (res.success) {
      // Re-fetch to get Signed URL
      const refreshRes = await getDoctorSignaturesAction(doctorId)
      if (refreshRes.success) setSignatures(refreshRes.data)
      setFile(null)
    }
    setLoading(false)
  }

  const handleDelete = async (id: string, filePath: string) => {
    if (!confirm('Delete this signature?')) return
    const res = await deleteDoctorSignatureAction(id, filePath)
    if (res.success) {
      setSignatures(signatures.filter(s => s.id !== id))
    }
  }

  return (
    <div className="space-y-6">
      <form onSubmit={handleUpload} className="flex gap-4 items-end bg-slate-50 p-4 rounded-xl flex-wrap">
        <div>
          <label className="text-xs font-semibold text-slate-500 uppercase">Signature Type</label>
          <select 
            className="w-full mt-1 border border-slate-300 rounded-lg p-2 text-sm outline-none"
            value={signatureType} onChange={e => setSignatureType(e.target.value)}
          >
            <option>Scanned</option>
            <option>Digital Certificate</option>
          </select>
        </div>
        <div className="flex-1">
          <label className="text-xs font-semibold text-slate-500 uppercase">Upload File</label>
          <Input type="file" accept="image/*,.pdf" onChange={e => setFile(e.target.files?.[0] || null)} required />
        </div>
        <Button type="submit" disabled={loading || !file}>{loading ? '...' : 'Upload'}</Button>
      </form>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {signatures.map(s => (
          <div key={s.id} className="border border-slate-200 rounded-xl p-4 flex flex-col items-center gap-4 bg-white shadow-sm">
            <span className="text-xs font-bold text-slate-500 uppercase">{s.signature_type}</span>
            {s.signedUrl ? (
               <img src={s.signedUrl} alt="Signature" className="max-h-[100px] object-contain border border-dashed border-slate-300 p-2 rounded" />
            ) : (
               <div className="h-[100px] flex items-center justify-center text-slate-400 text-sm">Failed to load preview</div>
            )}
            <Button variant="outline" size="sm" onClick={() => handleDelete(s.id, s.file_path)} className="w-full text-red-600 border-red-200 hover:bg-red-50">Delete</Button>
          </div>
        ))}
        {signatures.length === 0 && (
          <div className="col-span-full text-center text-slate-500 py-8">No signatures uploaded.</div>
        )}
      </div>
    </div>
  )
}
