import { createClient } from '@/lib/supabase/server'
import { labOrderService } from '@/services/laboratory/labOrderService'
import LabOrderDetailClient from './LabOrderDetailClient'
import { redirect } from 'next/navigation'

export default async function LabOrderDetailPage({ params }: { params: { id: string } }) {
  const supabase = await createClient()
  const { data: session } = await supabase.rpc('get_session_context')
  if (!session) redirect('/login')

  try {
    const order = await labOrderService.getOrderDetail(supabase, params.id)
    return <LabOrderDetailClient order={order} />
  } catch (e: any) {
    return <div className="p-8 text-red-500">Error: {e.message}</div>
  }
}
