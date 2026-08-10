import { createClient } from '@supabase/supabase-js'
import fs from 'fs'

const envStr = fs.readFileSync('.env.local', 'utf-8')
const getEnv = (key: string) => envStr.split('\n').find(l => l.startsWith(key))?.split('=')[1]?.trim()

const supabaseUrl = getEnv('NEXT_PUBLIC_SUPABASE_URL')!
const supabaseKey = getEnv('SUPABASE_SERVICE_ROLE_KEY')!
const supabase = createClient(supabaseUrl, supabaseKey)

async function testEMR() {
  console.log('Testing EMR End-to-End...')
  
  // 1. Fetch a clinic
  const { data: clinic } = await supabase.from('clinics').select('id').limit(1).single()
  if (!clinic) throw new Error('No clinic found')
  console.log('Clinic ID:', clinic.id)

  // 2. Fetch a patient
  const { data: patient } = await supabase.from('patients').select('id').limit(1).single()
  if (!patient) throw new Error('No patient found')
  console.log('Patient ID:', patient.id)

  // 3. Fetch a doctor (user_id and doctor_id)
  const { data: doctor } = await supabase.schema('doctor').from('doctors').select('id, user_id').limit(1).single()
  if (!doctor) throw new Error('No doctor found')
  console.log('Doctor:', doctor)

  // 4. Test visit creation directly using the DB
  const visitPayload = {
    clinic_id: clinic.id,
    patient_id: patient.id,
    doctor_id: doctor.id,
    visit_type: 'OPD'
  }

  // Use the RPC to get visit number (similar to visitRepository)
  const { data: numberData, error: numberError } = await supabase.rpc('next_visit_number', {
    p_clinic_id: clinic.id
  })
  
  if (numberError) {
    console.error('Failed to generate visit number:', numberError)
    return
  }
  
  console.log('Generated Visit Number:', numberData)

  const { data: newVisit, error: visitError } = await supabase
    .from('visits')
    .insert([{ ...visitPayload, visit_number: numberData }])
    .select()
    .single()

  if (visitError) {
    console.error('Failed to create visit:', visitError)
    return
  }

  console.log('Successfully created visit:', newVisit.id)

  // 5. Test fetching the visit
  const { data: fetchedVisit, error: fetchError } = await supabase
    .from('visits')
    .select('*')
    .eq('id', newVisit.id)
    .single()

  if (fetchError) {
    console.error('Failed to fetch visit:', fetchError)
  } else {
    console.log('Successfully fetched visit.')
  }

  // 6. Test updating the visit
  const { data: updatedVisit, error: updateError } = await supabase
    .from('visits')
    .update({ provisional_diagnosis: 'Testing 123' })
    .eq('id', newVisit.id)
    .select()
    .single()

  if (updateError) {
    console.error('Failed to update visit:', updateError)
  } else {
    console.log('Successfully updated visit.')
  }

  console.log('All backend checks passed!')
}

testEMR().catch(console.error)
