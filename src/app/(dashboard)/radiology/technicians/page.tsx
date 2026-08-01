import React from 'react'
import { getRadiologyTechniciansAction } from '@/actions/radiology/radiologyOperationsActions'
import { RadiologyTabs } from '../RadiologyTabs'
import { Users, UserCircle } from 'lucide-react'

export default async function TechniciansDashboardPage() {
  const { data: technicians } = await getRadiologyTechniciansAction()
  const techList = technicians || []

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
          <Users className="w-6 h-6 text-indigo-500" /> Technician Management
        </h1>
        <p className="text-sm text-slate-500 mt-1">Manage radiology technician registrations and shifts.</p>
      </div>

      <RadiologyTabs />

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-slate-600">
            <thead className="bg-slate-50 text-slate-500 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 font-semibold">Technician</th>
                <th className="px-6 py-4 font-semibold">Reg. Number</th>
                <th className="px-6 py-4 font-semibold">Specialization</th>
                <th className="px-6 py-4 font-semibold">Shift</th>
                <th className="px-6 py-4 font-semibold">Status</th>
                <th className="px-6 py-4 font-semibold"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {!techList.length ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-slate-500">
                    <UserCircle className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                    <p className="font-medium text-slate-800">No technicians found.</p>
                  </td>
                </tr>
              ) : (
                techList.map(tech => (
                  <tr key={tech.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-semibold text-slate-900">
                        {tech.employee?.first_name} {tech.employee?.last_name}
                      </div>
                      <div className="text-xs text-slate-500">{tech.employee?.email}</div>
                    </td>
                    <td className="px-6 py-4 font-mono">{tech.registration_number || 'N/A'}</td>
                    <td className="px-6 py-4">{tech.specialization || 'General'}</td>
                    <td className="px-6 py-4">
                      <span className="px-2.5 py-1 rounded bg-slate-100 text-slate-700 font-medium text-xs">
                        {tech.shift || 'Unassigned'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                        tech.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-600'
                      }`}>
                        {tech.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="text-indigo-600 hover:text-indigo-800 font-semibold text-sm">
                        Edit
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
