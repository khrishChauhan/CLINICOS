import { Client } from 'pg';
const client = new Client({ connectionString: 'postgresql://postgres.ihnjzlilbwhosfpawdvx:Click%20Aarambh%20ClinicOS@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres' });
async function run() {
  await client.connect();
  const res = await client.query(`SELECT routine_definition FROM information_schema.routines WHERE routine_name = 'dispense_medicines_fefo';`);
  console.log(res.rows[0]?.routine_definition);
  await client.end();
}
run();