import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY 

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)

async function seed() {
  console.log('Seeding Radiology Phase 4 (Reports, Findings, Clinical)...')
  
  // 1. Get Clinic ID
  const { data: clinics } = await supabase.from('clinics').select('id').ilike('name', '%Durga%')
  const clinicId = clinics?.[0]?.id
  if (!clinicId) throw new Error('Durga Clinic not found')

  // 2. Get doctors to act as radiologists
  const { data: doctors } = await supabase.from('users').select('id').eq('clinic_id', clinicId).eq('role', 'Doctor')
  if (!doctors || doctors.length === 0) throw new Error('No doctors found')

  // 3. Get existing Acquired Imaging Studies
  const { data: studies } = await supabase
    .from('imaging_studies')
    .select('id, modality, equipment_id, patient_id')
    .eq('clinic_id', clinicId)
    .limit(75)

  if (!studies || studies.length === 0) {
    console.log('No imaging studies found. Ensure Phase 3 seeding is complete.')
    return
  }

  let reportCount = 0
  let contrastCount = 0
  let doseCount = 0

  for (const study of studies) {
    const radiologistId = doctors[Math.floor(Math.random() * doctors.length)].id

    // --- 1. CREATE REPORT ---
    const isApproved = Math.random() > 0.3 // 70% approved
    const { data: report, error: reportErr } = await supabase.from('radiology_reports').insert([{
      clinic_id: clinicId,
      imaging_study_id: study.id,
      radiologist_id: radiologistId,
      version_number: 1,
      status: isApproved ? 'Approved' : 'Draft',
      verified_date: isApproved ? new Date().toISOString() : null,
      approved_date: isApproved ? new Date().toISOString() : null,
      pdf_storage_path: isApproved ? `${clinicId}/reports/mock_report.pdf` : null,
    }]).select().single()

    if (reportErr) {
      console.error('Report Error:', reportErr)
      continue
    }
    reportCount++

    // --- 2. CREATE FINDINGS ---
    const isCritical = Math.random() > 0.9 // 10% critical
    await supabase.from('radiologist_findings').insert([{
      clinic_id: clinicId,
      radiology_report_id: report.id,
      clinical_history: 'Patient presents with pain and discomfort in the region.',
      technique: `Standard ${study.modality} acquisition protocol.`,
      findings: 'The acquired images show normal structural anatomy with no acute abnormalities identified.',
      impression: isCritical ? 'Suspicious mass identified. Immediate follow-up required.' : 'Unremarkable study.',
      is_critical_finding: isCritical,
      recommendations: isCritical ? 'STAT clinical correlation.' : 'None.'
    }])

    // --- 3. CONTRAST ADMINISTRATION (CT / MRI) ---
    if ((study.modality === 'CT' || study.modality === 'MRI') && Math.random() > 0.5) {
      await supabase.from('contrast_administration').insert([{
        clinic_id: clinicId,
        imaging_study_id: study.id,
        contrast_agent: study.modality === 'MRI' ? 'Gadolinium' : 'Iohexol',
        dose: '15ml',
        route: 'IV',
        administered_by: radiologistId,
        administration_time: new Date().toISOString(),
        reaction: 'None',
        remarks: 'Patient tolerated well'
      }])
      contrastCount++
    }

    // --- 4. RADIATION DOSE (CT / X-Ray) ---
    if ((study.modality === 'CT' || study.modality === 'X-Ray') && study.equipment_id) {
      await supabase.from('radiation_dose').insert([{
        clinic_id: clinicId,
        imaging_study_id: study.id,
        equipment_id: study.equipment_id,
        dose_value: study.modality === 'CT' ? (Math.random() * 10 + 5).toFixed(2) : (Math.random() * 2).toFixed(2),
        dose_unit: 'mGy',
        operator_id: radiologistId
      }])
      doseCount++
    }

    // Update study status if approved
    if (isApproved) {
      await supabase.from('imaging_studies').update({ study_status: 'Reported' }).eq('id', study.id)
    }
  }

  console.log(`Phase 4 Seeding completed!`)
  console.log(`Created: ${reportCount} Reports, ${contrastCount} Contrast Administrations, ${doseCount} Radiation Doses.`)
}

seed().catch(console.error)
