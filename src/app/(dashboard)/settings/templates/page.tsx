import { fetchTemplatesAction } from '@/actions/notifications/notificationActions'
import TemplateManagerClient from './TemplateManagerClient'

export default async function TemplatesPage() {
  const res = await fetchTemplatesAction()
  if (!res.ok) return <div className="p-8 text-red-500">Error: {res.error}</div>
  
  return <TemplateManagerClient initialTemplates={res.data || []} />
}
