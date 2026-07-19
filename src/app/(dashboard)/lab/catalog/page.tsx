import { fetchLabTestsAction } from '@/actions/laboratory/laboratoryActions'
import LabCatalogClient from './LabCatalogClient'

export default async function LabCatalogPage() {
  const res = await fetchLabTestsAction()
  if (!res.ok) return <div className="p-8 text-red-500">Error: {res.error}</div>
  return <LabCatalogClient initialTests={res.data || []} />
}
