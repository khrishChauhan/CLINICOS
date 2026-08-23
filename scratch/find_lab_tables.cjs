const PROJECT_REF = 'ihnjzlilbwhosfpawdvx';
async function runSQL(t, sql) {
  const r = await fetch('https://api.supabase.com/v1/projects/' + PROJECT_REF + '/database/query', {
    method: 'POST', headers: { 'Authorization': 'Bearer ' + t, 'Content-Type': 'application/json' },
    body: JSON.stringify({ query: sql }),
  });
  return r.json();
}
async function main() {
  const t = process.env.SUPABASE_ACCESS_TOKEN;
  const res = await runSQL(t, "SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' AND (table_name LIKE '%test%' OR table_name LIKE '%lab%');");
  console.log(res);
}
main().catch(console.error);
