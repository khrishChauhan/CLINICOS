import React from 'react'
import { getActiveAdmissionsAction, fetchWardsMatrixAction } from '@/actions/ipd/ipdActions'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { AdmissionsClient } from './AdmissionsClient'
import dayjs from 'dayjs'

export default async function AdmissionsPage() {
  const [admRes, wardRes] = await Promise.all([
    getActiveAdmissionsAction(),
    fetchWardsMatrixAction()
  ])

  if (!admRes.ok) return <div className="p-8 text-red-500">Error: {admRes.error}</div>
  
  const admissions = admRes.data || []
  const wards = wardRes.data || []

  // Extract all available beds across all wards for the dropdown
  const availableBeds = wards.flatMap((w: any) => 
    w.beds
      ?.filter((b: any) => b.status === 'Available')
      .map((b: any) => ({ ...b, wardName: w.name })) || []
  )

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 min-h-screen pb-20">
      <div className="flex justify-between items-center bg-white p-6 rounded-xl shadow-sm border border-slate-200">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 tracking-tight">Active Admissions</h1>
          <p className="text-sm text-slate-500 mt-1">Manage IPD patients, allocate beds, and process discharges</p>
        </div>
      </div>

      <div className="space-y-4">
        {admissions.length === 0 ? (
          <Card className="p-12 text-center text-slate-500">
            No active admissions found.
          </Card>
        ) : (
          admissions.map((adm: any) => (
            <Card key={adm.id} className="p-6 flex flex-col md:flex-row justify-between items-center gap-6">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-lg font-bold text-slate-800">
                    {adm.patient?.first_name} {adm.patient?.last_name}
                  </h3>
                  <Badge variant={adm.status === 'Admitted' ? 'default' : 'info'}>
                    {adm.status}
                  </Badge>
                </div>
                <div className="text-sm text-slate-600 grid grid-cols-2 gap-x-8 gap-y-2">
                  <p><strong>Admitted:</strong> {dayjs(adm.admission_date).format('DD MMM YYYY, HH:mm')}</p>
                  <p><strong>Doctor:</strong> Dr. {adm.doctor?.first_name} {adm.doctor?.last_name}</p>
                  <p><strong>Reason:</strong> {adm.reason_for_admission || 'N/A'}</p>
                  
                  {/* Find active bed */}
                  <p>
                    <strong>Current Bed: </strong>
                    {adm.bed_allocations?.find((ba: any) => !ba.end_time) 
                      ? (() => {
                          const ba = adm.bed_allocations.find((a: any) => !a.end_time)
                          return <span className="text-emerald-700 font-semibold">{ba.bed?.ward?.name} - Bed {ba.bed?.bed_number}</span>
                        })()
                      : <span className="text-amber-600 font-medium italic">Unassigned</span>
                    }
                  </p>
                </div>
              </div>
              
              <div className="w-full md:w-auto">
                <AdmissionsClient admission={adm} availableBeds={availableBeds} />
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}
