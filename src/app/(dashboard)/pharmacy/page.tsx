import { fetchInventoryAlertsAction } from '@/actions/pharmacy/pharmacyActions'
import Link from 'next/link'

export default async function PharmacyDashboard() {
  const res = await fetchInventoryAlertsAction()
  if (!res.ok) return <div className="p-8 text-red-500">Error: {res.error}</div>

  const { lowStock, expiringBatches } = res.data

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-6">
      <div className="flex justify-between items-center bg-white p-6 rounded-lg shadow-sm border">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Pharmacy & Inventory Dashboard</h1>
          <p className="text-sm text-gray-500 mt-1">Batch-level inventory alerts</p>
        </div>
        <div className="flex gap-3">
          <Link href="/pharmacy/medicines" className="bg-white border text-slate-700 px-4 py-2 rounded font-medium hover:bg-slate-50">Master Catalog</Link>
          <Link href="/pharmacy/dispense" className="bg-blue-600 text-white px-4 py-2 rounded font-medium hover:bg-blue-700">Dispense to Patient</Link>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        {/* Low Stock Alerts */}
        <div className="bg-white p-6 rounded-lg border shadow-sm">
          <h2 className="font-bold text-lg mb-4 text-red-600 flex items-center gap-2">
            <span>⚠</span> Low Stock Alerts
          </h2>
          <div className="space-y-3">
            {lowStock.map((item: any) => (
              <div key={item.medicine.id} className="flex justify-between p-3 bg-red-50 rounded border border-red-100">
                <div>
                  <p className="font-semibold text-slate-800">{item.medicine.name}</p>
                  <p className="text-xs text-gray-500">Reorder Level: {item.medicine.reorder_level}</p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-red-600">{item.total_quantity} <span className="text-sm font-normal">{item.medicine.unit}</span></p>
                </div>
              </div>
            ))}
            {lowStock.length === 0 && <p className="text-gray-500 text-sm">Stock levels are healthy.</p>}
          </div>
        </div>

        {/* Expiring Soon Alerts */}
        <div className="bg-white p-6 rounded-lg border shadow-sm">
          <h2 className="font-bold text-lg mb-4 text-orange-600 flex items-center gap-2">
            <span>⌛</span> Expiring Soon (90 Days)
          </h2>
          <div className="space-y-3">
            {expiringBatches.map((item: any, i: number) => (
              <div key={i} className="flex justify-between p-3 bg-orange-50 rounded border border-orange-100">
                <div>
                  <p className="font-semibold text-slate-800">{item.medicine_name}</p>
                  <p className="text-xs text-gray-500">Batch: {item.batch_number}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-orange-600">{new Date(item.expiry_date).toLocaleDateString()}</p>
                  <p className="text-xs text-gray-500">Qty: {item.current_quantity}</p>
                </div>
              </div>
            ))}
            {expiringBatches.length === 0 && <p className="text-gray-500 text-sm">No batches expiring soon.</p>}
          </div>
        </div>
      </div>
    </div>
  )
}