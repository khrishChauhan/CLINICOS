import { createAdminClient } from './src/lib/supabase/server';
async function run() {
  const adminClient = createAdminClient();
  const { data: users, error: usersErr } = await adminClient.from('users').select('*');
  console.log('Users:', users);
  const { data: clinics, error: clinicsErr } = await adminClient.from('clinics').select('*');
  console.log('Clinics:', clinics);
  
  if (users && clinics && clinics.length > 0) {
    for (const u of users) {
      if (!u.clinic_id) {
         console.log('Updating user clinic_id for', u.id);
         await adminClient.from('users').update({ clinic_id: clinics[0].id }).eq('id', u.id);
      }
    }
  }
}
run();
