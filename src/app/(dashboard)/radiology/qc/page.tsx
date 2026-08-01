import React from 'react'
import { getRadiologyQCAction } from '@/actions/radiology/radiologyOperationsActions'
import { RadiologyTabs } from '../RadiologyTabs'
import { ShieldCheck, CheckCircle2, XCircle, AlertTriangle } from 'lucide-react'
import dayjs from 'dayjs'

export default async function QualityControlPage() {
  const { data: qcRecords } = await getRadiologyQCAction()
  const records = qcRecords || []

  const getResultIcon = (result: string) => {
    switch(result) {
      case 'Pass': return <CheckCircle2 className="w-4 h-4 text-green-500" />
      case 'Fail': return <XCircle className="w-4 h-4 text-red-500" />
      case 'Warning': return <AlertTriangle className="w-4 h-4 text-orange-500" />
      default: return null
    }
  }

  const getResultColor = (result: string) => {
    switch(result) {
      case 'Pass': return 'bg-green-50 text-green-700'
      case 'Fail': return 'bg-red-50 text-red-700'
      case 'Warning': return 'bg-orange-50 text-orange-700'
      default: return 'bg-slate-50 text-slate-700'
    }
  }

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
          <ShieldCheck className="w-6 h-6 text-indigo-500" /> Quality Control & Maintenance
        </h1>
        <p className="text-sm text-slate-500 mt-1">Immutable ledger of equipment QC checks and calibration logs.</p>
      </div>

      <RadiologyTabs />

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-slate-600">
            <thead className="bg-slate-50 text-slate-500 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 font-semibold">Date</th>
                <th className="px-6 py-4 font-semibold">Equipment</th>
                <th className="px-6 py-4 font-semibold">Type</th>
                <th className="px-6 py-4 font-semibold">Technician</th>
                <th className="px-6 py-4 font-semibold">Result</th>
                <th className="px-6 py-4 font-semibold">Remarks</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {!records.length ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-slate-500">
                    <ShieldCheck className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                    <p className="font-medium text-slate-800">No QC records found.</p>
                  </td>
                </tr>
              ) : (
                records.map(qc => (
                  <tr key={qc.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      {dayjs(qc.qc_date).format('DD MMM YYYY')}
                      <div className="text-xs text-slate-400">{dayjs(qc.created_at).format('h:mm A')}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-semibold text-slate-900">{qc.equipment?.equipment_name}</div>
                      <div className="text-xs text-slate-500">{qc.equipment?.modality} • {qc.equipment?.equipment_code}</div>
                    </td>
                    <td className="px-6 py-4 font-medium">{qc.qc_type}</td>
                    <td className="px-6 py-4">
                      {qc.technician?.first_name} {qc.technician?.last_name}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`flex items-center gap-1.5 px-2.5 py-1 rounded font-bold text-xs w-fit ${getResultColor(qc.result)}`}>
                        {getResultIcon(qc.result)}
                        {qc.result}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-xs text-slate-500 max-w-[200px] truncate">
                      {qc.remarks || '-'}
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
