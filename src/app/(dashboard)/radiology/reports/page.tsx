import React from 'react'
import { getRadiologyReportsAction } from '@/actions/radiology/radiologyReportActions'
import { RadiologyTabs } from '../RadiologyTabs'
import { FileText, CheckCircle, Clock, ExternalLink } from 'lucide-react'
import Link from 'next/link'
import dayjs from 'dayjs'

export default async function RadiologyReportsPage() {
  const { data: reports } = await getRadiologyReportsAction()
  const reportList = reports || []

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
          <FileText className="w-6 h-6 text-indigo-500" /> Radiology Reporting
        </h1>
        <p className="text-sm text-slate-500 mt-1">Manage report dictations, approvals, and addendums.</p>
      </div>

      <RadiologyTabs />

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-slate-600">
            <thead className="bg-slate-50 text-slate-500 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 font-semibold">Report #</th>
                <th className="px-6 py-4 font-semibold">Study Reference</th>
                <th className="px-6 py-4 font-semibold">Patient</th>
                <th className="px-6 py-4 font-semibold">Radiologist</th>
                <th className="px-6 py-4 font-semibold">Status</th>
                <th className="px-6 py-4 font-semibold"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {!reportList.length ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-slate-500">
                    <FileText className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                    <p className="font-medium text-slate-800">No reports found.</p>
                  </td>
                </tr>
              ) : (
                reportList.map((report: any) => (
                  <tr key={report.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-mono font-bold text-slate-900">{report.report_number}</div>
                      <div className="text-xs text-slate-500">v{report.version_number}.0</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-semibold text-indigo-600">
                        {report.study?.accession_number}
                      </div>
                      <div className="text-xs text-slate-500">{report.study?.modality}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-semibold text-slate-900">
                        {report.study?.patient?.first_name} {report.study?.patient?.last_name}
                      </div>
                      <div className="text-xs text-slate-500">
                        {report.study?.patient?.gender}
                      </div>
                    </td>
                    <td className="px-6 py-4 font-medium text-slate-700">
                      Dr. {report.radiologist?.first_name} {report.radiologist?.last_name}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold w-fit ${
                        report.status === 'Approved' ? 'bg-green-100 text-green-700' :
                        report.status === 'Verified' ? 'bg-blue-100 text-blue-700' :
                        'bg-slate-100 text-slate-700'
                      }`}>
                        {report.status === 'Approved' ? <CheckCircle className="w-3.5 h-3.5" /> : <Clock className="w-3.5 h-3.5" />}
                        {report.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right space-x-4">
                      {report.pdf_storage_path && (
                        <button className="text-slate-400 hover:text-indigo-600 transition" title="View PDF">
                          <ExternalLink className="w-4 h-4" />
                        </button>
                      )}
                      <Link href={`/radiology/reports/${report.id}`} className="text-indigo-600 hover:text-indigo-800 font-semibold text-sm">
                        {report.status === 'Draft' ? 'Edit' : 'View'}
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
