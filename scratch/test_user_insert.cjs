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
  console.log(await runSQL(t, "INSERT INTO users (clinic_id, role_id, username, email, status) VALUES ('9725361b-cb01-4ad0-b3fb-7bfa47688861', '154d2dcd-0ec7-4e54-9c2a-fed3e28fd257', 'dr.test.doctor', 'test.doc@test.com', 'Active') RETURNING id;"));
}
main().catch(console.error);
