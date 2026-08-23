const PROJECT_REF = 'ihnjzlilbwhosfpawdvx';

async function runSQL(accessToken, sql) {
  const resp = await fetch(`https://api.supabase.com/v1/projects/${PROJECT_REF}/database/query`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ query: sql }),
  });
  const data = await resp.json();
  return data;
}

async function main() {
  const t = process.env.SUPABASE_ACCESS_TOKEN;

  // 1. Check users table columns for first_name/last_name
  console.log('=== Users columns ===');
  const cols = await runSQL(t, "SELECT column_name FROM information_schema.columns WHERE table_name = 'users' AND table_schema = 'public' ORDER BY ordinal_position;");
  console.log(cols.map(c => c.column_name).join(', '));

  // 2. Check surgeries table columns
  console.log('\n=== Surgeries columns ===');
  const scols = await runSQL(t, "SELECT column_name FROM information_schema.columns WHERE table_name = 'surgeries' AND table_schema = 'public' ORDER BY ordinal_position;");
  console.log(scols.map(c => c.column_name).join(', '));

  // 3. Check rooms columns
  console.log('\n=== Rooms columns ===');
  const rcols = await runSQL(t, "SELECT column_name FROM information_schema.columns WHERE table_name = 'rooms' AND table_schema = 'public' ORDER BY ordinal_position;");
  console.log(rcols.map(c => c.column_name).join(', '));

  // 4. Check checklists columns
  console.log('\n=== Checklists columns ===');
  const ccols = await runSQL(t, "SELECT column_name FROM information_schema.columns WHERE table_name = 'checklists' AND table_schema = 'public' ORDER BY ordinal_position;");
  console.log(ccols.map(c => c.column_name).join(', '));

  // 5. Check foreign keys on surgeries
  console.log('\n=== Surgeries foreign keys ===');
  const fks = await runSQL(t, `
    SELECT tc.constraint_name, kcu.column_name, ccu.table_name AS foreign_table, ccu.column_name AS foreign_column
    FROM information_schema.table_constraints tc
    JOIN information_schema.key_column_usage kcu ON tc.constraint_name = kcu.constraint_name
    JOIN information_schema.constraint_column_usage ccu ON tc.constraint_name = ccu.constraint_name
    WHERE tc.table_name = 'surgeries' AND tc.constraint_type = 'FOREIGN KEY';
  `);
  console.log(JSON.stringify(fks, null, 2));

  // 6. Check rooms data
  console.log('\n=== Rooms data ===');
  const rooms = await runSQL(t, "SELECT * FROM public.rooms;");
  console.log(JSON.stringify(rooms, null, 2));

  // 7. Check patients exist
  console.log('\n=== Patients count ===');
  const patients = await runSQL(t, "SELECT count(*) as cnt FROM public.patients;");
  console.log(JSON.stringify(patients));

  // 8. Check doctors exist
  console.log('\n=== Doctors/Users ===');
  const doctors = await runSQL(t, "SELECT id, username, email, role_id FROM public.users LIMIT 5;");
  console.log(JSON.stringify(doctors, null, 2));

  // 9. Test REST API is working
  console.log('\n=== REST API test ===');
  const { createClient } = require('@supabase/supabase-js');
  const sb = createClient(
    'https://ihnjzlilbwhosfpawdvx.supabase.co',
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imlobmp6bGlsYndob3NmcGF3ZHZ4Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4NDI5Njg1OCwiZXhwIjoyMDk5ODcyODU4fQ.6C4wxTl4ABX-XM1NxOMNRFVvRj0ELnm1FiYz0AA_IMc',
    { auth: { autoRefreshToken: false, persistSession: false } }
  );
  const { data: rRooms, error: rErr } = await sb.from('rooms').select('*');
  console.log('REST rooms:', rRooms?.length, 'rooms', rErr?.message || 'OK');
  
  const { data: rUsers, error: uErr } = await sb.from('users').select('id, email, clinic_id').limit(2);
  console.log('REST users:', rUsers?.length, 'users', uErr?.message || 'OK');

  // 10. Check lab_orders table
  console.log('\n=== Lab orders columns ===');
  const lcols = await runSQL(t, "SELECT column_name FROM information_schema.columns WHERE table_name = 'lab_orders' AND table_schema = 'public' ORDER BY ordinal_position;");
  console.log(lcols.map(c => c.column_name).join(', '));
}

main().catch(console.error);
