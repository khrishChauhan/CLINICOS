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
  const { createClient } = require('@supabase/supabase-js');
  const supabase = createClient('https://' + PROJECT_REF + '.supabase.co', t, { auth: { persistSession: false } });
  
  const res = await supabase.from('consumables').select('*, medicine:medicines(*)').limit(5);
  console.log(JSON.stringify(res, null, 2));
}
main().catch(console.error);
