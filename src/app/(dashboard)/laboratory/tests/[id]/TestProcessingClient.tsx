'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import {
  updateTestStatusAction,
  recordLabResultAction,
  verifyLabResultAction
} from '@/actions/laboratory/labResultActions'
import {
  ArrowLeft, FlaskConical, CheckCircle, Play, AlertTriangle,
  ShieldCheck, Plus, Trash2, TrendingUp, TrendingDown, Minus
} from 'lucide-react'
import dayjs from 'dayjs'
import type { AbnormalFlag } from '@/types/laboratory'

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────
const STATUS_BADGE: Record<string, string> = {
  'Ordered': 'bg-slate-100 text-slate-700',
  'In Progress': 'bg-blue-100 text-blue-700',
  'Completed': 'bg-amber-100 text-amber-700',
  'Verified': 'bg-green-100 text-green-700',
  'Cancelled': 'bg-red-100 text-red-700',
}

const FLAG_STYLES: Record<AbnormalFlag, { color: string; icon: React.ComponentType<any> }> = {
  'Normal': { color: 'text-green-600', icon: Minus },
  'High': { color: 'text-orange-500', icon: TrendingUp },
  'Low': { color: 'text-blue-500', icon: TrendingDown },
  'Critical': { color: 'text-red-600', icon: AlertTriangle },
  'Abnormal': { color: 'text-purple-600', icon: AlertTriangle },
}

function FlagBadge({ flag }: { flag: AbnormalFlag }) {
  const { color, icon: Icon } = FLAG_STYLES[flag] ?? FLAG_STYLES['Normal']
  return (
    <span className={`inline-flex items-center gap-1 text-xs font-semibold ${color}`}>
      <Icon className="w-3.5 h-3.5" /> {flag}
    </span>
  )
}

interface ParameterRow {
  parameter_name: string
  parameter_value: string
  unit: string
  reference_range: string
}

