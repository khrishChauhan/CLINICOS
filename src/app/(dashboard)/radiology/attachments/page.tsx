import React from 'react'
import { RadiologyTabs } from '../RadiologyTabs'
import { Paperclip, FileImage, FileText, Activity } from 'lucide-react'

export default async function RadiologyAttachmentsPage() {
  // In a real implementation, we would query the attachments or let user select an order
  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
          <Paperclip className="w-6 h-6 text-indigo-500" /> Attachments Gallery
        </h1>
        <p className="text-sm text-slate-500 mt-1">Manage scanned documents, additional images, and consent forms.</p>
      </div>

      <RadiologyTabs />

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col min-h-[400px]">
        <div className="p-4 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
          <h2 className="font-semibold text-slate-800 flex items-center gap-2">
            <Paperclip className="w-4 h-4 text-indigo-500" /> Global Attachment Repository
          </h2>
          <button className="px-4 py-2 bg-indigo-600 text-white font-semibold rounded-lg text-sm hover:bg-indigo-700 transition">
            Upload Document
          </button>
        </div>
        <div className="p-6 flex-1 flex flex-col items-center justify-center text-slate-500">
           <Activity className="w-12 h-12 text-slate-200 mb-4" />
           <p>Select a Radiology Order to view its attachments.</p>
           <p className="text-xs mt-2 text-slate-400 max-w-sm text-center">Global document view will populate here once seeding is fully hooked up.</p>
        </div>
      </div>
    </div>
  )
}
