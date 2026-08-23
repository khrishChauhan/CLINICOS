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
  // Get a patient, room, doctor
  const p = await runSQL(t, "SELECT id, clinic_id FROM public.patients LIMIT 1;");
  const r = await runSQL(t, "SELECT id FROM public.rooms LIMIT 1;");
  const d = await runSQL(t, "SELECT id FROM public.users WHERE role_id IN (SELECT id FROM roles WHERE role_name = 'Doctor') LIMIT 1;");
  
  if(p.length && r.length && d.length) {
    console.log('Got dependencies, seeding surgery...');
    const q = `INSERT INTO public.surgeries (clinic_id, patient_id, room_id, lead_surgeon_id, procedure_name, diagnosis, status, scheduled_start_time, scheduled_end_time, created_by) VALUES ('${p[0].clinic_id}', '${p[0].id}', '${r[0].id}', '${d[0].id}', 'Appendectomy', 'Acute Appendicitis', 'Scheduled', NOW(), NOW() + interval '2 hours', '${d[0].id}') RETURNING id;`;
    
    const res = await runSQL(t, q);
    console.log('Surgery seeded:', JSON.stringify(res));
    if(res && res.length) {
      await runSQL(t, `INSERT INTO public.checklists (surgery_id) VALUES ('${res[0].id}');`);
      console.log('Checklist seeded');
    }
  } else {
    console.log('Missing dependencies:', {p, r, d});
  }
}
main().catch(console.error);
