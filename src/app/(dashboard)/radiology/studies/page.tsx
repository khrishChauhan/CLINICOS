import React from 'react'
import { getImagingStudiesAction } from '@/actions/radiology/imagingActions'
import { RadiologyTabs } from '../RadiologyTabs'
import { Image as ImageIcon, Search, Filter, Server } from 'lucide-react'
import Link from 'next/link'
import dayjs from 'dayjs'

export default async function ImagingStudiesPage() {
  const { data: studies } = await getImagingStudiesAction()
  const studyList = studies || []

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
          <ImageIcon className="w-6 h-6 text-indigo-500" /> Imaging Studies
        </h1>
        <p className="text-sm text-slate-500 mt-1">Manage acquired studies, series, and PACS synchronizations.</p>
      </div>

      <RadiologyTabs />

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col">
        <div className="p-4 border-b border-slate-100 bg-slate-50 flex items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search by Accession # or Patient Name..." 
              className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
            />
          </div>
          <button className="flex items-center gap-2 px-4 py-2 border border-slate-200 bg-white rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50">
            <Filter className="w-4 h-4" /> Filter
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-slate-600">
            <thead className="bg-slate-50 text-slate-500 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 font-semibold">Accession Number</th>
                <th className="px-6 py-4 font-semibold">Patient</th>
                <th className="px-6 py-4 font-semibold">Modality</th>
                <th className="px-6 py-4 font-semibold">Date</th>
                <th className="px-6 py-4 font-semibold">PACS Sync</th>
                <th className="px-6 py-4 font-semibold"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {!studyList.length ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-slate-500">
                    <ImageIcon className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                    <p className="font-medium text-slate-800">No imaging studies found.</p>
                  </td>
                </tr>
              ) : (
                studyList.map((study: any) => (
                  <tr key={study.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <Link href={`/radiology/studies/${study.id}`} className="font-mono font-bold text-indigo-600 hover:underline">
                        {study.accession_number}
                      </Link>
                      <div className="text-xs text-slate-400 mt-1 truncate max-w-[200px]" title={study.study_description}>
                        {study.study_description || 'No description'}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-semibold text-slate-900">{study.patient?.first_name} {study.patient?.last_name}</div>
                      <div className="text-xs text-slate-500">
                        {study.patient?.gender} • {dayjs().diff(study.patient?.date_of_birth, 'year')} yrs
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2.5 py-1 bg-slate-100 text-slate-700 rounded text-xs font-bold">
                        {study.modality}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-medium">{dayjs(study.performed_date).format('DD MMM YYYY')}</div>
                      <div className="text-xs text-slate-500">{dayjs(study.performed_date).format('hh:mm A')}</div>
                    </td>
                    <td className="px-6 py-4">
                      {study.pacs ? (
                        <div className="flex items-center gap-1.5">
                          <Server className={`w-4 h-4 ${
                            study.pacs.transfer_status === 'Completed' ? 'text-green-500' : 
                            study.pacs.transfer_status === 'Failed' ? 'text-red-500' : 'text-orange-500'
                          }`} />
                          <span className="text-xs font-medium">{study.pacs.transfer_status}</span>
                        </div>
                      ) : (
                        <span className="text-xs text-slate-400 italic">Not Synced</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Link href={`/radiology/studies/${study.id}`} className="text-indigo-600 hover:text-indigo-800 font-semibold text-sm">
                        View Details
                      </Link>
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
