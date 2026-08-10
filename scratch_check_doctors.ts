import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY // Use service role for bypass

const supabase = createClient(supabaseUrl, supabaseKey)

async function fixDoctor() {
  const { data, error } = await supabase
    .schema('doctor')
    .from('doctors')
    .update({ user_id: 'a1000000-0000-0000-0000-000000000003' })
    .eq('first_name', 'deepak ')
    .select()
    
  console.log('Updated doctor:', data)
  console.log('Error:', error)
}

fixDoctor()