// ─────────────────────────────────────────────────────────────────────────────
// Main Client Component
// ─────────────────────────────────────────────────────────────────────────────
export default function TestProcessingClient({ test, currentUserId }: { test: any; currentUserId: string }) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Overall result
  const [resultValue, setResultValue] = useState('')
  const [unit, setUnit] = useState('')
  const [refRange, setRefRange] = useState('')
  const [remarks, setRemarks] = useState('')

  // Parameters grid for composite tests
  const [parameters, setParameters] = useState<ParameterRow[]>([
    { parameter_name: '', parameter_value: '', unit: '', reference_range: '' }
  ])

  const existingResult = test.lab_results?.[0]

  const addRow = () =>
    setParameters(p => [...p, { parameter_name: '', parameter_value: '', unit: '', reference_range: '' }])

  const removeRow = (i: number) =>
    setParameters(p => p.filter((_, idx) => idx !== i))

  const updateRow = (i: number, field: keyof ParameterRow, value: string) =>
    setParameters(p => p.map((row, idx) => idx === i ? { ...row, [field]: value } : row))

  const handleStartTest = async () => {
    setLoading(true); setError(null)
    const res = await updateTestStatusAction(test.id, 'In Progress')
    if (!res.success) setError(res.error ?? 'Failed')
    setLoading(false)
  }

  const handleRecordResult = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true); setError(null)
    const filledParams = parameters.filter(p => p.parameter_name.trim())
    const res = await recordLabResultAction({
      lab_test_id: test.id,
      result_value: resultValue || undefined,
      unit: unit || undefined,
      reference_range: refRange || undefined,
      remarks: remarks || undefined,
      parameters: filledParams,
    })
    if (!res.success) setError(res.error ?? 'Failed')
    setLoading(false)
  }

  const handleVerify = async () => {
    if (!existingResult) return
    setLoading(true); setError(null)
    const res = await verifyLabResultAction(existingResult.id, test.id)
    if (!res.success) setError(res.error ?? 'Failed')
    setLoading(false)
  }

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/laboratory/tests" className="p-2 bg-white border border-slate-200 rounded-lg shadow-sm text-slate-500 hover:text-slate-900 transition">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <FlaskConical className="w-6 h-6 text-blue-500" />
            <h1 className="text-2xl font-bold text-slate-900">{test.test_name}</h1>
            <span className={`px-3 py-1 rounded-full text-xs font-bold ${STATUS_BADGE[test.status] ?? ''}`}>
              {test.status}
            </span>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            {test.lab_order_item?.lab_order?.patient?.first_name} {test.lab_order_item?.lab_order?.patient?.last_name} •{' '}
            Order #{test.lab_order_item?.lab_order?.order_number}
          </p>
        </div>

        {/* Action buttons based on status */}
        <div className="flex gap-2">
          {test.status === 'Ordered' && (
            <button onClick={handleStartTest} disabled={loading}
              className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 text-sm">
              <Play className="w-4 h-4" /> Start Test
            </button>
          )}
          {test.status === 'Completed' && existingResult && existingResult.status === 'Entered' && (
            <button onClick={handleVerify} disabled={loading}
              className="inline-flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-green-700 disabled:opacity-50 text-sm">
              <ShieldCheck className="w-4 h-4" /> Verify Result
            </button>
          )}
        </div>
      </div>

      {error && (
        <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">{error}</div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">

          {/* Result entry — shown only if test is In Progress and no result yet */}
          {test.status === 'In Progress' && !existingResult && (
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <h2 className="text-lg font-bold text-slate-800 border-b border-slate-100 pb-3 mb-4">Enter Result</h2>
              <form onSubmit={handleRecordResult} className="space-y-5">
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1">Overall Value</label>
                    <input value={resultValue} onChange={e => setResultValue(e.target.value)} placeholder="e.g. Negative"
                      className="w-full px-3 py-2 border rounded-lg text-sm" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1">Unit</label>
                    <input value={unit} onChange={e => setUnit(e.target.value)} placeholder="e.g. mg/dL"
                      className="w-full px-3 py-2 border rounded-lg text-sm" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1">Reference Range</label>
                    <input value={refRange} onChange={e => setRefRange(e.target.value)} placeholder="e.g. 70-100"
                      className="w-full px-3 py-2 border rounded-lg text-sm" />
                  </div>
                </div>

                {/* Parameters Grid */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm font-bold text-slate-700">Parameters (for composite tests e.g. CBC, LFT)</p>
                    <button type="button" onClick={addRow} className="inline-flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800 font-semibold">
                      <Plus className="w-3.5 h-3.5" /> Add Row
                    </button>
                  </div>
                  <div className="border border-slate-200 rounded-lg overflow-hidden">
                    <table className="w-full text-sm">
                      <thead className="bg-slate-50 text-slate-500">
                        <tr>
                          <th className="px-3 py-2 text-left font-semibold">Parameter</th>
                          <th className="px-3 py-2 text-left font-semibold">Value</th>
                          <th className="px-3 py-2 text-left font-semibold">Unit</th>
                          <th className="px-3 py-2 text-left font-semibold">Ref. Range</th>
                          <th className="px-3 py-2"></th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {parameters.map((row, i) => (
                          <tr key={i}>
                            <td className="px-2 py-1.5">
                              <input value={row.parameter_name} onChange={e => updateRow(i, 'parameter_name', e.target.value)}
                                placeholder="e.g. Haemoglobin" className="w-full px-2 py-1.5 border rounded text-sm" />
                            </td>
                            <td className="px-2 py-1.5">
                              <input value={row.parameter_value} onChange={e => updateRow(i, 'parameter_value', e.target.value)}
                                placeholder="e.g. 12.5" className="w-28 px-2 py-1.5 border rounded text-sm" />
                            </td>
                            <td className="px-2 py-1.5">
                              <input value={row.unit} onChange={e => updateRow(i, 'unit', e.target.value)}
                                placeholder="g/dL" className="w-20 px-2 py-1.5 border rounded text-sm" />
                            </td>
                            <td className="px-2 py-1.5">
                              <input value={row.reference_range} onChange={e => updateRow(i, 'reference_range', e.target.value)}
                                placeholder="12-17" className="w-24 px-2 py-1.5 border rounded text-sm" />
                            </td>
                            <td className="px-2 py-1.5">
                              {parameters.length > 1 && (
                                <button type="button" onClick={() => removeRow(i)} className="text-red-400 hover:text-red-600">
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <p className="text-xs text-slate-400 mt-1">Abnormal flags are calculated automatically from Reference Ranges.</p>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Remarks</label>
                  <input value={remarks} onChange={e => setRemarks(e.target.value)} placeholder="Optional notes..."
                    className="w-full px-3 py-2 border rounded-lg text-sm" />
                </div>

                <div className="flex justify-end">
                  <button type="submit" disabled={loading}
                    className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 inline-flex items-center gap-2">
                    <CheckCircle className="w-4 h-4" /> Save Result
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Existing Result Display */}
          {existingResult && (
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
                <h2 className="text-lg font-bold text-slate-800">Result Report</h2>
                <div className="flex items-center gap-3">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                    existingResult.status === 'Verified' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
                  }`}>
                    {existingResult.status}
                  </span>
                  {existingResult.status === 'Verified' && (
                    <span className="text-xs text-slate-500">
                      Verified {dayjs(existingResult.verified_at).format('MMM D, h:mm A')}
                    </span>
                  )}
                </div>
              </div>

              {/* Overall Result */}
              {existingResult.result_value && (
                <div className="px-6 py-4 border-b border-slate-100">
                  <div className="flex items-center gap-6">
                    <div>
                      <p className="text-xs text-slate-500 uppercase tracking-wide font-semibold">Overall Result</p>
                      <p className="text-2xl font-bold text-slate-900 mt-1">
                        {existingResult.result_value} <span className="text-base text-slate-400">{existingResult.unit}</span>
                      </p>
                      {existingResult.reference_range && (
                        <p className="text-xs text-slate-400">Ref: {existingResult.reference_range}</p>
                      )}
                    </div>
                    <FlagBadge flag={existingResult.abnormal_flag as AbnormalFlag} />
                  </div>
                </div>
              )}

              {/* Parameters */}
              {existingResult.lab_result_parameters?.length > 0 && (
                <div>
                  <table className="w-full text-sm text-slate-600">
                    <thead className="bg-slate-50 text-slate-500 border-y border-slate-100">
                      <tr>
                        <th className="px-6 py-3 text-left font-semibold">Parameter</th>
                        <th className="px-6 py-3 text-left font-semibold">Value</th>
                        <th className="px-6 py-3 text-left font-semibold">Unit</th>
                        <th className="px-6 py-3 text-left font-semibold">Ref. Range</th>
                        <th className="px-6 py-3 text-left font-semibold">Flag</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                      {existingResult.lab_result_parameters.map((p: any) => (
                        <tr key={p.id} className={p.abnormal_flag !== 'Normal' ? 'bg-red-50/40' : ''}>
                          <td className="px-6 py-3 font-medium text-slate-800">{p.parameter_name}</td>
                          <td className={`px-6 py-3 font-bold ${p.abnormal_flag !== 'Normal' ? 'text-red-700' : 'text-slate-800'}`}>
                            {p.parameter_value ?? '—'}
                          </td>
                          <td className="px-6 py-3 text-slate-500">{p.unit ?? '—'}</td>
                          <td className="px-6 py-3 text-slate-500">{p.reference_range ?? '—'}</td>
                          <td className="px-6 py-3">
                            <FlagBadge flag={p.abnormal_flag as AbnormalFlag} />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {existingResult.remarks && (
                <div className="px-6 py-4 text-sm text-slate-500 italic border-t border-slate-100">
                  Remarks: {existingResult.remarks}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right sidebar — test info */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 space-y-3">
            <h3 className="font-bold text-slate-800 border-b border-slate-100 pb-3">Test Information</h3>
            <InfoRow label="Test Code" value={test.test_code || '—'} />
            <InfoRow label="Department" value={test.department || '—'} />
            <InfoRow label="Instrument" value={test.instrument || '—'} />
            <InfoRow label="Created" value={dayjs(test.created_at).format('MMM D, YYYY h:mm A')} />
            {test.started_at && <InfoRow label="Started" value={dayjs(test.started_at).format('MMM D, YYYY h:mm A')} />}
            {test.completed_at && <InfoRow label="Completed" value={dayjs(test.completed_at).format('MMM D, YYYY h:mm A')} />}
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 space-y-3">
            <h3 className="font-bold text-slate-800 border-b border-slate-100 pb-3">Patient & Order</h3>
            <InfoRow
              label="Patient"
              value={`${test.lab_order_item?.lab_order?.patient?.first_name} ${test.lab_order_item?.lab_order?.patient?.last_name}`}
            />
            <InfoRow label="Order No." value={test.lab_order_item?.lab_order?.order_number || '—'} />
            <InfoRow label="Test Item" value={test.lab_order_item?.test_name || '—'} />
            {test.lab_order_item?.sample_type && (
              <InfoRow label="Sample Type" value={test.lab_order_item.sample_type} />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between text-sm">
      <span className="text-slate-500">{label}</span>
      <span className="font-medium text-slate-800 text-right max-w-[55%]">{value}</span>
    </div>
  )
}
