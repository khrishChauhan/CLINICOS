import React from 'react'
import Link from 'next/link'
import { getLabReportsAction } from '@/actions/laboratory/labOperationsActions'
import { ClipboardList, ChevronRight, Search, CheckCircle, Clock, ExternalLink } from 'lucide-react'
import dayjs from 'dayjs'
import { LaboratoryTabs } from '../LaboratoryTabs'

const STATUS_STYLES: Record<string, string> = {
  'Draft': 'bg-amber-100 text-amber-700',
  'Approved': 'bg-green-100 text-green-700',
  'Rejected': 'bg-red-100 text-red-700',
  'Cancelled': 'bg-slate-100 text-slate-600',
}

export default async function LabReportsDashboard() {
  const { data: reports, success } = await getLabReportsAction()

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Lab Reports</h1>
        <p className="text-sm text-slate-500">View, generate, and approve laboratory reports</p>
      </div>

      <LaboratoryTabs />

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {[
          { label: 'Draft', icon: Clock, color: 'text-amber-600 bg-amber-50' },
          { label: 'Approved', icon: CheckCircle, color: 'text-green-600 bg-green-50' },
        ].map(card => (
          <div key={card.label} className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm flex items-center gap-3">
            <div className={`p-2 rounded-lg ${card.color}`}><card.icon className="w-5 h-5" /></div>
            <div>
              <p className="text-2xl font-bold text-slate-900">
                {reports?.filter((r: any) => r.report_status === card.label).length ?? 0}
              </p>
              <p className="text-xs text-slate-500">{card.label}</p>
            </div>
          </div>
        ))}
        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm flex items-center gap-3">
          <div className="p-2 rounded-lg text-blue-600 bg-blue-50"><ClipboardList className="w-5 h-5" /></div>
          <div>
            <p className="text-2xl font-bold text-slate-900">{reports?.length ?? 0}</p>
            <p className="text-xs text-slate-500">Total Reports</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-4 border-b border-slate-200 bg-slate-50 flex items-center gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
            <input type="text" placeholder="Search by report number or patient..." className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg text-sm outline-none" />
          </div>
          <select className="border border-slate-300 rounded-lg text-sm px-3 py-2 bg-white outline-none">
            <option value="">All Statuses</option>
            <option>Draft</option>
            <option>Approved</option>
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-slate-600">
            <thead className="bg-slate-50 text-slate-500 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 font-semibold">Report No.</th>
                <th className="px-6 py-4 font-semibold">Patient</th>
                <th className="px-6 py-4 font-semibold">Order No.</th>
                <th className="px-6 py-4 font-semibold">Generated</th>
                <th className="px-6 py-4 font-semibold">Status</th>
                <th className="px-6 py-4 font-semibold">PDF</th>
                <th className="px-6 py-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {(!success || !reports?.length) ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center">
                    <ClipboardList className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                    <p className="font-medium text-slate-800">No reports found</p>
                    <p className="text-sm text-slate-500 mt-1">Generate a report from a completed lab order.</p>
                  </td>
                </tr>
              ) : (
                reports.map((report: any) => (
                  <tr key={report.id} className="hover:bg-slate-50/50 transition">
                    <td className="px-6 py-4 font-mono font-semibold text-slate-900">{report.report_number}</td>
                    <td className="px-6 py-4">
                      {report.lab_order?.patient?.first_name} {report.lab_order?.patient?.last_name}
                    </td>
                    <td className="px-6 py-4 font-mono text-xs text-slate-500">{report.lab_order?.order_number}</td>
                    <td className="px-6 py-4 text-slate-500">{dayjs(report.generated_at).format('MMM D, h:mm A')}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${STATUS_STYLES[report.report_status] ?? ''}`}>
                        {report.report_status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {report.signedUrl ? (
                        <a href={report.signedUrl} target="_blank" rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 text-xs font-semibold">
                          <ExternalLink className="w-3.5 h-3.5" /> View PDF
                        </a>
                      ) : (
                        <span className="text-slate-400 text-xs">No file</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Link href={`/laboratory/reports/${report.id}`} className="inline-flex items-center text-sm font-semibold text-blue-600 hover:text-blue-800">
                        View <ChevronRight className="w-4 h-4 ml-1" />
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
