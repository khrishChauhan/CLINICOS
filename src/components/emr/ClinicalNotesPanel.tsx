'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { getClinicalNotesAction, addClinicalNoteAction, editClinicalNoteAction } from '@/actions/emr/clinicalNoteActions'
import { Button } from '@/components/ui/Button'
import type { ClinicalNoteRow } from '@/types/emr'

export default function ClinicalNotesPanel({ visitId }: { visitId: string }) {
  const [notes, setNotes] = useState<ClinicalNoteRow[]>([])
  const [loading, setLoading] = useState(false)
  const [formType, setFormType] = useState('Progress')
  const [formNote, setFormNote] = useState('')
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editContent, setEditContent] = useState('')
  const [savingEdit, setSavingEdit] = useState(false)

  const loadNotes = useCallback(async () => {
    const res = await getClinicalNotesAction(visitId)
    if (res.success && res.data) setNotes(res.data)
  }, [visitId])

  useEffect(() => { loadNotes() }, [loadNotes])

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formNote.trim()) return
    setLoading(true)
    const res = await addClinicalNoteAction(visitId, formType, formNote)
    if (res.success && res.data) {
      setNotes(prev => [...prev, res.data!])
      setFormNote('')
    }
    setLoading(false)
  }

  const handleSaveEdit = async (id: string) => {
    if (!editContent.trim()) return
    setSavingEdit(true)
    const res = await editClinicalNoteAction(id, editContent)
    if (res.success && res.data) {
      setNotes(prev => prev.map(n => n.id === id ? res.data! : n))
      setEditingId(null)
    }
    setSavingEdit(false)
  }

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        {notes.map(n => (
          <div key={n.id} className="p-4 rounded-xl border border-slate-200 bg-white shadow-sm relative group">
            <div className="flex justify-between items-start mb-2">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-slate-800 text-sm">{n.note_type} Note</span>
                <span className="text-xs text-slate-400">{new Date(n.entered_at).toLocaleString()}</span>
                {n.edit_history?.length > 0 && (
                  <div className="group/edit relative cursor-pointer">
                    <span className="text-[10px] bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded font-semibold">(Edited)</span>
                    <div className="absolute top-full left-0 mt-1 w-64 bg-slate-800 text-white text-xs p-2 rounded shadow-lg opacity-0 invisible group-hover/edit:opacity-100 group-hover/edit:visible transition-all z-10 pointer-events-none">
                      <div className="font-semibold mb-1">Edit History:</div>
                      {n.edit_history.map((h, i) => (
                        <div key={i} className="mb-2 last:mb-0 border-b border-slate-700 pb-2 last:border-0 last:pb-0">
                          <div className="text-[10px] text-slate-400">{new Date(h.edited_at).toLocaleString()}</div>
                          <div className="line-clamp-2">{h.previous_content}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              <button
                onClick={() => { setEditingId(n.id); setEditContent(n.note) }}
                className="text-xs font-semibold text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                Edit
              </button>
            </div>
            
            {editingId === n.id ? (
              <div className="mt-2 space-y-2">
                <textarea
                  className="w-full border border-blue-300 rounded-lg p-2 text-sm outline-none focus:ring-2 focus:ring-blue-100"
                  rows={3}
                  value={editContent}
                  onChange={e => setEditContent(e.target.value)}
                />
                <div className="flex gap-2 justify-end">
                  <Button size="sm" variant="outline" onClick={() => setEditingId(null)}>Cancel</Button>
                  <Button size="sm" onClick={() => handleSaveEdit(n.id)} disabled={savingEdit}>
                    {savingEdit ? 'Saving...' : 'Save Edit'}
                  </Button>
                </div>
              </div>
            ) : (
              <div className="text-sm text-slate-700 whitespace-pre-wrap">{n.note}</div>
            )}
          </div>
        ))}
        {notes.length === 0 && (
          <div className="text-slate-400 text-sm text-center py-6">No clinical notes recorded yet.</div>
        )}
      </div>

      <form onSubmit={handleAdd} className="bg-slate-50 p-4 rounded-xl border border-slate-200">
        <h4 className="font-semibold text-slate-700 text-sm mb-3">Add Clinical Note</h4>
        <div className="space-y-3">
          <select 
            className="w-full md:w-64 border border-slate-300 rounded-lg p-2 text-sm outline-none"
            value={formType}
            onChange={e => setFormType(e.target.value)}
          >
            <option value="Progress">Progress Note</option>
            <option value="Consultation">Consultation Note</option>
            <option value="Nursing">Nursing Note</option>
            <option value="Observation">Observation Note</option>
            <option value="Other">Other</option>
          </select>
          <textarea
            required
            className="w-full border border-slate-300 rounded-lg p-3 text-sm outline-none focus:border-blue-500 resize-y"
            rows={4}
            placeholder={`Enter ${formType.toLowerCase()} note...`}
            value={formNote}
            onChange={e => setFormNote(e.target.value)}
          />
          <div className="flex justify-end">
            <Button type="submit" disabled={loading || !formNote.trim()}>
              {loading ? 'Adding...' : '+ Add Note'}
            </Button>
          </div>
        </div>
      </form>
    </div>
  )
}
