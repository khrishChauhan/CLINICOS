import type { SupabaseClient } from '@supabase/supabase-js'

export async function generateRevenueReport(
  supabase: SupabaseClient, 
  clinicId: string, 
  startDate: string, 
  endDate: string
) {
  const { data, error } = await supabase
    .from('payments')
    .select('id, payment_number, amount, payment_method, payment_date, status, billing_invoices(invoice_number)')
    .eq('clinic_id', clinicId)
    .gte('payment_date', startDate)
    .lte('payment_date', endDate)
    .order('payment_date', { ascending: false })
    
  if (error) throw new Error(`Failed to generate revenue report: ${error.message}`)
  
  return data.map(p => {
    const inv = Array.isArray(p.billing_invoices) ? p.billing_invoices[0] : (p.billing_invoices as any)
    return {
      PaymentID: p.payment_number,
      Date: p.payment_date,
      Amount: p.amount,
      Method: p.payment_method,
      Status: p.status,
      Invoice: inv?.invoice_number || 'N/A'
    }
  })
}

export async function generateAppointmentsReport(
  supabase: SupabaseClient, 
  clinicId: string, 
  startDate: string, 
  endDate: string
) {
  const { data, error } = await supabase
    .from('appointments')
    .select('id, appointment_number, appointment_date, start_time, status, patients(first_name, last_name), users(first_name, last_name)')
    .eq('clinic_id', clinicId)
    .gte('appointment_date', startDate)
    .lte('appointment_date', endDate)
    .order('appointment_date', { ascending: false })
    
  if (error) throw new Error(`Failed to generate appointment report: ${error.message}`)
  
  return data.map(a => {
    const pat = Array.isArray(a.patients) ? a.patients[0] : (a.patients as any)
    const doc = Array.isArray(a.users) ? a.users[0] : (a.users as any)
    return {
      AppointmentID: a.appointment_number,
      Date: a.appointment_date,
      Time: a.start_time,
      Status: a.status,
      Patient: pat ? `${pat.first_name} ${pat.last_name}` : 'N/A',
      Doctor: doc ? `${doc.first_name} ${doc.last_name}` : 'N/A'
    }
  })
}
