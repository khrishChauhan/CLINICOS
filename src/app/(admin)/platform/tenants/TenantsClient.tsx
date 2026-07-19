'use client'

import { useState } from 'react'
import { provisionClinicAction, suspendClinicAction, reactivateClinicAction } from '@/actions/platform/platformActions'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import type { ClinicTenant, SubscriptionPlan } from '@/types/platform'

export default function TenantsClient({
  clinics,
  plans
}: {
  clinics: ClinicTenant[]
  plans: SubscriptionPlan[]
}) {
  const router = useRouter()
  const [showForm, setShowForm] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [form, setForm] = useState({
    clinicName: '',
    clinicCode: '',
    email: '',
    mobile: '',
    city: '',
    planCode: 'basic',
    adminEmail: '',
    adminFirstName: '',
    adminLastName: '',
  })

  function update(k: string, v: string) {
    setForm(f => ({ ...f, [k]: v }))
  }

  async function handleProvision(e: React.FormEvent) {
    e.preventDefault()
    setSubmitting(true)
    const res = await provisionClinicAction(form)
    if (res.ok) {
      toast.success(`Clinic "${form.clinicName}" provisioned! Clinic ID: ${res.data?.clinic_id}`)
      setShowForm(false)
      setForm({ clinicName: '', clinicCode: '', email: '', mobile: '', city: '', planCode: 'basic', adminEmail: '', adminFirstName: '', adminLastName: '' })
      router.refresh()
    } else {
      toast.error(res.error)
    }
    setSubmitting(false)
  }

  async function handleSuspend(id: string) {
    const res = await suspendClinicAction(id)
    if (res.ok) { toast.success('Clinic suspended'); router.refresh() }
    else toast.error(res.error)
  }

  async function handleReactivate(id: string) {
    const res = await reactivateClinicAction(id)
    if (res.ok) { toast.success('Clinic reactivated'); router.refresh() }
    else toast.error(res.error)
  }

  return (
    <div className="p-8 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-white">Tenant Manager</h1>
          <p className="text-sm text-slate-400 mt-1">{clinics.length} registered clinics</p>
        </div>
        <button onClick={() => setShowForm(s => !s)} className="bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded-lg font-semibold text-sm transition">
          + Provision New Clinic
        </button>
      </div>

      {showForm && (
        <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
          <h2 className="font-bold text-white mb-4">One-Click Provisioning Engine</h2>
          <form onSubmit={handleProvision} className="grid grid-cols-3 gap-4">
            {[
              ['clinicName', 'Clinic Name'], ['clinicCode', 'Clinic Code (Unique)'], ['email', 'Clinic Email'],
              ['mobile', 'Mobile'], ['city', 'City'], ['adminEmail', 'Admin Email'],
              ['adminFirstName', 'Admin First Name'], ['adminLastName', 'Admin Last Name'],
            ].map(([key, label]) => (
              <div key={key}>
                <label className="text-xs font-semibold text-slate-400 block mb-1">{label}</label>
                <input
                  required
                  value={(form as any)[key]}
                  onChange={e => update(key, e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 text-white p-2 rounded text-sm"
                />
              </div>
            ))}
            <div>
              <label className="text-xs font-semibold text-slate-400 block mb-1">Subscription Plan</label>
              <select value={form.planCode} onChange={e => update('planCode', e.target.value)} className="w-full bg-slate-900 border border-slate-700 text-white p-2 rounded text-sm">
                {plans.map(p => <option key={p.plan_code} value={p.plan_code}>{p.plan_name} - ₹{p.monthly_price}/mo</option>)}
              </select>
            </div>
            <div className="col-span-3 flex gap-3 pt-2">
              <button type="submit" disabled={submitting} className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded font-semibold text-sm disabled:opacity-50">
                {submitting ? 'Provisioning...' : '🚀 Provision Clinic'}
              </button>
              <button type="button" onClick={() => setShowForm(false)} className="text-slate-400 hover:text-white text-sm px-4 py-2">Cancel</button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-slate-800/50 border border-slate-700 rounded-xl overflow-hidden">
        <table className="w-full text-sm text-left">
          <thead className="bg-slate-900 text-slate-400 text-xs uppercase">
            <tr>
              <th className="p-4">Clinic</th>
              <th className="p-4">City</th>
              <th className="p-4">Plan</th>
              <th className="p-4">Status</th>
              <th className="p-4">Created</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {clinics.map(c => (
              <tr key={c.id} className="hover:bg-slate-800/50 transition-colors">
                <td className="p-4">
                  <p className="font-semibold text-white">{c.clinic_name}</p>
                  <p className="text-xs text-slate-500">{c.clinic_code}</p>
                </td>
                <td className="p-4 text-slate-300">{c.city}</td>
                <td className="p-4">
                  <span className="bg-blue-500/20 text-blue-300 text-xs px-2 py-0.5 rounded font-semibold uppercase">{c.subscription_plan}</span>
                </td>
                <td className="p-4">
                  <span className={`text-xs px-2 py-0.5 rounded font-semibold ${c.clinic_status === 'Active' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'}`}>
                    {c.clinic_status}
                  </span>
                </td>
                <td className="p-4 text-slate-500 text-xs">{new Date(c.created_at).toLocaleDateString()}</td>
                <td className="p-4 text-right">
                  {c.clinic_status === 'Active' ? (
                    <button onClick={() => handleSuspend(c.id)} className="text-xs text-red-400 hover:text-red-300 border border-red-500/30 px-2 py-1 rounded">Suspend</button>
                  ) : (
                    <button onClick={() => handleReactivate(c.id)} className="text-xs text-emerald-400 hover:text-emerald-300 border border-emerald-500/30 px-2 py-1 rounded">Reactivate</button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
