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
  
  // Revert 'Paid' to 'Draft' in the INSERT statement
  let newDef = def.replace(/VALUES \(\s*p_clinic_id, p_patient_id, p_visit_id,\s*v_invoice_number, 'Paid',/g, 
    "VALUES (\n            p_clinic_id, p_patient_id, p_visit_id,\n            v_invoice_number, 'Draft',");
  
  // Then append an UPDATE statement at the end of the IF block
  // We look for the end of the IF block handling billing integration
  // The block ends with:
  // WHERE di.dispense_record_id = v_dispense_id;
  // END IF;
  
  newDef = newDef.replace(/WHERE di\.dispense_record_id = v_dispense_id;\s*END IF;/g, 
    "WHERE di.dispense_record_id = v_dispense_id;\n\n        -- Auto-finalize the invoice to Paid after items are inserted\n        UPDATE public.billing_invoices SET status = 'Paid' WHERE id = v_billing_invoice_id;\n    END IF;");
  
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
  
  try {
    await client.query(ddl);
    console.log('Successfully patched RPC to avoid trigger conflict!');
  } catch(e) {
    console.error(e);
  }
  await client.end();
}
run();