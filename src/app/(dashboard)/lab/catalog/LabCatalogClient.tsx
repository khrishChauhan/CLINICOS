'use client'

import { useState } from 'react'
import type { LabTestRow } from '@/types/laboratory'
import { createLabTestAction } from '@/actions/laboratory/laboratoryActions'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function LabCatalogClient({ initialTests }: { initialTests: LabTestRow[] }) {
  const router = useRouter()
  const [name, setName] = useState('')
  const [specimen, setSpecimen] = useState('Blood')
  const [unit, setUnit] = useState('')
  const [resultType, setResultType] = useState('numeric')
  const [price, setPrice] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const res = await createLabTestAction(name, specimen, unit, resultType, Number(price))
    if (res.ok) {
      toast.success('Test created')
      setName(''); setUnit(''); setPrice('')
      router.refresh()
    } else {
      toast.error(res.error)
    }
  }

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Lab Test Catalog</h1>
        <Link href="/lab" className="text-sm text-blue-600 hover:underline">← Back to Dashboard</Link>
      </div>

      <div className="bg-white p-6 rounded-lg border shadow-sm mb-8">
        <h2 className="font-semibold mb-4">Add New Test</h2>
        <form onSubmit={handleSubmit} className="grid grid-cols-5 gap-4 items-end">
          <div className="col-span-2">
            <label className="text-xs font-semibold block mb-1">Test Name</label>
            <input required value={name} onChange={e => setName(e.target.value)} className="w-full border p-2 rounded" placeholder="CBC, Lipid Profile..." />
          </div>
          <div>
            <label className="text-xs font-semibold block mb-1">Specimen</label>
            <select value={specimen} onChange={e => setSpecimen(e.target.value)} className="w-full border p-2 rounded">
              {['Blood', 'Urine', 'Stool', 'Sputum', 'Swab', 'Other'].map(s => <option key={s}>{s}</option>)}
            </select>
          </div>
          <div>
            <label className="text-xs font-semibold block mb-1">Unit</label>
            <input value={unit} onChange={e => setUnit(e.target.value)} className="w-full border p-2 rounded" placeholder="mg/dL, g/dL..." />
          </div>
          <div>
            <label className="text-xs font-semibold block mb-1">Type</label>
            <select value={resultType} onChange={e => setResultType(e.target.value)} className="w-full border p-2 rounded">
              <option value="numeric">Numeric</option>
              <option value="qualitative">Qualitative</option>
              <option value="text">Text</option>
            </select>
          </div>
          <div>
            <label className="text-xs font-semibold block mb-1">Price (₹)</label>
            <input required type="number" value={price} onChange={e => setPrice(e.target.value)} className="w-full border p-2 rounded" />
          </div>
          <button type="submit" className="col-span-1 bg-blue-600 text-white px-4 py-2 rounded font-medium h-[42px]">Add</button>
        </form>
      </div>

      <div className="bg-white rounded-lg border shadow-sm overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 border-b text-slate-700">
            <tr>
              <th className="p-4">Test Name</th>
              <th className="p-4">Specimen</th>
              <th className="p-4">Unit</th>
              <th className="p-4">Type</th>
              <th className="p-4 text-right">Price</th>
            </tr>
          </thead>
          <tbody>
            {initialTests.map(t => (
              <tr key={t.id} className="border-b hover:bg-slate-50">
                <td className="p-4 font-medium">{t.name}</td>
                <td className="p-4 text-gray-500">{t.specimen_type}</td>
                <td className="p-4 text-gray-500">{t.unit || '—'}</td>
                <td className="p-4">
                  <span className="px-2 py-0.5 text-xs bg-slate-100 rounded font-medium">{t.result_type}</span>
                </td>
                <td className="p-4 text-right font-semibold">₹{Number(t.price).toFixed(2)}</td>
              </tr>
            ))}
            {!initialTests.length && <tr><td colSpan={5} className="p-8 text-center text-gray-400">No tests yet.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  )
}
