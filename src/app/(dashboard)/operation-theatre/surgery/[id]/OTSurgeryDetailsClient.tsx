'use client'

import React, { useState } from 'react'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { addSurgeryNoteAction, logConsumableAction } from '@/actions/ot/otActions'
import { toast } from 'sonner'
import dayjs from 'dayjs'

export function OTSurgeryDetailsClient({ surgery, initialNotes, initialConsumables, medicines }: any) {
  const [notes, setNotes] = useState(initialNotes)
  const [consumables, setConsumables] = useState(initialConsumables)
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  const isReadOnly = surgery.status === 'Completed' || surgery.status === 'Cancelled'

  const [newNote, setNewNote] = useState({ type: 'Intra-Op', content: '' })
  const [newConsumable, setNewConsumable] = useState({ medicineId: '', quantity: 1, batch: '' })

  const handleAddNote = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newNote.content) return
    setIsSubmitting(true)
    const res = await addSurgeryNoteAction(surgery.id, newNote.type, newNote.content)
    setIsSubmitting(false)
    if (res.ok) {
      toast.success('Note added')
      setNotes([res.data, ...notes]) // Prepend locally
      setNewNote({ ...newNote, content: '' })
    } else {
      toast.error(res.error)
    }
  }

  const handleAddConsumable = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newConsumable.medicineId || newConsumable.quantity <= 0) return
    setIsSubmitting(true)
    const res = await logConsumableAction(surgery.id, newConsumable.medicineId, newConsumable.quantity, newConsumable.batch)
    setIsSubmitting(false)
    if (res.ok) {
      toast.success('Consumable logged')
      // Map medicine name for local update
      const medicine = medicines.find((m: any) => m.id === newConsumable.medicineId)
      setConsumables([{ ...res.data, medicine }, ...consumables])
      setNewConsumable({ medicineId: '', quantity: 1, batch: '' })
    } else {
      toast.error(res.error)
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      
      {/* Notes Section */}
      <Card className="p-6">
        <h2 className="text-xl font-bold text-slate-800 mb-4">Clinical Notes</h2>
        
        {!isReadOnly && (
          <form onSubmit={handleAddNote} className="mb-6 space-y-3 bg-slate-50 p-4 rounded-lg border border-slate-200">
            <div className="flex gap-4">
              <select 
                className="p-2 border rounded-lg text-sm bg-white"
                value={newNote.type} 
                onChange={e => setNewNote({...newNote, type: e.target.value})}
              >
                <option value="Pre-Op">Pre-Op</option>
                <option value="Intra-Op">Intra-Op</option>
                <option value="Post-Op">Post-Op</option>
                <option value="Anesthesia">Anesthesia</option>
              </select>
            </div>
            <textarea 
              className="w-full p-2 border rounded-lg text-sm bg-white h-24"
              placeholder="Enter clinical observations..."
              value={newNote.content}
              onChange={e => setNewNote({...newNote, content: e.target.value})}
            />
            <Button size="sm" type="submit" disabled={isSubmitting || !newNote.content}>Save Note</Button>
          </form>
        )}

        <div className="space-y-4 max-h-[400px] overflow-y-auto">
          {notes.length === 0 ? <p className="text-sm text-slate-500">No notes recorded yet.</p> : null}
          {notes.map((note: any) => (
            <div key={note.id} className="p-3 border border-slate-200 rounded-lg text-sm bg-white shadow-sm">
              <div className="flex justify-between items-center mb-1 pb-1 border-b border-slate-100">
                <span className="font-semibold text-blue-700">{note.note_type}</span>
                <span className="text-xs text-slate-400">{dayjs(note.recorded_at).format('DD MMM, HH:mm')} by {note.recorder?.last_name || 'Staff'}</span>
              </div>
              <p className="whitespace-pre-wrap text-slate-700">{note.content}</p>
            </div>
          ))}
        </div>
      </Card>

      {/* Consumables Section */}
      <Card className="p-6">
        <h2 className="text-xl font-bold text-slate-800 mb-4">Consumables & Implants</h2>
        
        {!isReadOnly && (
          <form onSubmit={handleAddConsumable} className="mb-6 space-y-3 bg-slate-50 p-4 rounded-lg border border-slate-200">
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">Select Item</label>
              <select 
                className="w-full p-2 border rounded-lg text-sm bg-white"
                value={newConsumable.medicineId} 
                onChange={e => setNewConsumable({...newConsumable, medicineId: e.target.value})}
              >
                <option value="">-- Choose Item --</option>
                {medicines.map((m: any) => (
                  <option key={m.id} value={m.id}>{m.brand_name || m.generic_name}</option>
                ))}
              </select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">Quantity</label>
                <input 
                  type="number" 
                  min="1"
                  className="w-full p-2 border rounded-lg text-sm bg-white"
                  value={newConsumable.quantity}
                  onChange={e => setNewConsumable({...newConsumable, quantity: parseInt(e.target.value) || 1})}
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">Batch / Serial</label>
                <input 
                  type="text" 
                  className="w-full p-2 border rounded-lg text-sm bg-white"
                  placeholder="Optional"
                  value={newConsumable.batch}
                  onChange={e => setNewConsumable({...newConsumable, batch: e.target.value})}
                />
              </div>
            </div>
            <Button size="sm" type="submit" disabled={isSubmitting || !newConsumable.medicineId}>Record Usage</Button>
          </form>
        )}

        <div className="space-y-3 max-h-[400px] overflow-y-auto">
          {consumables.length === 0 ? <p className="text-sm text-slate-500">No consumables logged.</p> : null}
          {consumables.map((c: any) => (
            <div key={c.id} className="p-3 border border-slate-200 rounded-lg text-sm bg-white shadow-sm flex justify-between items-center">
              <div>
                <p className="font-semibold text-slate-800">{c.medicine?.brand_name || c.medicine?.generic_name}</p>
                <p className="text-xs text-slate-500">Batch: {c.batch_number || 'N/A'}</p>
              </div>
              <div className="text-right">
                <span className="bg-slate-100 text-slate-800 px-2 py-1 rounded-md font-medium text-xs">Qty: {c.quantity}</span>
                {c.is_billed && <span className="block text-[10px] text-emerald-600 font-bold uppercase mt-1">Billed</span>}
              </div>
            </div>
          ))}
        </div>
      </Card>
      
    </div>
  )
}
