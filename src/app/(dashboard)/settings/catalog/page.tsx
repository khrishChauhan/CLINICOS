import { fetchServicesAction } from '@/actions/billing/catalogActions'
import CatalogClient from './CatalogClient'

export default async function CatalogPage() {
  const res = await fetchServicesAction()
  
  if (!res.ok) {
    return <div className="p-8 text-red-500">Error: {res.error}</div>
  }

  return <CatalogClient initialServices={res.data || []} />
}
