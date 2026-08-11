import { createClient } from '@/lib/supabase/server'
import { getInvoice } from '@/repositories/billing/invoiceRepository'
import { getServices } from '@/repositories/billing/catalogRepository'
import InvoiceBuilderClient from './InvoiceBuilderClient'
import { redirect } from 'next/navigation'

export default async function InvoicePage({ params }: { params: { id: string } }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')
  
  const { data: userProfile } = await supabase.from('users').select('clinic_id').eq('id', user.id).single()
  const clinicId = userProfile?.clinic_id

  try {
    const { invoice, items } = await getInvoice(supabase, params.id)
    const services = await getServices(supabase, clinicId)
    
    return <InvoiceBuilderClient invoice={invoice} items={items} catalog={services} />
  } catch (err: any) {
    return <div className="p-8 text-red-500">Error: {err.message}</div>
  }
}
