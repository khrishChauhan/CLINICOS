import { createClient } from '@supabase/supabase-js'

const PROJECT_REF = 'ihnjzlilbwhosfpawdvx';

async function main() {
  const supabase = createClient('https://' + PROJECT_REF + '.supabase.co', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY, { auth: { persistSession: false } });
  
  // Login as dr.neha.patel
  const { data: authData, error: authErr } = await supabase.auth.signInWithPassword({
    email: 'neha.patel@durgaclinic.in',
    password: 'password123'
  })
  
  if (authErr) { console.error("Login failed:", authErr); return; }
  
  // Try getConsumables
  const { data: consumables, error } = await supabase
    .from('consumables')
    .select('*, medicine:medicines(*)')
    .eq('surgery_id', '1b1f700a-b8f1-45ad-97a5-ef9ae241fdbf')
    .order('recorded_at', { ascending: false });
    
  console.log("Consumables:", JSON.stringify(consumables, null, 2));
  console.log("Error:", error);
}

main().catch(console.error);
