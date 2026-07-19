import { fetchDashboardDataAction } from '@/actions/analytics/analyticsActions'
import AnalyticsDashboardClient from './AnalyticsDashboardClient'

export default async function AnalyticsPage() {
  const res = await fetchDashboardDataAction()
  
  if (!res.ok) {
    return <div className="p-8 text-red-500">Error loading dashboard: {res.error}</div>
  }

  return <AnalyticsDashboardClient type={res.type} data={res.data} />
}