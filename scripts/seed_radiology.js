import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY // Need service role to bypass RLS or just use Anon with RLS policies bypassing if test

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)

async function seed() {
  console.log('Seeding Radiology Orders...')
  
  // 1. Get Clinic ID (Durga Clinic)
  const { data: clinics } = await supabase.from('clinics').select('id, name').ilike('name', '%Durga%')
  const clinicId = clinics?.[0]?.id
  if (!clinicId) throw new Error('Durga Clinic not found')

  // 2. Get random patients
  const { data: patients } = await supabase.from('patients').select('id').eq('clinic_id', clinicId).limit(20)
  // 3. Get random doctors
  const { data: doctors } = await supabase.from('doctors').select('id').eq('clinic_id', clinicId).limit(5)
  // 4. Get random active visits
  const { data: visits } = await supabase.from('visits').select('id').eq('clinic_id', clinicId).limit(20)
  // 5. Get master radiology tests
  const { data: tests } = await supabase.from('radiology_tests').select('id, test_name')

  if (!patients?.length || !doctors?.length || !visits?.length || !tests?.length) {
    throw new Error('Required master data not found to seed radiology orders')
  }

  // 6. Generate 50 orders
  const priorities = ['Routine', 'Urgent', 'Stat']
  const indications = ['Pain in abdomen', 'Persistent cough', 'Headache', 'Trauma', 'Routine checkup']

  for (let i = 0; i < 50; i++) {
    const patient = patients[Math.floor(Math.random() * patients.length)]
    const doctor = doctors[Math.floor(Math.random() * doctors.length)]
    const visit = visits[Math.floor(Math.random() * visits.length)]
    const priority = priorities[Math.floor(Math.random() * priorities.length)]
    
    // Pick 1 to 3 random tests
    const items = []
    const numTests = Math.floor(Math.random() * 3) + 1
    for (let j = 0; j < numTests; j++) {
      const test = tests[Math.floor(Math.random() * tests.length)]
      items.push({
        imaging_test_id: test.id,
        imaging_name: test.test_name,
        body_part: test.test_name.includes('CT') ? 'Head' : 'Chest',
        contrast_required: Math.random() > 0.7,
        remarks: 'Seeded test item'
      })
    }

    try {
      // Create via RPC
      const { data, error } = await supabase.rpc('create_clinical_and_radiology_order', {
        p_clinic_id: clinicId,
        p_patient_id: patient.id,
        p_visit_id: visit.id,
        p_doctor_id: doctor.id,
        p_appointment_id: null,
        p_priority: priority,
        p_clinical_indication: indications[Math.floor(Math.random() * indications.length)],
        p_items: items,
        p_created_by: doctor.id
      })
      if (error) console.error('Error creating order:', error.message)
      else console.log('Created order:', data.radiology_order_id)
    } catch (e) {
      console.error(e)
    }
  }
  console.log('Seeding completed!')
}

seed().catch(console.error)
