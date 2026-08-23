import { createClient } from '@supabase/supabase-js'
const PROJECT_REF = 'ihnjzlilbwhosfpawdvx';

async function main() {
  const supabase = createClient('https://' + PROJECT_REF + '.supabase.co', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY, { auth: { persistSession: false } });
  
  const { data, error } = await supabase.schema('doctor').from('doctors').select('*').limit(1);
  console.log("Data:", data);
  console.log("Error:", error);
}

main().catch(console.error);
