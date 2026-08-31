import { Client } from 'pg';
const client = new Client({ connectionString: 'postgresql://postgres.ihnjzlilbwhosfpawdvx:Click%20Aarambh%20ClinicOS@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres' });
async function run() {
  await client.connect();
  const res = await client.query(`SELECT table_schema, table_name FROM information_schema.tables WHERE table_name LIKE '%reschedule%';`);
  console.log(res.rows);
  await client.end();
}
run();