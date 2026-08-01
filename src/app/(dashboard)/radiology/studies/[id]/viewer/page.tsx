import React from 'react'
import { getImagingStudyByIdAction } from '@/actions/radiology/imagingActions'
import Link from 'next/link'
import { ChevronLeft, Maximize2, Settings, Download, Share2 } from 'lucide-react'
import dayjs from 'dayjs'

export default async function StudyViewerPage({ params, searchParams }: { params: { id: string }, searchParams: { series?: string } }) {
  const { data: study } = await getImagingStudyByIdAction(params.id)
  
  if (!study) {
    return <div className="p-6 text-center text-slate-500">Study not found.</div>
  }

  // Pre-select series based on query param or default to first
  const activeSeriesId = searchParams.series || study.series?.[0]?.id
  const activeSeries = study.series?.find((s: any) => s.id === activeSeriesId)

  return (
    <div className="h-screen flex flex-col bg-slate-950 text-slate-300 font-sans overflow-hidden">
      {/* Top Bar */}
      <div className="h-14 bg-slate-900 border-b border-slate-800 flex items-center justify-between px-4 shrink-0">
        <div className="flex items-center gap-4">
          <Link href={`/radiology/studies/${study.id}`} className="p-1.5 hover:bg-slate-800 rounded text-slate-400 hover:text-white transition-colors">
            <ChevronLeft className="w-5 h-5" />
          </Link>
          <div className="flex flex-col">
            <span className="text-sm font-semibold text-white">{study.patient?.first_name} {study.patient?.last_name}</span>
            <span className="text-xs text-slate-500 font-mono">{study.accession_number} • {study.modality}</span>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <button className="p-2 hover:bg-slate-800 rounded text-slate-400 hover:text-white transition-colors" title="Download">
            <Download className="w-4 h-4" />
          </button>
          <button className="p-2 hover:bg-slate-800 rounded text-slate-400 hover:text-white transition-colors" title="Share">
            <Share2 className="w-4 h-4" />
          </button>
          <button className="p-2 hover:bg-slate-800 rounded text-slate-400 hover:text-white transition-colors" title="Settings">
            <Settings className="w-4 h-4" />
          </button>
          <button className="p-2 hover:bg-slate-800 rounded text-slate-400 hover:text-white transition-colors" title="Fullscreen">
            <Maximize2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar - Series Thumbnails */}
        <div className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col overflow-y-auto shrink-0 scrollbar-thin scrollbar-thumb-slate-700">
          <div className="p-3 text-xs font-semibold text-slate-500 uppercase tracking-wider sticky top-0 bg-slate-900/95 backdrop-blur z-10 border-b border-slate-800">
            Series ({study.series?.length || 0})
          </div>
          <div className="p-2 space-y-2">
            {study.series?.map((s: any) => (
              <Link 
                href={`/radiology/studies/${study.id}/viewer?series=${s.id}`} 
                key={s.id}
                className={`block rounded-lg p-2 border transition-all ${
                  s.id === activeSeriesId 
                    ? 'bg-slate-800 border-indigo-500 ring-1 ring-indigo-500/50' 
                    : 'bg-slate-900 border-slate-800 hover:border-slate-700 hover:bg-slate-800/50'
                }`}
              >
                <div className="aspect-square bg-slate-950 rounded mb-2 border border-slate-800 flex items-center justify-center overflow-hidden relative group">
                  {s.images?.[0]?.thumbnail_path ? (
                    // In a real app, this would use a signed URL to fetch the thumbnail
                    <div className="w-full h-full bg-slate-800 opacity-50 flex items-center justify-center text-xs">IMG</div>
                  ) : (
                    <span className="text-slate-700 font-mono text-xs">S:{s.series_number}</span>
                  )}
                  <div className="absolute bottom-1 right-1 bg-black/60 px-1 rounded text-[10px] text-white">
                    {s.images?.length || 0}
                  </div>
                </div>
                <div className="text-xs font-medium text-slate-300 truncate" title={s.description}>
                  {s.description || `Series ${s.series_number}`}
                </div>
                <div className="text-[10px] text-slate-500 mt-0.5">{s.modality || study.modality}</div>
              </Link>
            ))}
          </div>
        </div>

        {/* Main Viewer Area */}
        <div className="flex-1 bg-black relative flex items-center justify-center">
          {/* Mock Viewer Overlay */}
          <div className="absolute top-4 left-4 text-xs text-green-500 font-mono drop-shadow-md space-y-1 z-10 pointer-events-none">
            <div>{study.patient?.first_name} {study.patient?.last_name}</div>
            <div>{study.patient?.gender}</div>
            <div>{activeSeries?.description || 'No Description'}</div>
          </div>
          
          <div className="absolute bottom-4 left-4 text-xs text-green-500 font-mono drop-shadow-md z-10 pointer-events-none">
            <div>Zoom: 100%</div>
            <div>WW/WL: Auto</div>
          </div>

          <div className="absolute top-4 right-4 text-xs text-green-500 font-mono text-right drop-shadow-md space-y-1 z-10 pointer-events-none">
            <div>{study.accession_number}</div>
            <div>{study.modality}</div>
            <div>{dayjs(study.performed_date).format('DD MMM YYYY')}</div>
          </div>

          {/* Main Image Placeholder */}
          <div className="w-[80%] h-[80%] border border-slate-800 rounded flex flex-col items-center justify-center bg-slate-900/50">
             <Maximize2 className="w-12 h-12 text-slate-700 mb-4" />
             <p className="text-slate-500 font-medium">DICOM Viewer Placeholder</p>
             <p className="text-sm text-slate-600 mt-2 max-w-sm text-center">
               In production, this area will render the zero-footprint web viewer (e.g. OHIF or Cornerstone.js) fetching raw DICOM frames securely via signed URLs.
             </p>
             {activeSeries && (
               <div className="mt-6 px-4 py-2 bg-slate-950 rounded border border-slate-800 font-mono text-xs text-indigo-400">
                 Active Series: {activeSeries.series_uid}
               </div>
             )}
          </div>
        </div>
      </div>
    </div>
  )
}
