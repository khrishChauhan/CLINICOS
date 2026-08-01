import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY 

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)

function generateUID(root = '1.2.840.10008.5.1.4.1.1') {
  return `${root}.${Date.now()}.${Math.floor(Math.random() * 1000000)}`
}

async function seed() {
  console.log('Seeding Radiology Phase 3 (Imaging Studies, Series, Images, PACS)...')
  
  // 1. Get Clinic ID
  const { data: clinics } = await supabase.from('clinics').select('id').ilike('name', '%Durga%')
  const clinicId = clinics?.[0]?.id
  if (!clinicId) throw new Error('Durga Clinic not found')

  // 2. Get existing completed radiology orders
  const { data: orderItems } = await supabase
    .from('radiology_order_items')
    .select('id, radiology_order_id, orders:radiology_orders(patient_id)')
    .eq('status', 'Completed')
    .limit(75)

  if (!orderItems || orderItems.length === 0) {
    console.log('No completed radiology order items found. Ensure Phase 1 seeding is complete.')
    return
  }

  // 3. Get existing Equipment and Technicians
  const { data: equipDb } = await supabase.from('radiology_equipment').select('id, modality').eq('clinic_id', clinicId)
  const { data: techDb } = await supabase.from('radiology_technicians').select('id, employee_id').eq('clinic_id', clinicId)

  let studyCount = 0
  let seriesCount = 0
  let imageCount = 0

  for (const item of orderItems) {
    const patientId = item.orders.patient_id
    const eq = equipDb?.[Math.floor(Math.random() * (equipDb.length || 1))]
    const tech = techDb?.[Math.floor(Math.random() * (techDb.length || 1))]
    const modality = eq?.modality || ['MRI', 'CT', 'X-Ray', 'Ultrasound', 'Mammography'][Math.floor(Math.random() * 5)]

    // --- CREATE STUDY ---
    const studyUid = generateUID('1.2.826.0.1.3680043.2.1125')
    const { data: study, error: studyErr } = await supabase.from('imaging_studies').insert([{
      clinic_id: clinicId,
      patient_id: patientId,
      radiology_order_item_id: item.id,
      study_uid: studyUid,
      modality: modality,
      study_description: `Routine ${modality} Scan`,
      technician_id: tech?.employee_id,
      equipment_id: eq?.id,
      study_status: 'Acquired'
    }]).select().single()

    if (studyErr) {
      if (studyErr.code !== '23505') console.error('Study Error:', studyErr)
      continue
    }
    studyCount++

    // --- PACS INTEGRATION ---
    await supabase.from('pacs_integration').insert([{
      clinic_id: clinicId,
      imaging_study_id: study.id,
      pacs_server: 'Orthanc-Main',
      dicom_uid: studyUid,
      transfer_status: Math.random() > 0.1 ? 'Completed' : 'Pending',
      transfer_date: new Date().toISOString()
    }])

    // --- CREATE SERIES ---
    const numSeries = modality === 'MRI' || modality === 'CT' ? Math.floor(Math.random() * 4) + 2 : Math.floor(Math.random() * 2) + 1
    
    for (let i = 1; i <= numSeries; i++) {
      const seriesUid = generateUID('1.2.840.10008.5.1.4.1.1.7')
      const { data: series, error: seriesErr } = await supabase.from('imaging_series').insert([{
        clinic_id: clinicId,
        imaging_study_id: study.id,
        series_uid: seriesUid,
        series_number: i,
        modality: modality,
        description: i === 1 ? 'Localizer' : (modality === 'MRI' ? 'T2 Axial' : 'Standard View'),
        body_part: ['Head', 'Chest', 'Abdomen', 'Pelvis', 'Knee'][Math.floor(Math.random() * 5)]
      }]).select().single()

      if (seriesErr) continue
      seriesCount++

      // --- CREATE IMAGES (Mock paths) ---
      const numImages = modality === 'X-Ray' ? 1 : (modality === 'CT' ? 30 : 15)
      
      const imagesPayload = []
      for (let j = 1; j <= numImages; j++) {
        imagesPayload.push({
          clinic_id: clinicId,
          imaging_series_id: series.id,
          image_uid: generateUID('1.2.840.10008.5.1.4.1.1.2'),
          image_number: j,
          storage_path: `${clinicId}/${series.id}/img_${j}.dcm`, // mock path
          image_size: Math.floor(Math.random() * 500000) + 100000 // 100kb to 600kb
        })
        imageCount++
      }

      // Batch insert images
      if (imagesPayload.length > 0) {
        await supabase.from('imaging_images').insert(imagesPayload)
      }
    }
  }

  console.log(`Phase 3 Seeding completed!`)
  console.log(`Created: ${studyCount} Studies, ${seriesCount} Series, ${imageCount} Images.`)
}

seed().catch(console.error)
