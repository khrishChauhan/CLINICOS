import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import { resolve } from 'path';

dotenv.config({ path: resolve(process.cwd(), '.env.local') });
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);

async function test() {
  const { data, error } = await supabase.auth.signInWithPassword({ email: 'doctor@durgaclinic.in', password: '123456' });
  if (error) { console.error('Login err:', error); return; }
  const { data: ctx, error: rpcErr } = await supabase.rpc('get_session_context');
  console.log('RPC ctx:', ctx);
  console.log('RPC err:', rpcErr);
}
test();