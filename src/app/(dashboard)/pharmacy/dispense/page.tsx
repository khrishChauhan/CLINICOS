import { fetchMedicinesAction, fetchPendingPrescriptionsAction } from '@/actions/pharmacy/pharmacyActions'
import { listPatients } from '@/actions/patients/listPatients'
import DispenseClient from './DispenseClient'

export default async function DispensePage() {
  const [medsRes, patientsRes, presRes] = await Promise.all([
    fetchMedicinesAction(),
    listPatients(),
    fetchPendingPrescriptionsAction()
  ])

  const medicines = medsRes.ok ? medsRes.data : []
  const patients = patientsRes.ok && patientsRes.result ? patientsRes.result.data : []
  const pendingPrescriptions = presRes.ok ? presRes.data : []

  return (
    <main className="p-8 max-w-7xl mx-auto space-y-6 bg-slate-50 min-h-screen">
      <div>
        <h1 className="text-3xl font-bold text-slate-800 tracking-tight">Pharmacy POS & Dispensing</h1>
        <p className="text-sm text-slate-500 mt-1">Walk-In OTC Sales and Prescription Fulfillment</p>
      </div>
      <DispenseClient medicines={medicines || []} patients={patients || []} pendingPrescriptions={pendingPrescriptions || []} />
    </main>
  )
}
