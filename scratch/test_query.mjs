const PROJECT_REF = 'ihnjzlilbwhosfpawdvx';
import { createClient } from '@supabase/supabase-js'

const supabase = createClient('https://ihnjzlilbwhosfpawdvx.supabase.co', process.env.SUPABASE_ACCESS_TOKEN, {
  auth: { persistSession: false }
})

async function test() {
  const { data, error } = await supabase
    .from('medicines')
    .select('*, stock:medicine_stock(current_quantity, batch:medicine_batches(expiry_date, status))')
    .limit(5)
  console.log(JSON.stringify(data, null, 2))
}
test().catch(console.error)
