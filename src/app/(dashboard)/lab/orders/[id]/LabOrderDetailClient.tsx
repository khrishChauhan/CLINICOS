'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  collectSampleAction,
  enterResultsAction,
  verifyResultAction
} from '@/actions/laboratory/laboratoryActions'

const STATUS_STEP: Record<string, number> = {
  'Ordered': 0,
  'Sample Collected': 1,
  'Processing': 2,
  'Result Ready': 3,
  'Verified': 4
}

export default function LabOrderDetailClient({ order }: { order: any }) {
  const router = useRouter()
  const step = STATUS_STEP[order.status] ?? 0
  const patient = order.patients

  // Result inputs state: { [itemId]: { valueNumeric?, valueText? } }
  const [resultInputs, setResultInputs] = useState<Record<string, any>>({})
  const [verifyRemarks, setVerifyRemarks] = useState('')

  async function handleCollectSample() {
    const specimenType = order.lab_order_items?.[0]?.lab_tests?.specimen_type || 'Blood'
    const res = await collectSampleAction(order.id, specimenType)
    if (res.ok) { toast.success('Sample collected! Barcode: ' + res.data?.barcode); router.refresh() }
    else toast.error(res.error)
  }

  async function handleEnterResults() {
    const inputs = order.lab_order_items.map((item: any) => ({
      labOrderItemId: item.id,
      labTestId: item.lab_test_id,
      valueNumeric: resultInputs[item.id]?.numeric ? Number(resultInputs[item.id].numeric) : undefined,
      valueText: resultInputs[item.id]?.text || undefined
    }))
    const res = await enterResultsAction(order.id, inputs, { date_of_birth: patient.date_of_birth, gender: patient.gender })
    if (res.ok) { toast.success('Results entered and evaluated!'); router.refresh() }
    else toast.error(res.error)
  }

  async function handleVerify() {
    const result = order.lab_results
    if (!result) return
    const res = await verifyResultAction(order.id, result.id, verifyRemarks)
    if (res.ok) { toast.success('Report Verified!'); router.refresh() }
    else toast.error(res.error)
  }

  const steps = ['Ordered', 'Sample Collected', 'Processing', 'Result Ready', 'Verified']

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between bg-white p-6 rounded-lg border shadow-sm">
        <div>
          <Link href="/lab" className="text-xs text-blue-600 hover:underline">← Lab Dashboard</Link>
          <h1 className="text-xl font-bold mt-1">Order: {order.order_number}</h1>
          <p className="text-sm text-gray-500">Patient: <span className="font-medium text-slate-800">{patient?.first_name} {patient?.last_name}</span></p>
          <p className="text-sm text-gray-500">Priority: <span className={`font-semibold ${order.priority === 'STAT' ? 'text-red-600' : order.priority === 'Urgent' ? 'text-orange-500' : 'text-slate-600'}`}>{order.priority}</span></p>
        </div>
        <span className="px-3 py-1 text-sm font-semibold rounded-full bg-blue-100 text-blue-700">{order.status}</span>
      </div>

      {/* Progress Stepper */}
      <div className="bg-white p-6 rounded-lg border shadow-sm">
        <div className="flex items-center gap-0">
          {steps.map((s, i) => (
            <div key={s} className="flex-1 flex flex-col items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-colors
                ${i < step ? 'bg-emerald-500 border-emerald-500 text-white' : i === step ? 'bg-blue-600 border-blue-600 text-white' : 'bg-white border-slate-300 text-slate-400'}`}>
                {i < step ? '✓' : i + 1}
              </div>
              <span className={`text-xs mt-1 text-center ${i <= step ? 'text-slate-700 font-medium' : 'text-slate-400'}`}>{s}</span>
              {i < steps.length - 1 && (
                <div className={`h-0.5 w-full mt-[-20px] mb-[20px] ${i < step ? 'bg-emerald-500' : 'bg-slate-200'}`} />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Ordered Tests */}
      <div className="bg-white p-6 rounded-lg border shadow-sm">
        <h2 className="font-bold text-lg mb-4">Tests Ordered</h2>
        <div className="space-y-2">
          {order.lab_order_items?.map((item: any) => (
            <div key={item.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
              <div>
                <p className="font-medium text-slate-800">{item.lab_tests?.name}</p>
                <p className="text-xs text-gray-500">Specimen: {item.lab_tests?.specimen_type} • Unit: {item.lab_tests?.unit || 'N/A'}</p>
              </div>
              {/* Result display if available */}
              {order.lab_results?.lab_result_values?.find((v: any) => v.lab_order_item_id === item.id) && (() => {
                const val = order.lab_results.lab_result_values.find((v: any) => v.lab_order_item_id === item.id)
                return (
                  <div className="text-right">
                    <span className={`text-lg font-bold ${val.is_critical ? 'text-red-600' : val.is_abnormal ? 'text-amber-500' : 'text-emerald-600'}`}>
                      {val.value_numeric ?? val.value_text}
                      {item.lab_tests?.unit && <span className="text-sm font-normal ml-1">{item.lab_tests.unit}</span>}
                    </span>
                    {val.is_critical && <span className="ml-2 px-1.5 py-0.5 text-xs bg-red-100 text-red-700 rounded font-bold">CRITICAL</span>}
                    {!val.is_critical && val.is_abnormal && <span className="ml-2 px-1.5 py-0.5 text-xs bg-amber-100 text-amber-700 rounded font-bold">ABNORMAL</span>}
                    {!val.is_abnormal && <span className="ml-2 px-1.5 py-0.5 text-xs bg-emerald-100 text-emerald-700 rounded font-bold">NORMAL</span>}
                  </div>
                )
              })()}
              {/* Input for entering results */}
              {step === 1 && item.lab_tests?.result_type === 'numeric' && (
                <input
                  type="number"
                  placeholder="Enter value..."
                  className="w-32 border p-1.5 rounded text-sm"
                  value={resultInputs[item.id]?.numeric || ''}
                  onChange={e => setResultInputs(prev => ({ ...prev, [item.id]: { ...prev[item.id], numeric: e.target.value } }))}
                />
              )}
              {step === 1 && item.lab_tests?.result_type !== 'numeric' && (
                <input
                  type="text"
                  placeholder="Positive / Negative..."
                  className="w-40 border p-1.5 rounded text-sm"
                  value={resultInputs[item.id]?.text || ''}
                  onChange={e => setResultInputs(prev => ({ ...prev, [item.id]: { ...prev[item.id], text: e.target.value } }))}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Sample Info */}
      {order.lab_samples?.[0] && (
        <div className="bg-white p-6 rounded-lg border shadow-sm">
          <h2 className="font-bold text-lg mb-3">Sample</h2>
          <div className="flex gap-6 text-sm">
            <div><span className="text-gray-400">Barcode:</span> <span className="font-mono font-bold">{order.lab_samples[0].barcode}</span></div>
            <div><span className="text-gray-400">Collected At:</span> <span>{new Date(order.lab_samples[0].collected_at).toLocaleString('en-IN')}</span></div>
          </div>
        </div>
      )}

      {/* Verify Panel */}
      {step === 3 && (
        <div className="bg-white p-6 rounded-lg border shadow-sm">
          <h2 className="font-bold text-lg mb-4">Pathologist Verification</h2>
          <textarea
            className="w-full border p-3 rounded mb-4 text-sm"
            rows={3}
            placeholder="Add remarks (optional)..."
            value={verifyRemarks}
            onChange={e => setVerifyRemarks(e.target.value)}
          />
          <button onClick={handleVerify} className="bg-emerald-600 text-white px-6 py-2 rounded font-medium hover:bg-emerald-700">
            Verify & Finalize Report
          </button>
        </div>
      )}

      {/* Verified Badge */}
      {step === 4 && (
        <div className="bg-emerald-50 border border-emerald-200 p-6 rounded-lg flex items-center gap-4">
          <div className="text-emerald-500 text-3xl">✓</div>
          <div>
            <p className="font-bold text-emerald-700">Report Verified</p>
            <p className="text-sm text-emerald-600">This report has been finalized and locked.</p>
            {order.lab_results?.remarks && <p className="text-sm mt-1 italic text-emerald-800">"{order.lab_results.remarks}"</p>}
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex gap-4">
        {step === 0 && (
          <button onClick={handleCollectSample} className="bg-blue-600 text-white px-6 py-2.5 rounded font-medium hover:bg-blue-700">
            Collect Sample
          </button>
        )}
        {step === 1 && (
          <button onClick={handleEnterResults} className="bg-purple-600 text-white px-6 py-2.5 rounded font-medium hover:bg-purple-700">
            Submit Results
          </button>
        )}
      </div>
    </div>
  )
}
