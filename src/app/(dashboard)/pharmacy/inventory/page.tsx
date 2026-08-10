import { fetchEnterpriseDashboardAction } from '@/actions/pharmacy/pharmacyActions'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { InventoryActionsClient } from './InventoryActionsClient'

export default async function EnterpriseInventoryDashboard() {
  const res = await fetchEnterpriseDashboardAction()
  if (!res.ok || !res.data) return <div className="p-8 text-red-500">Error: {res.error}</div>

  const { alerts, medicines, transactions } = res.data
  const { lowStock, expiringBatches } = alerts

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 min-h-screen pb-20">
      
      {/* Header & Quick Actions */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-white p-6 rounded-xl shadow-sm border border-slate-200">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 tracking-tight">Enterprise Inventory Dashboard</h1>
          <p className="text-sm text-slate-500 mt-1">Real-time pharmacy metrics and batch tracking</p>
        </div>
        <InventoryActionsClient medicines={medicines} />
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        <Card className="p-6 border-slate-200 shadow-sm flex flex-col justify-center">
          <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-1">Total Medicines</p>
          <p className="text-3xl font-black text-slate-800">{medicines.length}</p>
        </Card>
        <Card className="p-6 border-slate-200 shadow-sm flex flex-col justify-center bg-red-50/50">
          <p className="text-sm font-semibold text-red-500 uppercase tracking-wider mb-1 flex items-center gap-2">
            <span>⚠</span> Low Stock Items
          </p>
          <p className="text-3xl font-black text-red-600">{lowStock.length}</p>
        </Card>
        <Card className="p-6 border-slate-200 shadow-sm flex flex-col justify-center bg-orange-50/50">
          <p className="text-sm font-semibold text-orange-500 uppercase tracking-wider mb-1 flex items-center gap-2">
            <span>⌛</span> Expiring Soon
          </p>
          <p className="text-3xl font-black text-orange-600">{expiringBatches.length}</p>
        </Card>
        <Card className="p-6 border-slate-200 shadow-sm flex flex-col justify-center">
          <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-1">Today's Transactions</p>
          <p className="text-3xl font-black text-slate-800">
            {transactions.filter((t: any) => new Date(t.created_at).toDateString() === new Date().toDateString()).length}
          </p>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Alerts & Tables */}
        <div className="lg:col-span-2 space-y-8">
          
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="bg-slate-50 px-6 py-4 border-b border-slate-200">
              <h2 className="font-bold text-lg text-slate-800">Recent Inventory Transactions</h2>
            </div>
            <div className="p-0 overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 text-slate-500 uppercase text-xs font-semibold border-b">
                  <tr>
                    <th className="px-6 py-3">Type</th>
                    <th className="px-6 py-3">Medicine</th>
                    <th className="px-6 py-3">Batch</th>
                    <th className="px-6 py-3">Qty Change</th>
                    <th className="px-6 py-3">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {transactions.length === 0 && (
                    <tr>
                      <td colSpan={5} className="px-6 py-8 text-center text-slate-400">No recent transactions.</td>
                    </tr>
                  )}
                  {transactions.map((t: any) => (
                    <tr key={t.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Badge variant={t.transaction_type === 'Dispense' ? 'warning' : t.transaction_type === 'Purchase' ? 'success' : 'default'}>
                          {t.transaction_type}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 font-medium text-slate-700">{t.medicines?.name || 'Unknown'}</td>
                      <td className="px-6 py-4 font-mono text-slate-500">{t.medicine_batches?.batch_number || 'Unknown'}</td>
                      <td className={`px-6 py-4 font-bold ${t.quantity_change > 0 ? 'text-green-600' : 'text-red-500'}`}>
                        {t.quantity_change > 0 ? '+' : ''}{t.quantity_change}
                      </td>
                      <td className="px-6 py-4 text-slate-500 text-xs">
                        {new Date(t.created_at).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Column: Widgets */}
        <div className="space-y-8">
          
          <div className="bg-white rounded-xl border border-red-200 shadow-sm overflow-hidden">
            <div className="bg-red-50 px-6 py-4 border-b border-red-100 flex items-center justify-between">
              <h2 className="font-bold text-red-700 flex items-center gap-2">
                <span>⚠</span> Action Required: Low Stock
              </h2>
            </div>
            <div className="p-6 space-y-4">
              {lowStock.length === 0 && <p className="text-slate-500 text-sm text-center">Stock levels are healthy.</p>}
              {lowStock.map((item: any) => (
                <div key={item.medicine.id} className="flex justify-between items-center pb-3 border-b border-slate-100 last:border-0 last:pb-0">
                  <div>
                    <p className="font-semibold text-slate-800">{item.medicine.name}</p>
                    <p className="text-xs text-slate-500">Reorder Level: {item.medicine.reorder_level}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-red-600">{item.total_quantity}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-xl border border-orange-200 shadow-sm overflow-hidden">
            <div className="bg-orange-50 px-6 py-4 border-b border-orange-100 flex items-center justify-between">
              <h2 className="font-bold text-orange-700 flex items-center gap-2">
                <span>⌛</span> Near Expiry (90 Days)
              </h2>
            </div>
            <div className="p-6 space-y-4">
              {expiringBatches.length === 0 && <p className="text-slate-500 text-sm text-center">No batches expiring soon.</p>}
              {expiringBatches.map((item: any, i: number) => (
                <div key={i} className="flex flex-col pb-3 border-b border-slate-100 last:border-0 last:pb-0">
                  <div className="flex justify-between items-center mb-1">
                    <p className="font-semibold text-slate-800">{item.medicine_name}</p>
                    <Badge variant="warning">{new Date(item.expiry_date).toLocaleDateString()}</Badge>
                  </div>
                  <div className="flex justify-between text-xs text-slate-500 font-mono">
                    <span>Batch: {item.batch_number}</span>
                    <span>Qty: {item.current_quantity}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}
