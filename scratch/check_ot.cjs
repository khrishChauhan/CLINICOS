const { createClient } = require('@supabase/supabase-js');

const sb = createClient(
  'https://ihnjzlilbwhosfpawdvx.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imlobmp6bGlsYndob3NmcGF3ZHZ4Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4NDI5Njg1OCwiZXhwIjoyMDk5ODcyODU4fQ.6C4wxTl4ABX-XM1NxOMNRFVvRj0ELnm1FiYz0AA_IMc',
  { auth: { autoRefreshToken: false, persistSession: false } }
);

async function main() {
  // 1. Check if ot schema still exists
  const { data: schemas, error: schemaErr } = await sb
    .from('information_schema.schemata')
    .select('schema_name')
    .in('schema_name', ['ot', 'radiology']);
  console.log('Schemas ot/radiology exist?', JSON.stringify(schemas), schemaErr?.message);

  // 2. Check OT tables now live in public
  const { data: tables, error: tableErr } = await sb
    .from('information_schema.tables')
    .select('table_name, table_schema')
    .in('table_name', ['rooms', 'surgeries', 'team_members', 'checklists', 'notes', 'consumables'])
    .eq('table_schema', 'public');
  console.log('OT tables in public:', JSON.stringify(tables), tableErr?.message);

  // 3. Test reading rooms directly
  const { data: rooms, error: roomErr } = await sb.from('rooms').select('*').limit(5);
  console.log('Rooms query:', JSON.stringify(rooms), roomErr?.message);

  // 4. Test reading surgeries 
  const { data: surgeries, error: surgErr } = await sb.from('surgeries').select('*').limit(5);
  console.log('Surgeries query:', JSON.stringify(surgeries), surgErr?.message);

  // 5. Check if get_session_context RPC works
  const { data: ctx, error: ctxErr } = await sb.rpc('get_session_context');
  console.log('get_session_context:', JSON.stringify(ctx), ctxErr?.message);

  // 6. Check users table works
  const { data: users, error: userErr } = await sb.from('users').select('id, email, clinic_id').limit(3);
  console.log('Users query:', JSON.stringify(users), userErr?.message);
}

main().catch(console.error);
