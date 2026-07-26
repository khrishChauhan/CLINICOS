'use client'

import React, { useState, useEffect } from 'react'
import { getDoctorLanguagesAction, addDoctorLanguageAction, deleteDoctorLanguageAction } from '@/actions/doctors/languageActions'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'

export default function LanguagesManager({ doctorId }: { doctorId: string }) {
  const [languages, setLanguages] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [langName, setLangName] = useState('')
  const [proficiency, setProficiency] = useState('Native')

  useEffect(() => {
    getDoctorLanguagesAction(doctorId).then(res => {
      if (res.success) setLanguages(res.data)
    })
  }, [doctorId])

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    const res = await addDoctorLanguageAction({
      doctor_id: doctorId,
      language_name: langName,
      proficiency
    })
    if (res.success) {
      setLanguages([res.data, ...languages.filter(l => l.language_name !== langName)])
      setLangName('')
    } else {
      alert(res.error)
    }
    setLoading(false)
  }

  const handleDelete = async (id: string) => {
    const res = await deleteDoctorLanguageAction(id)
    if (res.success) setLanguages(languages.filter(l => l.id !== id))
  }

  return (
    <div className="space-y-6">
      <form onSubmit={handleAdd} className="flex gap-4 items-end bg-slate-50 p-4 rounded-xl flex-wrap">
        <div className="flex-1">
          <label className="text-xs font-semibold text-slate-500 uppercase">Language *</label>
          <Input required value={langName} onChange={e => setLangName(e.target.value)} placeholder="e.g. English, Hindi, Spanish" />
        </div>
        <div>
          <label className="text-xs font-semibold text-slate-500 uppercase">Proficiency</label>
          <select 
            className="w-full mt-1 border border-slate-300 rounded-lg p-2 text-sm outline-none"
            value={proficiency} onChange={e => setProficiency(e.target.value)}
          >
            <option>Native</option>
            <option>Fluent</option>
            <option>Working Proficiency</option>
            <option>Basic</option>
          </select>
        </div>
        <Button type="submit" disabled={loading || !langName}>{loading ? 'Saving...' : 'Add Language'}</Button>
      </form>

      <div className="flex flex-wrap gap-4">
        {languages.map(l => (
          <div key={l.id} className="border border-slate-200 rounded-lg p-3 bg-white flex items-center gap-4">
            <div>
              <div className="font-semibold text-sm">{l.language_name}</div>
              <div className="text-xs text-slate-500">{l.proficiency}</div>
            </div>
            <button type="button" onClick={() => handleDelete(l.id)} className="text-red-500 hover:text-red-700 text-lg leading-none">&times;</button>
          </div>
        ))}
        {languages.length === 0 && <div className="text-slate-500 text-sm">No languages added yet.</div>}
      </div>
    </div>
  )
}
