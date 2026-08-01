import React from 'react'
import { getRadiologyReportByIdAction } from '@/actions/radiology/radiologyReportActions'
import Link from 'next/link'
import { ChevronLeft, Lock, FileText, CheckCircle, ExternalLink, ShieldAlert } from 'lucide-react'
import dayjs from 'dayjs'

export default async function ReportEditorPage({ params }: { params: { id: string } }) {
  const { data } = await getRadiologyReportByIdAction(params.id)
  
  if (!data) {
    return <div className="p-6 text-center text-slate-500">Report not found.</div>
  }

  const { report, findings } = data
  const isApproved = report.status === 'Approved'

  return (
    <div className="h-screen flex flex-col bg-slate-100 overflow-hidden font-sans">
      {/* Top Bar */}
      <div className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 shrink-0 z-10 shadow-sm">
        <div className="flex items-center gap-4">
          <Link href="/radiology/reports" className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-500">
            <ChevronLeft className="w-5 h-5" />
          </Link>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-lg font-bold text-slate-900 font-mono">{report.report_number}</h1>
              <span className={`px-2 py-0.5 rounded text-xs font-bold ${
                isApproved ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
              }`}>
                {report.status}
              </span>
              {isApproved && (
                <span className="flex items-center gap-1 text-xs font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                  <Lock className="w-3 h-3" /> Immutable (v{report.version_number}.0)
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Study: {report.study?.accession_number} • Patient: {report.study?.patient?.first_name} {report.study?.patient?.last_name}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {isApproved ? (
            <>
              <button className="px-4 py-2 bg-white border border-slate-200 text-slate-700 font-semibold rounded-lg text-sm hover:bg-slate-50 transition flex items-center gap-2">
                <FileText className="w-4 h-4" /> View PDF
              </button>
              <button className="px-4 py-2 bg-indigo-50 border border-indigo-200 text-indigo-700 font-semibold rounded-lg text-sm hover:bg-indigo-100 transition">
                Create Addendum
              </button>
            </>
          ) : (
            <>
              <button className="px-4 py-2 bg-white border border-slate-200 text-slate-700 font-semibold rounded-lg text-sm hover:bg-slate-50 transition">
                Save Draft
              </button>
              <button className="px-4 py-2 bg-green-600 text-white font-semibold rounded-lg text-sm hover:bg-green-700 transition flex items-center gap-2 shadow-sm">
                <CheckCircle className="w-4 h-4" /> Approve & Sign
              </button>
            </>
          )}
        </div>
      </div>

      {/* Split Screen Layout */}
      <div className="flex flex-1 overflow-hidden">
        
        {/* Left Side: Study Reference & Clinical Context */}
        <div className="w-1/3 bg-white border-r border-slate-200 overflow-y-auto p-6 space-y-6">
          <div>
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-3">Clinical Context</h3>
            <div className="bg-slate-50 rounded-lg p-4 border border-slate-100 space-y-3">
              <div>
                <span className="text-xs text-slate-500 block">Modality</span>
                <span className="font-medium text-slate-900">{report.study?.modality}</span>
              </div>
              <div>
                <span className="text-xs text-slate-500 block">Description</span>
                <span className="font-medium text-slate-900">{report.study?.study_description || 'N/A'}</span>
              </div>
              <div>
                <span className="text-xs text-slate-500 block">Performed Date</span>
                <span className="font-medium text-slate-900">{dayjs(report.study?.performed_date).format('DD MMM YYYY')}</span>
              </div>
            </div>
          </div>

          <div>
             <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">Imaging Reference</h3>
                <Link href={`/radiology/studies/${report.study?.id}/viewer`} target="_blank" className="text-indigo-600 hover:text-indigo-800 text-xs font-semibold flex items-center gap-1">
                  Open DICOM Viewer <ExternalLink className="w-3 h-3" />
                </Link>
             </div>
             <div className="bg-slate-900 rounded-lg h-48 flex items-center justify-center text-slate-500 border-4 border-slate-800">
                Preview Placeholder
             </div>
          </div>
        </div>

        {/* Right Side: Reporting Editor */}
        <div className="w-2/3 bg-slate-50 overflow-y-auto p-8">
          <div className="max-w-3xl mx-auto space-y-6 pb-24">
            
            {findings?.is_critical_finding && (
              <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-lg flex items-start gap-3">
                <ShieldAlert className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-bold text-red-800">Critical Finding Alert Active</h4>
                  <p className="text-xs text-red-600 mt-1">This report will trigger a High-Severity alert in the patient's EMR Timeline upon approval.</p>
                </div>
              </div>
            )}

            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">Clinical History</label>
              <textarea 
                className="w-full rounded-lg border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 min-h-[80px] text-sm p-3 disabled:bg-slate-100 disabled:text-slate-500"
                defaultValue={findings?.clinical_history || ''}
                disabled={isApproved}
                placeholder="Patient presented with..."
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">Technique</label>
              <textarea 
                className="w-full rounded-lg border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 min-h-[80px] text-sm p-3 disabled:bg-slate-100 disabled:text-slate-500"
                defaultValue={findings?.technique || ''}
                disabled={isApproved}
                placeholder="Standard multi-planar sequences..."
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">Findings</label>
              <textarea 
                className="w-full rounded-lg border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 min-h-[250px] text-sm p-3 disabled:bg-slate-100 disabled:text-slate-500 leading-relaxed"
                defaultValue={findings?.findings || ''}
                disabled={isApproved}
                placeholder="Detailed anatomical findings..."
              />
            </div>

            <div className="bg-indigo-50/50 p-4 rounded-xl border border-indigo-100 space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-900">Impression</label>
                <textarea 
                  className="w-full rounded-lg border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 min-h-[120px] text-sm font-medium text-slate-800 p-3 disabled:bg-slate-100 disabled:text-slate-500"
                  defaultValue={findings?.impression || ''}
                  disabled={isApproved}
                />
              </div>

              {!isApproved && (
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" className="rounded text-red-600 focus:ring-red-500 w-4 h-4" defaultChecked={findings?.is_critical_finding} />
                  <span className="text-sm font-bold text-red-700">Flag as Critical Finding</span>
                </label>
              )}
            </div>

          </div>
        </div>
      </div>
    </div>
  )
}
