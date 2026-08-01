import React from 'react'
import { getRadiologyEquipmentAction } from '@/actions/radiology/radiologyOperationsActions'
import { RadiologyTabs } from '../RadiologyTabs'
import { Monitor, AlertTriangle } from 'lucide-react'
import dayjs from 'dayjs'

export default async function EquipmentDashboardPage() {
  const { data: equipment } = await getRadiologyEquipmentAction()
  const equipmentList = equipment || []

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
          <Monitor className="w-6 h-6 text-indigo-500" /> Equipment Management
        </h1>
        <p className="text-sm text-slate-500 mt-1">Manage modalities, maintenance schedules, and calibration.</p>
      </div>

      <RadiologyTabs />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {equipmentList.map(eq => {
          const maintenanceDue = dayjs(eq.maintenance_due)
          const isMaintenanceOverdue = maintenanceDue.isBefore(dayjs())
          const isMaintenanceSoon = maintenanceDue.isBefore(dayjs().add(14, 'day'))

          return (
            <div key={eq.id} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col">
              <div className="p-4 border-b border-slate-100 bg-slate-50 flex justify-between items-start">
                <div>
                  <h3 className="font-semibold text-slate-900">{eq.equipment_name}</h3>
                  <p className="text-xs text-slate-500 font-mono mt-0.5">{eq.equipment_code}</p>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                  eq.status === 'Active' ? 'bg-green-100 text-green-700' : 
                  eq.status === 'Out of Service' ? 'bg-red-100 text-red-700' : 
                  'bg-orange-100 text-orange-700'
                }`}>
                  {eq.status}
                </span>
              </div>
              <div className="p-4 flex-1 space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Modality</span>
                  <span className="font-medium text-slate-700">{eq.modality}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Manufacturer</span>
                  <span className="font-medium text-slate-700">{eq.manufacturer || 'N/A'}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Calibration Due</span>
                  <span className="font-medium text-slate-700">{eq.calibration_due ? dayjs(eq.calibration_due).format('DD MMM YYYY') : 'N/A'}</span>
                </div>
              </div>
              <div className={`p-3 text-sm flex items-center justify-between border-t border-slate-100 ${
                isMaintenanceOverdue ? 'bg-red-50 text-red-700 font-medium' :
                isMaintenanceSoon ? 'bg-orange-50 text-orange-700 font-medium' :
                'bg-slate-50 text-slate-600'
              }`}>
                <div className="flex items-center gap-1.5">
                  {(isMaintenanceOverdue || isMaintenanceSoon) && <AlertTriangle className="w-4 h-4" />}
                  Maintenance: {eq.maintenance_due ? dayjs(eq.maintenance_due).format('DD MMM YYYY') : 'N/A'}
                </div>
                <button className="text-indigo-600 hover:text-indigo-800 font-semibold text-xs">
                  View Log
                </button>
              </div>
            </div>
          )
        })}
        {equipmentList.length === 0 && (
          <div className="col-span-full p-12 text-center border-2 border-dashed border-slate-200 rounded-xl text-slate-500">
            No equipment found. Seed the database to view equipment.
          </div>
        )}
      </div>
    </div>
  )
}
