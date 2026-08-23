const PROJECT_REF = 'ihnjzlilbwhosfpawdvx';
async function runSQL(t, sql) {
  const r = await fetch(`https://api.supabase.com/v1/projects/${PROJECT_REF}/database/query`, {
    method: 'POST', headers: { 'Authorization': `Bearer ${t}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ query: sql }),
  });
  return r.json();
}
async function main() {
  const t = process.env.SUPABASE_ACCESS_TOKEN;
  const cols = await runSQL(t, "SELECT column_name FROM information_schema.columns WHERE table_name = 'patients' AND table_schema = 'public' ORDER BY ordinal_position;");
  console.log('Patients columns:', cols.map(c => c.column_name).join(', '));

  // Check notes columns  
  const ncols = await runSQL(t, "SELECT column_name FROM information_schema.columns WHERE table_name = 'notes' AND table_schema = 'public' ORDER BY ordinal_position;");
  console.log('Notes columns:', ncols.map(c => c.column_name).join(', '));

  // Check team_members columns  
  const tcols = await runSQL(t, "SELECT column_name FROM information_schema.columns WHERE table_name = 'team_members' AND table_schema = 'public' ORDER BY ordinal_position;");
  console.log('Team_members columns:', tcols.map(c => c.column_name).join(', '));

  // Check consumables columns  
  const ccols = await runSQL(t, "SELECT column_name FROM information_schema.columns WHERE table_name = 'consumables' AND table_schema = 'public' ORDER BY ordinal_position;");
  console.log('Consumables columns:', ccols.map(c => c.column_name).join(', '));
}
main().catch(console.error);
