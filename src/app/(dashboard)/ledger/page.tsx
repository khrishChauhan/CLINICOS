import React from 'react';
import { createClient, createAdminClient } from '@/lib/supabase/server';
import LedgerClient from './LedgerClient';

export default async function Ledger() {
  const supabase = await createClient();
  const adminClient = createAdminClient();

  const { data: { user } } = await supabase.auth.getUser();
  const { data: userProfile } = await adminClient.from('users').select('clinic_id').eq('id', user?.id).single();
  const clinicId = userProfile?.clinic_id;

  const today = new Date().toISOString().split('T')[0];
  const { data: payments } = await supabase
    .from('billing_payments')
    .select('amount, payment_method')
    .eq('clinic_id', clinicId)
    .gte('payment_date', today)
    .eq('status', 'Success');

  let grossCollection = 0, cashCollection = 0, cardCollection = 0, upiCollection = 0;
  payments?.forEach((p: any) => {
    const amt = Number(p.amount);
    grossCollection += amt;
    if (p.payment_method === 'Cash') cashCollection += amt;
    else if (p.payment_method === 'Card') cardCollection += amt;
    else if (p.payment_method === 'UPI') upiCollection += amt;
  });

  const { data: invoicesData } = await supabase
    .from('billing_invoices')
    .select('id, invoice_number, created_at, grand_total, status, patients ( first_name, last_name ), users ( username )')
    .eq('clinic_id', clinicId)
    .neq('status', 'Draft')
    .order('created_at', { ascending: false })
    .limit(100);

  return (
    <LedgerClient
      invoices={(invoicesData || []) as any}
      grossCollection={grossCollection}
      cashCollection={cashCollection}
      cardCollection={cardCollection}
      upiCollection={upiCollection}
    />
  );
}
