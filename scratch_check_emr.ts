import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

const supabase = createClient(supabaseUrl, supabaseKey)

async function checkEmr() {
  const { data, error } = await supabase
    .schema('emr')
    .from('clinical_visits')
    .select('*')
    .limit(1)
    
  console.log('Data:', data)
  console.log('Error:', error)
}

checkEmr()
