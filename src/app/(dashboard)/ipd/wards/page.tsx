import React from 'react'
import { fetchWardsMatrixAction } from '@/actions/ipd/ipdActions'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import Link from 'next/link'

export default async function BedMatrixPage() {
  const res = await fetchWardsMatrixAction()
  if (!res.ok) return <div className="p-8 text-red-500">Error: {res.error}</div>

  const wards = res.data || []

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Available': return 'bg-emerald-100 text-emerald-800 border-emerald-200'
      case 'Occupied': return 'bg-rose-100 text-rose-800 border-rose-200'
      case 'Cleaning': return 'bg-amber-100 text-amber-800 border-amber-200'
      case 'Maintenance': return 'bg-slate-200 text-slate-800 border-slate-300'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 min-h-screen pb-20">
      <div className="flex justify-between items-center bg-white p-6 rounded-xl shadow-sm border border-slate-200">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 tracking-tight">Bed Matrix</h1>
          <p className="text-sm text-slate-500 mt-1">Real-time status of all inpatient wards and beds</p>
        </div>
        <div className="flex gap-3">
          <Link href="/ipd/admissions" className="bg-blue-600 text-white px-5 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors shadow-sm">
            Active Admissions
          </Link>
        </div>
      </div>

      {wards.length === 0 ? (
        <Card className="p-12 text-center text-slate-500">
          <p className="text-lg">No wards found in this clinic.</p>
          <p className="text-sm mt-2">Please ask an administrator to configure wards and beds.</p>
        </Card>
      ) : (
        <div className="space-y-8">
          {wards.map((ward: any) => (
            <Card key={ward.id} className="p-6">
              <div className="flex justify-between items-center mb-6 pb-4 border-b border-slate-100">
                <div>
                  <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                    {ward.name}
                    <Badge variant="info" className="text-xs bg-slate-50">{ward.type}</Badge>
                  </h2>
                  <p className="text-sm text-slate-500">Floor: {ward.floor || 'N/A'} • Capacity: {ward.capacity}</p>
                </div>
                <div className="flex gap-4 text-sm font-medium">
                  <div className="flex items-center gap-1.5 text-emerald-600">
                    <div className="w-3 h-3 rounded-full bg-emerald-500"></div> 
                    {ward.beds?.filter((b: any) => b.status === 'Available').length} Available
                  </div>
                  <div className="flex items-center gap-1.5 text-rose-600">
                    <div className="w-3 h-3 rounded-full bg-rose-500"></div> 
                    {ward.beds?.filter((b: any) => b.status === 'Occupied').length} Occupied
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4">
                {ward.beds?.map((bed: any) => (
                  <div 
                    key={bed.id} 
                    className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all shadow-sm ${getStatusColor(bed.status)}`}
                  >
                    <span className="text-lg font-bold block mb-1">{bed.bed_number}</span>
                    <span className="text-xs font-semibold uppercase tracking-wider">{bed.status}</span>
                  </div>
                ))}
                {(!ward.beds || ward.beds.length === 0) && (
                  <div className="col-span-full text-slate-400 text-sm py-4">No beds configured for this ward.</div>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
