import { fetchTenantsAction } from '@/actions/platform/platformActions'
import TenantsClient from './TenantsClient'

export default async function TenantsPage() {
  const res = await fetchTenantsAction()
  if (!res.ok) return <div className="p-8 text-red-400">Error: {res.error}</div>

  return <TenantsClient clinics={res.clinics || []} plans={res.plans || []} />
}
