'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createMedicineAction } from '@/actions/pharmacy/pharmacyActions'
import type { MedicineRow } from '@/types/pharmacy'

export default function MedicineCatalogClient({ initialData }: { initialData: MedicineRow[] }) {
  const router = useRouter()
  const [genericName, setGenericName] = useState('')
  const [brandName, setBrandName] = useState('')
  const [unitPrice, setUnitPrice] = useState(0)
  const [reorderLevel, setReorderLevel] = useState(10)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const res = await createMedicineAction({ generic_name: genericName, brand_name: brandName, unit_price: unitPrice, reorder_level: reorderLevel })
    if (res.ok) {
      toast.success('Medicine created')
      setGenericName('')
      setBrandName('')
      router.refresh()
    } else {
      toast.error(res.error)
    }
  }

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Medicine Catalog</h1>
        <Link href="/pharmacy" className="text-sm text-blue-600 hover:underline">← Dashboard</Link>
      </div>

      <div className="bg-white p-6 rounded-lg border shadow-sm">
        <h2 className="font-semibold mb-4">Add Medicine</h2>
        <form onSubmit={handleSubmit} className="grid grid-cols-4 gap-4 items-end">
          <div className="col-span-2">
            <label className="text-xs font-semibold block mb-1">Generic Name *</label>
            <input required value={genericName} onChange={e => setGenericName(e.target.value)} className="w-full border p-2 rounded" placeholder="Paracetamol..." />
          </div>
          <div>
            <label className="text-xs font-semibold block mb-1">Brand Name</label>
            <input value={brandName} onChange={e => setBrandName(e.target.value)} className="w-full border p-2 rounded" placeholder="Calpol 500mg..." />
          </div>
          <div>
            <label className="text-xs font-semibold block mb-1">Unit Price (₹)</label>
            <input required type="number" step="0.01" value={unitPrice} onChange={e => setUnitPrice(Number(e.target.value))} className="w-full border p-2 rounded" />
          </div>
          <div className="col-span-3">
            <label className="text-xs font-semibold block mb-1">Reorder Level</label>
            <input required type="number" value={reorderLevel} onChange={e => setReorderLevel(Number(e.target.value))} className="w-full border p-2 rounded" />
          </div>
          <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded font-medium h-[42px]">Create Medicine</button>
        </form>
      </div>

      <div className="bg-white rounded-lg border shadow-sm overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 border-b text-slate-700">
            <tr>
              <th className="p-4">Name</th>
              <th className="p-4">Unit</th>
              <th className="p-4 text-right">Reorder Level</th>
            </tr>
          </thead>
          <tbody>
            {initialData.map(m => (
              <tr key={m.id} className="border-b hover:bg-slate-50">
                <td className="p-4 font-medium">{m.brand_name || m.generic_name}</td>
                <td className="p-4 text-gray-500">{m.generic_name}</td>
                <td className="p-4 text-right font-semibold text-red-500">{m.reorder_level}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
