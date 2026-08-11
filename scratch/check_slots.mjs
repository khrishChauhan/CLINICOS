import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://ihnjzlilbwhosfpawdvx.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imlobmp6bGlsYndob3NmcGF3ZHZ4Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4NDI5Njg1OCwiZXhwIjoyMDk5ODcyODU4fQ.6C4wxTl4ABX-XM1NxOMNRFVvRj0ELnm1FiYz0AA_IMc'
const supabase = createClient(supabaseUrl, supabaseKey)

async function check() {
  const { data: users } = await supabase.from('users').select('*')
  console.log('Total users:', users.length)
  
  const rohan = users.find(u => u.username?.toLowerCase().includes('rohan')) || users.find(u => (u.first_name + ' ' + u.last_name).toLowerCase().includes('rohan')) || users[1]
  console.log('Selected Doctor ID:', rohan.id, rohan.username, rohan.first_name, rohan.last_name)

  const { data: avail } = await supabase.from('doctor_availability').select('*').eq('doctor_id', rohan.id)
  console.log('Availability:\n', JSON.stringify(avail, null, 2))

  const { data: slots } = await supabase.from('appointment_slots').select('*').eq('doctor_id', rohan.id)
  console.log('Slots:\n', JSON.stringify(slots, null, 2))
}

check()
