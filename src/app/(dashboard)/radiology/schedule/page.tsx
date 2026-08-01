import React from 'react'

export default function RadiologySchedulePage() {
  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8 text-center text-slate-500">
        <h2 className="text-lg font-semibold text-slate-700 mb-2">Radiology Schedule</h2>
        <p>This UI will integrate a Calendar view for plotting Radiology Order Items against Rooms and Technicians.</p>
        <p className="mt-4 text-sm text-indigo-500 font-medium">It will call `scheduleRadiologyAction` which uses atomic transactions to prevent double booking.</p>
      </div>
    </div>
  )
}
