'use client'

import { useState, useEffect } from 'react'
import { saveTemplateAction } from '@/actions/notifications/notificationActions'
import { toast } from 'sonner'
import type { NotificationTemplateRow } from '@/types/notifications'

export default function TemplateManagerClient({ initialTemplates }: { initialTemplates: NotificationTemplateRow[] }) {
  const [templates, setTemplates] = useState<NotificationTemplateRow[]>(initialTemplates)
  const [selectedEvent, setSelectedEvent] = useState('AppointmentCreated')
  const [selectedChannel, setSelectedChannel] = useState<'In-App' | 'SMS' | 'Email'>('In-App')
  const [content, setContent] = useState('')
  const [subject, setSubject] = useState('')

  useEffect(() => {
    const tmpl = templates.find(t => t.event_type === selectedEvent && t.channel === selectedChannel)
    if (tmpl) {
      setContent(tmpl.content)
      setSubject(tmpl.subject || '')
    } else {
      setContent('')
      setSubject('')
    }
  }, [selectedEvent, selectedChannel, templates])

  async function handleSave() {
    const currentTemplate = templates.find(t => t.event_type === selectedEvent && t.channel === selectedChannel)
    const payload = {
      name: `${selectedEvent} - ${selectedChannel}`,
      event_type: selectedEvent,
      channel: selectedChannel,
      content,
      subject: selectedChannel === 'Email' ? subject : null,
      is_active: true
    }

    const savePayload = currentTemplate ? { id: currentTemplate.id, ...payload } : payload
    const res = await saveTemplateAction(savePayload)
    
    if (res.ok) {
      toast.success('Template saved successfully')
      if (currentTemplate) {
        setTemplates(templates.map(t => t.id === currentTemplate.id ? { ...t, ...payload } as any : t))
      } else {
        // Just reload from server in real app, optimistic here
        setTemplates([{ id: Math.random().toString(), clinic_id: '', created_at: new Date().toISOString(), ...payload } as any, ...templates])
      }
    } else {
      toast.error(res.error)
    }
  }

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Notification Templates</h1>
          <p className="text-sm text-gray-500 mt-1">Manage dynamic messaging templates</p>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg border shadow-sm space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-semibold block mb-1">Event Type</label>
            <select value={selectedEvent} onChange={e => setSelectedEvent(e.target.value)} className="w-full border p-2 rounded">
              <option value="AppointmentCreated">Appointment Created</option>
              <option value="AppointmentCancelled">Appointment Cancelled</option>
              <option value="LabResultReady">Lab Result Ready</option>
            </select>
          </div>
          <div>
            <label className="text-sm font-semibold block mb-1">Channel</label>
            <select value={selectedChannel} onChange={e => setSelectedChannel(e.target.value as any)} className="w-full border p-2 rounded">
              <option value="In-App">In-App Notification</option>
              <option value="SMS">SMS Text Message</option>
              <option value="Email">Email</option>
            </select>
          </div>
        </div>

        {selectedChannel === 'Email' && (
          <div>
            <label className="text-sm font-semibold block mb-1">Subject Line</label>
            <input 
              value={subject} 
              onChange={e => setSubject(e.target.value)} 
              placeholder="e.g. Your Appointment Confirmation"
              className="w-full border p-2 rounded" 
            />
          </div>
        )}

        <div>
          <label className="text-sm font-semibold block mb-1">Message Content</label>
          <textarea 
            value={content} 
            onChange={e => setContent(e.target.value)}
            className="w-full border p-2 rounded h-32"
            placeholder="Available variables: {{patient_name}}, {{doctor_name}}, {{time}}, {{date}}"
          />
          <p className="text-xs text-gray-500 mt-1">Use double braces for variables, e.g. <code className="bg-slate-100 px-1 rounded">{'{{patient_name}}'}</code></p>
        </div>

        <button onClick={handleSave} className="bg-blue-600 text-white px-4 py-2 rounded font-medium">Save Template</button>
      </div>
    </div>
  )
}
