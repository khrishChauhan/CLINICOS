import React from 'react'

export default function NewRadiologyOrderPage() {
  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8 text-center text-slate-500">
        <h2 className="text-lg font-semibold text-slate-700 mb-2">Create Radiology Order</h2>
        <p>This UI will integrate with Patient Search, Doctor Search, and the Master Radiology Tests catalog.</p>
        <p className="mt-4 text-sm text-indigo-500 font-medium cursor-pointer">In a real scenario, this would be a multi-step form.</p>
      </div>
    </div>
  )
}
