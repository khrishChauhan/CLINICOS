import React from 'react'
import { RadiologyTabs } from '../RadiologyTabs'
import { Syringe, ShieldAlert, Activity } from 'lucide-react'

export default async function RadiologyClinicalPage() {
  // In a real implementation, we would fetch global contrast & radiation logs here
  
  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
          <Syringe className="w-6 h-6 text-indigo-500" /> Dose & Contrast
        </h1>
        <p className="text-sm text-slate-500 mt-1">Global log for Radiation Exposure and Contrast Administration.</p>
      </div>

      <RadiologyTabs />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Contrast Administration Log */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 flex flex-col">
          <div className="p-4 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
            <h2 className="font-semibold text-slate-800 flex items-center gap-2">
              <Syringe className="w-4 h-4 text-indigo-500" /> Contrast Logs
            </h2>
          </div>
          <div className="p-6 flex-1 flex flex-col items-center justify-center text-slate-500">
             <Activity className="w-12 h-12 text-slate-200 mb-4" />
             <p>Select an Imaging Study to log contrast.</p>
             <p className="text-xs mt-2 text-slate-400 max-w-sm text-center">Global contrast query logs will populate here once seeding is fully hooked up.</p>
          </div>
        </div>

        {/* Radiation Dose Log */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 flex flex-col">
          <div className="p-4 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
            <h2 className="font-semibold text-slate-800 flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-amber-500" /> Radiation Dose Logs
            </h2>
          </div>
          <div className="p-6 flex-1 flex flex-col items-center justify-center text-slate-500">
             <Activity className="w-12 h-12 text-slate-200 mb-4" />
             <p>Select an Imaging Study to log radiation dose.</p>
             <p className="text-xs mt-2 text-slate-400 max-w-sm text-center">Global dose query logs will populate here once seeding is fully hooked up.</p>
          </div>
        </div>

      </div>
    </div>
  )
}
