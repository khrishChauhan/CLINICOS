import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
const supabase = createClient(supabaseUrl, supabaseKey)

async function check() {
  const { data: docs } = await supabase.from('users').select('id, first_name, last_name, clinic_id').eq('role', 'Doctor')
  console.log('Doctors:', docs)

  if (!docs || docs.length === 0) return

  const doc = docs.find(d => (d.first_name + ' ' + d.last_name).toLowerCase().includes('rohan')) || docs[0]
  console.log('Target Doctor:', doc)

  const { data: avail } = await supabase.from('doctor_availability').select('*').eq('doctor_id', doc.id)
  console.log('Availability:', avail)

  const { data: slots } = await supabase.from('appointment_slots').select('*').eq('doctor_id', doc.id)
  console.log('Slots:', slots)
}

check()
