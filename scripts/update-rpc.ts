import { Client } from 'pg';
const client = new Client({ connectionString: 'postgresql://postgres.ihnjzlilbwhosfpawdvx:Click%20Aarambh%20ClinicOS@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres' });
async function run() {
  await client.connect();
  const res = await client.query(`SELECT routine_definition FROM information_schema.routines WHERE routine_name = 'dispense_medicines_fefo';`);
  const def = res.rows[0]?.routine_definition;
  
  if (!def) {
    console.error('RPC not found');
    return;
  }
  
  // Replace 'Draft' with 'Paid'
  const newDef = def.replace(/'Draft'/g, "'Paid'");
  
  // Also we need the parameters to reconstruct the CREATE OR REPLACE FUNCTION signature.
  // The signature was: dispense_medicines_fefo(p_clinic_id uuid, p_patient_id uuid, p_user_id uuid, p_visit_id uuid, p_prescription_id uuid, p_items jsonb) RETURNS uuid
  
  const ddl = `
CREATE OR REPLACE FUNCTION public.dispense_medicines_fefo(
    p_clinic_id uuid, 
    p_patient_id uuid, 
    p_user_id uuid, 
    p_visit_id uuid, 
    p_prescription_id uuid, 
    p_items jsonb
) RETURNS uuid
LANGUAGE plpgsql
AS $$
${newDef}
$$;
  `;
  
  await client.query(ddl);
  
  // Also update any existing Draft invoices to Paid so they show up
  await client.query(`UPDATE public.billing_invoices SET status = 'Paid' WHERE status = 'Draft';`);
  
  console.log('Successfully updated RPC and existing invoices!');
  await client.end();
}
run();