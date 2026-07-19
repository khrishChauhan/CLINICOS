import { fetchMedicinesAction } from '@/actions/pharmacy/pharmacyActions'
import MedicineCatalogClient from './MedicineCatalogClient'

export default async function MedicineCatalogPage() {
  const res = await fetchMedicinesAction()
  if (!res.ok) return <div className="p-8 text-red-500">Error: {res.error}</div>
  
  return <MedicineCatalogClient initialData={res.data || []} />
}
