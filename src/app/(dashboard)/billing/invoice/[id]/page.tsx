import { createClient } from '@/lib/supabase/server'
import { getInvoice } from '@/repositories/billing/invoiceRepository'
import { getServices } from '@/repositories/billing/catalogRepository'
import InvoiceBuilderClient from './InvoiceBuilderClient'
import { redirect } from 'next/navigation'

export default async function InvoicePage({ params }: { params: { id: string } }) {
  const supabase = await createClient()
  const { data: session } = await supabase.rpc('get_session_context')
  if (!session) redirect('/login')

  try {
    const { invoice, items } = await getInvoice(supabase, params.id)
    const services = await getServices(supabase, session.clinic_id)
    
    return <InvoiceBuilderClient invoice={invoice} items={items} catalog={services} />
  } catch (err: any) {
    return <div className="p-8 text-red-500">Error: {err.message}</div>
  }
}
