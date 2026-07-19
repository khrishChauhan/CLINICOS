import { fetchPlatformKPIsAction } from '@/actions/platform/platformActions'
import Link from 'next/link'

export default async function PlatformDashboard() {
  const res = await fetchPlatformKPIsAction()
  const kpis = res.ok ? res.data : { totalClinics: 0, activeClinics: 0, activeSubscriptions: 0, trialSubscriptions: 0 }

  return (
    <div className="p-8 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Platform Overview</h1>
        <p className="text-sm text-slate-400 mt-1">Multi-tenant SaaS health metrics</p>
      </div>

      <div className="grid grid-cols-4 gap-4">
        <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-5">
          <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider mb-2">Total Tenants</p>
          <p className="text-3xl font-black text-white">{kpis.totalClinics}</p>
        </div>
        <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-5">
          <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider mb-2">Active Clinics</p>
          <p className="text-3xl font-black text-emerald-400">{kpis.activeClinics}</p>
        </div>
        <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-5">
          <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider mb-2">Paid Subscriptions</p>
          <p className="text-3xl font-black text-blue-400">{kpis.activeSubscriptions}</p>
        </div>
        <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-5">
          <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider mb-2">On Trial</p>
          <p className="text-3xl font-black text-orange-400">{kpis.trialSubscriptions}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Link href="/platform/tenants" className="group bg-slate-800/50 border border-slate-700 hover:border-red-500/50 rounded-xl p-6 transition-colors">
          <h2 className="text-lg font-bold text-white group-hover:text-red-300">Tenant Manager →</h2>
          <p className="text-sm text-slate-400 mt-1">Provision clinics, manage plans, suspend tenants</p>
        </Link>
        <Link href="/platform/audit" className="group bg-slate-800/50 border border-slate-700 hover:border-red-500/50 rounded-xl p-6 transition-colors">
          <h2 className="text-lg font-bold text-white group-hover:text-red-300">Audit Logs →</h2>
          <p className="text-sm text-slate-400 mt-1">View all Super Admin actions and impersonation events</p>
        </Link>
      </div>
    </div>
  )
}
