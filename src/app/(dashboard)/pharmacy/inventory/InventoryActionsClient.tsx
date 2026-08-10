'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { AddBatchModal } from './AddBatchModal'

export function InventoryActionsClient({ medicines }: { medicines: any[] }) {
  const [showAddBatch, setShowAddBatch] = useState(false)

  return (
    <>
      <div className="flex flex-wrap gap-3 mt-4 md:mt-0">
        <Link href="/pharmacy/medicines" className="bg-white border border-slate-300 text-slate-700 px-4 py-2 rounded-lg font-medium hover:bg-slate-50 transition-colors shadow-sm">
          Catalog & Registry
        </Link>
        <button 
          onClick={() => setShowAddBatch(true)}
          className="bg-white border border-slate-300 text-slate-700 px-4 py-2 rounded-lg font-medium hover:bg-slate-50 transition-colors shadow-sm"
        >
          Add Batch
        </button>
        <button className="bg-white border border-slate-300 text-slate-700 px-4 py-2 rounded-lg font-medium hover:bg-slate-50 transition-colors shadow-sm cursor-not-allowed opacity-50">
          Adjust Stock
        </button>
        <Link href="/pharmacy/dispense" className="bg-blue-600 text-white px-5 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors shadow-sm">
          Dispense to Patient
        </Link>
      </div>

      {showAddBatch && <AddBatchModal medicines={medicines} onClose={() => setShowAddBatch(false)} />}
    </>
  )
}
