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
  console.log(await runSQL(t, "ALTER TABLE surgeries DROP CONSTRAINT IF EXISTS exclude_overlapping_room_booking; ALTER TABLE surgeries ADD CONSTRAINT exclude_overlapping_room_booking EXCLUDE USING gist (room_id WITH =, tstzrange(scheduled_start_time, scheduled_end_time) WITH &&) WHERE (status NOT IN ('Cancelled', 'Completed'));"));
}
main().catch(console.error);
