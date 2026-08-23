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
  console.log(await runSQL(t, "SELECT pg_get_constraintdef(c.oid) AS constraint_def FROM pg_constraint c WHERE c.conname = 'exclude_overlapping_room_booking';"));
}
main().catch(console.error);
