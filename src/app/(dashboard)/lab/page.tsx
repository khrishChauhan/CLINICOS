import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'

const STATUS_COLORS: Record<string, string> = {
  'Ordered': 'bg-slate-100 text-slate-700',
  'Sample Collected': 'bg-blue-100 text-blue-700',
  'Processing': 'bg-amber-100 text-amber-700',
  'Result Ready': 'bg-purple-100 text-purple-700',
  'Verified': 'bg-emerald-100 text-emerald-700',
}

export default async function LabDashboard() {
  const supabase = await createClient()
  const { data: orders } = await supabase
    .from('lab_orders')
    .select('*, patients(first_name, last_name)')
    .order('created_at', { ascending: false })

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Laboratory Dashboard</h1>
          <p className="text-sm text-gray-500 mt-1">All lab orders queue</p>
        </div>
        <Link href="/lab/catalog" className="bg-blue-600 text-white px-4 py-2 rounded font-medium hover:bg-blue-700">
          Manage Catalog
        </Link>
      </div>

      <div className="bg-white rounded-lg border shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b text-slate-700 text-sm">
            <tr>
              <th className="p-4">Order #</th>
              <th className="p-4">Patient</th>
              <th className="p-4">Priority</th>
              <th className="p-4">Status</th>
              <th className="p-4">Date</th>
              <th className="p-4">Action</th>
            </tr>
          </thead>
          <tbody>
            {orders?.map(o => (
              <tr key={o.id} className="border-b hover:bg-slate-50 text-sm">
                <td className="p-4 font-mono font-medium">{o.order_number}</td>
                <td className="p-4">{o.patients?.first_name} {o.patients?.last_name}</td>
                <td className="p-4">
                  <span className={`px-2 py-0.5 rounded text-xs font-semibold ${o.priority === 'STAT' ? 'bg-red-100 text-red-700' : o.priority === 'Urgent' ? 'bg-orange-100 text-orange-700' : 'bg-gray-100 text-gray-600'}`}>
                    {o.priority}
                  </span>
                </td>
                <td className="p-4">
                  <span className={`px-2 py-0.5 rounded text-xs font-semibold ${STATUS_COLORS[o.status] || ''}`}>
                    {o.status}
                  </span>
                </td>
                <td className="p-4 text-gray-500">{new Date(o.created_at).toLocaleDateString('en-IN')}</td>
                <td className="p-4">
                  <Link href={`/lab/orders/${o.id}`} className="text-blue-600 font-medium hover:underline">
                    Open
                  </Link>
                </td>
              </tr>
            ))}
            {!orders?.length && (
              <tr><td colSpan={6} className="p-8 text-center text-gray-400">No lab orders found.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}