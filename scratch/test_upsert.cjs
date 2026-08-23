const { createClient } = require('@supabase/supabase-js');

const sb = createClient(
  'https://ihnjzlilbwhosfpawdvx.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imlobmp6bGlsYndob3NmcGF3ZHZ4Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4NDI5Njg1OCwiZXhwIjoyMDk5ODcyODU4fQ.6C4wxTl4ABX-XM1NxOMNRFVvRj0ELnm1FiYz0AA_IMc',
  { auth: { autoRefreshToken: false, persistSession: false } }
);

async function main() {
  const { data: surgeries } = await sb.from('surgeries').select('id, checklists(*)').limit(1);
  const surgery = surgeries[0];
  console.log('Surgery ID:', surgery.id);
  console.log('Current checklists:', JSON.stringify(surgery.checklists));

  const updatePayload = {
    surgery_id: surgery.id,
    identity_verified: true,
    consent_signed: true,
    site_marked: true,
    fasting_confirmed: true
  };
  
  if (surgery.checklists && surgery.checklists.length > 0) {
    updatePayload.id = surgery.checklists[0].id;
  }

  const { data: res, error } = await sb
    .from('checklists')
    .upsert(updatePayload, { onConflict: 'surgery_id' })
    .select();

  console.log('Upsert result:', res);
  console.log('Upsert error:', error?.message);
}

main().catch(console.error);
