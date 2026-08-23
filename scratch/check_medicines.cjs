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
  console.log(await runSQL(t, "SELECT id, brand_name, unit_price FROM medicines WHERE id IN ('89e1843b-4cd2-4d9c-8be3-cff4519d32f4', 'efc073b9-9e31-4df0-bc36-9d487aa9ee91');"));
}
main().catch(console.error);
