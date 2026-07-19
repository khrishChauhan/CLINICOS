'use client'

import { useState } from 'react'
import { generateReportAction } from '@/actions/analytics/analyticsActions'
import { toast } from 'sonner'
import Link from 'next/link'

export default function ReportBuilderClient() {
  const [reportType, setReportType] = useState('revenue')
  const [startDate, setStartDate] = useState(new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0])
  const [endDate, setEndDate] = useState(new Date().toISOString().split('T')[0])
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState<any[]>([])

  async function handleGenerate() {
    setLoading(true)
    const res = await generateReportAction(reportType, startDate, endDate)
    if (res.ok) {
      setData(res.data)
      toast.success('Report generated')
    } else {
      toast.error(res.error)
    }
    setLoading(false)
  }

  function handleExportCSV() {
    if (!data.length) return
    const headers = Object.keys(data[0])
    const csvContent = [
      headers.join(','),
      ...data.map(row => headers.map(h => `"${row[h]}"`).join(','))
    ].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', `${reportType}_report_${startDate}_to_${endDate}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg border shadow-sm">
        <div className="grid grid-cols-4 gap-4 items-end">
          <div>
            <label className="text-xs font-semibold block mb-1">Report Type</label>
            <select value={reportType} onChange={e => setReportType(e.target.value)} className="w-full border p-2 rounded">
              <option value="revenue">Revenue & Payments</option>
              <option value="appointments">Appointments</option>
            </select>
          </div>
          <div>
            <label className="text-xs font-semibold block mb-1">Start Date</label>
            <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} className="w-full border p-2 rounded" />
          </div>
          <div>
            <label className="text-xs font-semibold block mb-1">End Date</label>
            <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} className="w-full border p-2 rounded" />
          </div>
          <button onClick={handleGenerate} disabled={loading} className="bg-blue-600 text-white px-4 py-2 rounded font-medium h-[42px] disabled:opacity-50">
            {loading ? 'Generating...' : 'Generate'}
          </button>
        </div>
      </div>

      {data.length > 0 && (
        <div className="bg-white rounded-lg border shadow-sm overflow-hidden flex flex-col h-[500px]">
          <div className="p-4 border-b flex justify-between items-center bg-slate-50">
            <h2 className="font-semibold text-slate-800">Preview ({data.length} records)</h2>
            <button onClick={handleExportCSV} className="bg-emerald-600 text-white px-4 py-1.5 rounded text-sm font-medium hover:bg-emerald-700 flex items-center gap-2">
              <span>↓</span> Export CSV
            </button>
          </div>
          <div className="overflow-auto p-0 flex-1">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-slate-100 text-slate-600 sticky top-0">
                <tr>
                  {Object.keys(data[0]).map(k => <th key={k} className="p-3 border-b">{k}</th>)}
                </tr>
              </thead>
              <tbody>
                {data.map((row, i) => (
                  <tr key={i} className="border-b hover:bg-slate-50">
                    {Object.keys(row).map(k => <td key={k} className="p-3">{row[k]}</td>)}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
      
      {data.length === 0 && !loading && (
        <div className="bg-white p-12 rounded-lg border shadow-sm text-center text-gray-400">
          Select parameters and click Generate to view data.
        </div>
      )}
    </div>
  )
}
