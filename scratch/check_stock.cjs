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
  console.log(await runSQL(t, "SELECT * FROM medicine_batches WHERE medicine_id = 'ad2003f6-a787-49f2-b73f-ba0d7b374448';"));
  console.log(await runSQL(t, "SELECT * FROM medicine_stock s JOIN medicine_batches b ON s.batch_id = b.id WHERE b.medicine_id = 'ad2003f6-a787-49f2-b73f-ba0d7b374448';"));
}
main().catch(console.error);
