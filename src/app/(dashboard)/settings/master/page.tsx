'use client'

import React, { useState, useEffect } from 'react'
import { getMasterDataAction } from '@/actions/master/masterActions'
import { Settings, Database } from 'lucide-react'

const TABS = [
  { id: 'countries', label: 'Countries', title: 'Country_name' },
  { id: 'states', label: 'States', title: 'State_name' },
  { id: 'districts', label: 'Districts', title: 'District_name' },
  { id: 'cities', label: 'Cities', title: 'City_name' },
  { id: 'languages', label: 'Languages', title: 'Language_name' },
  { id: 'genders', label: 'Genders', title: 'Gender_name' },
  { id: 'marital_statuses', label: 'Marital Statuses', title: 'Status_name' },
  { id: 'religions', label: 'Religions', title: 'Religion_name' },
  { id: 'blood_groups', label: 'Blood Groups', title: 'Blood_group' },
  { id: 'nationalities', label: 'Nationalities', title: 'Nationality_name' },
  { id: 'relationship_types', label: 'Relationships', title: 'Relationship_name' },
  { id: 'departments', label: 'Departments', title: 'Department_name' },
  { id: 'specializations', label: 'Specializations', title: 'Specialization_name' },
  { id: 'appointment_types', label: 'Appointment Types', title: 'Appointment_type' },
  { id: 'consultation_types', label: 'Consultation Types', title: 'Consultation_type' },
  { id: 'visit_types', label: 'Visit Types', title: 'Visit_type' },
  { id: 'priority_levels', label: 'Priority Levels', title: 'Priority_name' },
  { id: 'token_statuses', label: 'Token Statuses', title: 'Token_status' },
  { id: 'appointment_statuses', label: 'Appointment Statuses', title: 'Appointment_status' },
  { id: 'visit_statuses', label: 'Visit Statuses', title: 'Visit_status' },
]

export default function MasterDataManagementPage() {
  const [activeTab, setActiveTab] = useState(TABS[0].id)
  const [data, setData] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadData() {
      setLoading(true)
      const res = await getMasterDataAction(activeTab)
      if (res.success && res.data) {
        setData(res.data)
      } else {
        setData([])
      }
      setLoading(false)
    }
    loadData()
  }, [activeTab])

  const activeTabDetails = TABS.find(t => t.id === activeTab)!
  const titleKey = activeTabDetails.title.toLowerCase()

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      <div className="flex items-center gap-3">
        <Database className="w-8 h-8 text-blue-600" />
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Master Data Management</h1>
          <p className="text-sm text-slate-500">Manage global reference data across all clinics</p>
        </div>
      </div>

      <div className="flex bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        {/* Sidebar Tabs */}
        <div className="w-64 border-r border-slate-200 bg-slate-50 overflow-y-auto max-h-[700px]">
          {TABS.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full text-left px-4 py-3 text-sm transition-colors ${
                activeTab === tab.id
                  ? 'bg-blue-50 text-blue-700 font-semibold border-r-4 border-blue-600'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="flex-1 p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-slate-800">{activeTabDetails.label}</h2>
            <button className="bg-blue-600 text-white px-4 py-2 text-sm rounded-lg hover:bg-blue-700 transition-colors">
              + Add New
            </button>
          </div>

          {loading ? (
            <div className="text-center py-10 text-slate-400">Loading {activeTabDetails.label}...</div>
          ) : (
            <div className="border border-slate-200 rounded-lg overflow-hidden">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 text-slate-600 border-b border-slate-200">
                  <tr>
                    <th className="p-3 font-semibold">Name / Code</th>
                    <th className="p-3 font-semibold">Status</th>
                    <th className="p-3 font-semibold">Created</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {data.map(item => (
                    <tr key={item.id} className="hover:bg-slate-50">
                      <td className="p-3 font-medium text-slate-800">
                        {item[titleKey] || item.country_name || item.state_name || item.district_name || item.city_name || item.language_name || item.gender_name || item.status_name || item.religion_name || item.blood_group || item.nationality_name || item.relationship_name}
                      </td>
                      <td className="p-3">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${item.status === 'Active' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-600'}`}>
                          {item.status}
                        </span>
                      </td>
                      <td className="p-3 text-slate-500 text-xs">
                        {new Date(item.created_at).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                  {data.length === 0 && (
                    <tr>
                      <td colSpan={3} className="p-6 text-center text-slate-400">
                        No records found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
