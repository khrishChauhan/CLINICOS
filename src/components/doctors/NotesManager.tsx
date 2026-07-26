'use client'

import React, { useState, useEffect } from 'react'
import { getDoctorNotesAction, createDoctorNoteAction, deleteDoctorNoteAction } from '@/actions/doctors/noteActions'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'

export default function NotesManager({ doctorId }: { doctorId: string }) {
  const [notes, setNotes] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [noteType, setNoteType] = useState('HR')
  const [noteContent, setNoteContent] = useState('')

  useEffect(() => {
    getDoctorNotesAction(doctorId).then(res => {
      if (res.success) setNotes(res.data)
    })
  }, [doctorId])

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    const res = await createDoctorNoteAction({
      doctor_id: doctorId,
      note_type: noteType,
      note: noteContent
    })
    if (res.success) {
      setNotes([res.data, ...notes])
      setNoteContent('')
    }
    setLoading(false)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Delete note?')) return
    const res = await deleteDoctorNoteAction(id)
    if (res.success) setNotes(notes.filter(n => n.id !== id))
  }

  return (
    <div className="space-y-6">
      <form onSubmit={handleAdd} className="flex gap-4 items-end bg-yellow-50/50 p-4 rounded-xl flex-wrap border border-yellow-100">
        <div>
          <label className="text-xs font-semibold text-slate-500 uppercase">Note Type</label>
          <select 
            className="w-full mt-1 border border-slate-300 rounded-lg p-2 text-sm outline-none"
            value={noteType} onChange={e => setNoteType(e.target.value)}
          >
            <option>HR</option>
            <option>Administrative</option>
            <option>Performance Review</option>
          </select>
        </div>
        <div className="flex-1">
          <label className="text-xs font-semibold text-slate-500 uppercase">Internal Note (Private)</label>
          <Input required value={noteContent} onChange={e => setNoteContent(e.target.value)} placeholder="Enter details..." />
        </div>
        <Button type="submit" disabled={loading}>{loading ? 'Saving...' : 'Add Note'}</Button>
      </form>

      <div className="space-y-4">
        {notes.map(n => (
          <div key={n.id} className="p-4 rounded-xl border border-slate-200 bg-white shadow-sm flex justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs font-bold text-slate-500 uppercase bg-slate-100 px-2 py-1 rounded">{n.note_type}</span>
                <span className="text-xs text-slate-400">{new Date(n.created_at).toLocaleString()}</span>
              </div>
              <p className="text-sm text-slate-700 whitespace-pre-wrap">{n.note}</p>
            </div>
            <Button variant="outline" size="sm" className="text-red-600 self-start" onClick={() => handleDelete(n.id)}>Delete</Button>
          </div>
        ))}
        {notes.length === 0 && <div className="text-center text-slate-500 py-4">No internal notes found.</div>}
      </div>
    </div>
  )
}
