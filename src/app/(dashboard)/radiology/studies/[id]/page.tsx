import React from 'react'
import { getImagingStudyByIdAction } from '@/actions/radiology/imagingActions'
import Link from 'next/link'
import { ChevronLeft, Layers, Server, Activity, Image as ImageIcon } from 'lucide-react'
import dayjs from 'dayjs'

export default async function ImagingStudyDetailsPage({ params }: { params: { id: string } }) {
  const { data: study } = await getImagingStudyByIdAction(params.id)
  
  if (!study) {
    return <div className="p-6 text-center text-slate-500">Study not found.</div>
  }

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/radiology/studies" className="p-2 hover:bg-slate-100 rounded-full transition-colors">
          <ChevronLeft className="w-5 h-5 text-slate-600" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-slate-900 font-mono">
            {study.accession_number}
          </h1>
          <p className="text-sm text-slate-500 mt-1">Study Details & Series Overview</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Study Metadata */}
        <div className="col-span-1 space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="p-4 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
              <h2 className="font-semibold text-slate-800 flex items-center gap-2">
                <Activity className="w-4 h-4 text-indigo-500" /> Study Info
              </h2>
              <span className="px-2 py-1 bg-slate-200 text-slate-700 rounded text-xs font-bold">
                {study.modality}
              </span>
            </div>
            <div className="p-4 space-y-4">
              <div>
                <div className="text-xs text-slate-500 uppercase tracking-wider">Patient</div>
                <div className="font-medium text-slate-900">{study.patient?.first_name} {study.patient?.last_name}</div>
              </div>
              <div>
                <div className="text-xs text-slate-500 uppercase tracking-wider">Description</div>
                <div className="font-medium text-slate-900">{study.study_description || '-'}</div>
              </div>
              <div>
                <div className="text-xs text-slate-500 uppercase tracking-wider">Date Acquired</div>
                <div className="font-medium text-slate-900">{dayjs(study.performed_date).format('DD MMM YYYY, hh:mm A')}</div>
              </div>
              <div>
                <div className="text-xs text-slate-500 uppercase tracking-wider">Study UID</div>
                <div className="font-mono text-xs text-slate-600 break-all">{study.study_uid}</div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="p-4 border-b border-slate-100 bg-slate-50">
              <h2 className="font-semibold text-slate-800 flex items-center gap-2">
                <Server className="w-4 h-4 text-indigo-500" /> PACS Integration
              </h2>
            </div>
            <div className="p-4">
              {study.pacs ? (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-500">Status</span>
                    <span className={`text-sm font-bold ${
                      study.pacs.transfer_status === 'Completed' ? 'text-green-600' : 
                      study.pacs.transfer_status === 'Failed' ? 'text-red-600' : 'text-orange-600'
                    }`}>
                      {study.pacs.transfer_status}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-500">Last Sync</span>
                    <span className="text-sm font-medium text-slate-700">
                      {study.pacs.transfer_date ? dayjs(study.pacs.transfer_date).format('hh:mm A') : '-'}
                    </span>
                  </div>
                </div>
              ) : (
                <div className="text-sm text-slate-500 italic">Not synchronized with PACS.</div>
              )}
            </div>
          </div>
        </div>

        {/* Series List */}
        <div className="col-span-2">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden h-full">
            <div className="p-4 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
              <h2 className="font-semibold text-slate-800 flex items-center gap-2">
                <Layers className="w-4 h-4 text-indigo-500" /> Study Series
              </h2>
              <Link 
                href={`/radiology/studies/${study.id}/viewer`}
                className="px-3 py-1.5 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition"
              >
                Open Viewer
              </Link>
            </div>
            <div className="p-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {!study.series?.length ? (
                <div className="col-span-full py-12 text-center text-slate-500">
                  <ImageIcon className="w-8 h-8 mx-auto text-slate-300 mb-2" />
                  No series data available.
                </div>
              ) : (
                study.series.map((s: any) => (
                  <Link href={`/radiology/studies/${study.id}/viewer?series=${s.id}`} key={s.id} className="block group">
                    <div className="border border-slate-200 rounded-lg p-3 hover:border-indigo-300 hover:shadow-md transition-all bg-slate-50 group-hover:bg-indigo-50/30">
                      <div className="flex justify-between items-start mb-2">
                        <div className="font-semibold text-slate-800">Series {s.series_number}</div>
                        <span className="text-xs bg-white border border-slate-200 px-2 py-0.5 rounded-full text-slate-600">
                          {s.images?.length || 0} imgs
                        </span>
                      </div>
                      <div className="text-sm text-slate-600 font-medium">{s.description || 'Unnamed Series'}</div>
                      <div className="text-xs text-slate-400 mt-1">{s.body_part || 'Whole Body'}</div>
                    </div>
                  </Link>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
