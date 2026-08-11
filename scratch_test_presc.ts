import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const supabase = createClient(supabaseUrl, supabaseKey)

async function test() {
  const clinic_id = '9725361b-cb01-4ad0-b3fb-7bfa47688861'
  const { data, error } = await supabase
    .from('prescriptions')
    .select('*, visits(*), patients(*), prescription_items(*)')
    .eq('clinic_id', clinic_id)
    .order('created_at', { ascending: false })
    .limit(50)

  console.log("Error:", error)
  console.log("Data length:", data?.length)
  
  if (data?.length) {
    const { data: dispensed } = await supabase
      .from('dispense_records')
      .select('prescription_id')
      .eq('clinic_id', clinic_id)

    const dispensedIds = new Set((dispensed || []).map((d: any) => d.prescription_id))
    const pending = (data || []).filter((p: any) => !dispensedIds.has(p.id))
    console.log("Pending:", pending.length)
    console.log("First pending:", JSON.stringify(pending[0], null, 2))
  }
}

test()
