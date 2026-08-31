import { Client } from 'pg';
const client = new Client({ connectionString: 'postgresql://postgres.ihnjzlilbwhosfpawdvx:Click%20Aarambh%20ClinicOS@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres' });
async function run() {
  await client.connect();
  const res = await client.query(`SELECT DISTINCT status FROM public.billing_invoices;`);
  console.log('Statuses in DB:', res.rows);
  
  // also get the table definition
  const table = await client.query(`SELECT column_name, data_type, column_default FROM information_schema.columns WHERE table_name = 'billing_invoices' AND column_name = 'status';`);
  console.log('Status column info:', table.rows);
  await client.end();
}
run();