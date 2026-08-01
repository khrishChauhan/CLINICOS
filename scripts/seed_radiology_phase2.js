import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY // Need service role to bypass RLS or just use Anon with RLS policies bypassing if test

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)

async function seed() {
  console.log('Seeding Radiology Phase 2 (Equipment, Technicians, QC)...')
  
  // 1. Get Clinic ID (Durga Clinic)
  const { data: clinics } = await supabase.from('clinics').select('id, name').ilike('name', '%Durga%')
  const clinicId = clinics?.[0]?.id
  if (!clinicId) throw new Error('Durga Clinic not found')

  // 2. Get Employees for Technicians
  const { data: employees } = await supabase.from('users').select('id').eq('clinic_id', clinicId).limit(15)
  if (!employees || employees.length < 5) throw new Error('Not enough employees to create technicians')

  // --- SEED EQUIPMENT ---
  console.log('Seeding 15 Equipment...')
  const equipmentPayloads = [
    ...Array(5).fill(0).map((_, i) => ({ equipment_code: `MRI-00${i+1}`, equipment_name: `Siemens MAGNETOM ${i+1}`, modality: 'MRI', status: 'Active' })),
    ...Array(4).fill(0).map((_, i) => ({ equipment_code: `CT-00${i+1}`, equipment_name: `GE Revolution CT ${i+1}`, modality: 'CT', status: 'Active' })),
    ...Array(8).fill(0).map((_, i) => ({ equipment_code: `XR-00${i+1}`, equipment_name: `Philips DigitalDiagnost ${i+1}`, modality: 'X-Ray', status: i === 7 ? 'Maintenance' : 'Active' })),
    ...Array(6).fill(0).map((_, i) => ({ equipment_code: `US-00${i+1}`, equipment_name: `Canon Aplio i800 ${i+1}`, modality: 'Ultrasound', status: 'Active' })),
    ...Array(3).fill(0).map((_, i) => ({ equipment_code: `MAM-00${i+1}`, equipment_name: `Hologic 3D Mammography ${i+1}`, modality: 'Mammography', status: 'Active' })),
  ]

  const createdEquipment = []
  for (const payload of equipmentPayloads.slice(0, 15)) { // Keep to 15 as requested
    const { data, error } = await supabase.from('radiology_equipment').insert([{
      ...payload,
      clinic_id: clinicId,
      manufacturer: payload.equipment_name.split(' ')[0],
      serial_number: `SN-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
      installation_date: new Date(Date.now() - Math.random() * 100000000000).toISOString().split('T')[0],
      calibration_due: new Date(Date.now() + Math.random() * 10000000000).toISOString().split('T')[0],
      maintenance_due: new Date(Date.now() + (payload.status === 'Maintenance' ? -10000000 : Math.random() * 10000000000)).toISOString().split('T')[0],
    }]).select().single()
    
    if (error) {
      if (error.code !== '23505') console.error('Equip Error:', error)
    } else {
      createdEquipment.push(data)
    }
  }

  // --- SEED TECHNICIANS ---
  console.log('Seeding 15 Technicians...')
  const createdTechnicians = []
  for (let i = 0; i < Math.min(15, employees.length); i++) {
    const { data, error } = await supabase.from('radiology_technicians').insert([{
      clinic_id: clinicId,
      employee_id: employees[i].id,
      qualification: 'B.Sc. Radiology',
      registration_number: `REG-${Math.floor(Math.random() * 90000) + 10000}`,
      specialization: i % 2 === 0 ? 'MRI & CT' : 'General X-Ray',
      shift: i % 3 === 0 ? 'Night' : 'Morning',
      status: 'Active'
    }]).select().single()

    if (error) {
      if (error.code !== '23505') console.error('Tech Error:', error)
    } else {
      createdTechnicians.push(data)
    }
  }

  // --- SEED QC RECORDS ---
  console.log('Seeding 100 QC Records...')
  // We need equipment and technicians
  const { data: equipDb } = await supabase.from('radiology_equipment').select('id').eq('clinic_id', clinicId)
  const { data: techDb } = await supabase.from('users').select('id').eq('clinic_id', clinicId).limit(10) // Just use generic users if tech insert failed due to constraint
  
  if (equipDb?.length > 0 && techDb?.length > 0) {
    const qcTypes = ['Daily', 'Weekly', 'Monthly', 'Calibration', 'Maintenance']
    const results = ['Pass', 'Pass', 'Pass', 'Pass', 'Warning', 'Fail'] // Weighted towards Pass
    
    for (let i = 0; i < 100; i++) {
      const eq = equipDb[Math.floor(Math.random() * equipDb.length)]
      const user = techDb[Math.floor(Math.random() * techDb.length)]
      
      const { error } = await supabase.from('radiology_quality_control').insert([{
        clinic_id: clinicId,
        equipment_id: eq.id,
        qc_date: new Date(Date.now() - Math.random() * 10000000000).toISOString().split('T')[0],
        qc_type: qcTypes[Math.floor(Math.random() * qcTypes.length)],
        performed_by: user.id,
        result: results[Math.floor(Math.random() * results.length)],
        remarks: 'Seeded historical QC record'
      }])
      
      if (error) console.error('QC Error:', error)
    }
  }

  console.log('Phase 2 Seeding completed!')
}

seed().catch(console.error)
