const { createClient } = require('@supabase/supabase-js');

const sb = createClient(
  'https://ihnjzlilbwhosfpawdvx.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imlobmp6bGlsYndob3NmcGF3ZHZ4Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4NDI5Njg1OCwiZXhwIjoyMDk5ODcyODU4fQ.6C4wxTl4ABX-XM1NxOMNRFVvRj0ELnm1FiYz0AA_IMc',
  { auth: { autoRefreshToken: false, persistSession: false } }
);

async function main() {
  console.log('=== Testing API connectivity ===');
  
  // Test basic query
  const { data: users, error: userErr } = await sb.from('users').select('id, email, clinic_id').limit(3);
  console.log('Users query:', users ? `${users.length} users found` : 'FAILED', userErr?.message || '');

  // Test rooms
  const { data: rooms, error: roomErr } = await sb.from('rooms').select('*');
  console.log('Rooms query:', rooms ? `${rooms.length} rooms found` : 'FAILED', roomErr?.message || '');

  // Test surgeries
  const { data: surgeries, error: surgErr } = await sb.from('surgeries').select('*');
  console.log('Surgeries query:', surgeries ? `${surgeries.length} surgeries found` : 'FAILED', surgErr?.message || '');

  // Seed OT rooms if empty
  if (rooms && rooms.length === 0) {
    console.log('\n=== Seeding OT Rooms ===');
    const clinicId = users[0]?.clinic_id;
    if (clinicId) {
      const { data: newRooms, error: seedErr } = await sb.from('rooms').insert([
        { name: 'OT-1 (Major)', type: 'Major', status: 'Available', clinic_id: clinicId },
        { name: 'OT-2 (Minor)', type: 'Minor', status: 'Available', clinic_id: clinicId },
        { name: 'OT-3 (Emergency)', type: 'Emergency', status: 'Available', clinic_id: clinicId },
      ]).select();
      console.log('Seeded rooms:', newRooms?.length, seedErr?.message || '');
    }
  }

  // Test lab tables
  const { data: labOrders, error: labErr } = await sb.from('lab_orders').select('id').limit(3);
  console.log('Lab orders query:', labOrders ? `${labOrders.length} orders found` : 'FAILED', labErr?.message || '');

  console.log('\n=== All API tests complete ===');
}

main().catch(console.error);
