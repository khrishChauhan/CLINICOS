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
  
  // Use the anon key to test PostgREST
  const r = await fetch('https://ihnjzlilbwhosfpawdvx.supabase.co/rest/v1/consumables?select=*,medicine:medicines(*)&limit=5', {
    headers: { 'apikey': process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY, 'Authorization': 'Bearer ' + process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY }
  });
  console.log(r.status, await r.text());
}
main().catch(console.error);
