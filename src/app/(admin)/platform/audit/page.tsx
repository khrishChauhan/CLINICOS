import { fetchAuditLogsAction } from '@/actions/platform/platformActions'

export default async function AuditPage() {
  const res = await fetchAuditLogsAction()
  const logs = res.ok ? (res.data || []) : []

  const actionBadge = (action: string) => {
    if (action.includes('IMPERSONATION')) return 'bg-red-500/20 text-red-400 border-red-500/30'
    if (action.includes('SUSPEND')) return 'bg-orange-500/20 text-orange-400 border-orange-500/30'
    if (action.includes('PROVISION')) return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
    return 'bg-slate-700 text-slate-300 border-slate-600'
  }

  return (
    <div className="p-8 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Platform Audit Logs</h1>
        <p className="text-sm text-slate-400 mt-1">Immutable record of all Super Admin actions</p>
      </div>

      <div className="bg-slate-800/50 border border-slate-700 rounded-xl overflow-hidden">
        <table className="w-full text-sm text-left">
          <thead className="bg-slate-900 text-slate-400 text-xs uppercase">
            <tr>
              <th className="p-4">Timestamp</th>
              <th className="p-4">Actor</th>
              <th className="p-4">Action</th>
              <th className="p-4">Target</th>
              <th className="p-4">Details</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {logs.length === 0 && (
              <tr><td colSpan={5} className="p-8 text-center text-slate-500">No audit events recorded yet.</td></tr>
            )}
            {logs.map(log => (
              <tr key={log.id} className="hover:bg-slate-800/50">
                <td className="p-4 text-slate-500 text-xs whitespace-nowrap">{new Date(log.created_at).toLocaleString()}</td>
                <td className="p-4 text-slate-300 text-xs">
                  {(log.users as any)?.email || log.actor_user_id.slice(0, 8) + '...'}
                </td>
                <td className="p-4">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${actionBadge(log.action)}`}>{log.action}</span>
                </td>
                <td className="p-4 text-slate-400 text-xs">{log.target_type || '—'}</td>
                <td className="p-4 text-slate-500 text-xs font-mono max-w-xs truncate">{JSON.stringify(log.metadata)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
