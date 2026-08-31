import { Client } from 'pg';
const client = new Client({ connectionString: 'postgresql://postgres.ihnjzlilbwhosfpawdvx:Click%20Aarambh%20ClinicOS@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres' });
async function run() {
  await client.connect();
  const res = await client.query(`UPDATE public.users SET status = 'active' WHERE status = 'Active';`);
  console.log('Updated rows:', res.rowCount);
  await client.end();
}
run();