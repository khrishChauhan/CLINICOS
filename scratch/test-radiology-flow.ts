import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'
const __dirname = path.dirname(fileURLToPath(import.meta.url))
dotenv.config({ path: path.join(__dirname, '../.env.local') })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
const supabase = createClient(supabaseUrl, supabaseKey)

async function delay(ms: number) { return new Promise(resolve => setTimeout(resolve, ms)) }

async function run() {
  console.log('--- STARTING RADIOLOGY FLOW SIMULATION ---')

  // 1. Fetch some base entities
  const { data: clinic } = await supabase.from('clinics').select('id').limit(1).single()
  const { data: doctor } = await supabase.schema('doctor').from('doctors').select('id, user_id').limit(1).single()
  const { data: patient } = await supabase.from('patients').select('id').limit(1).single()
  const { data: tests } = await supabase.from('radiology_tests').select('id, name').limit(1)

  if (!clinic || !doctor || !patient) {
    console.log('Missing basic seed data (clinic, doctor, or patient).')
    return
  }
  
  const testId = tests?.[0]?.id || '00000000-0000-0000-0000-000000000000'
  const testName = tests?.[0]?.name || 'X-Ray Chest'

  // Create a visit to attach the order to
  const { data: visit, error: visitErr } = await supabase.from('visits').insert({
    clinic_id: clinic.id,
    patient_id: patient.id,
    doctor_id: doctor.id,
    visit_number: `VST-SIM-${Date.now()}`,
    visit_type: 'OPD',
    created_by: doctor.user_id
  }).select().single()
  
  if (visitErr) throw visitErr
  console.log('✅ Created EMR Visit:', visit.id)

  // 1. Order Initiation (RPC)
  const items = [{
    imaging_test_id: testId,
    imaging_name: testName,
    body_part: 'Chest',
    contrast_required: false,
    remarks: 'Routine check'
  }]
  
  const { data: orderData, error: orderErr } = await supabase.schema('radiology').rpc('create_clinical_and_radiology_order', {
    p_clinic_id: clinic.id,
    p_patient_id: patient.id,
    p_visit_id: visit.id,
    p_doctor_id: doctor.id,
    p_appointment_id: null,
    p_priority: 'Routine',
    p_clinical_indication: 'Cough and fever',
    p_items: items,
    p_created_by: doctor.user_id
  }, { count: 'exact', head: false })

  if (orderErr) {
    console.error('❌ Failed to create order:', orderErr)
    return
  }
  console.log('✅ Order Initiated. RPC Result:', orderData)
  
  const radOrderId = orderData.radiology_order_id
  
  // Get the order item ID
  const { data: orderItems } = await supabase.schema('radiology').from('radiology_order_items').select('id').eq('radiology_order_id', radOrderId)
  const radOrderItemId = orderItems?.[0]?.id

  // 2. Scheduling & Technician Assignment
  // We need a room and a tech. 
  // For the simulation, we can pass nulls if the RPC allows it, or fetch one.
  const { data: schedData, error: schedErr } = await supabase.rpc('schedule_radiology_transaction', {
    p_radiology_order_item_id: radOrderItemId,
    p_scheduled_date: new Date().toISOString().split('T')[0],
    p_scheduled_time: '10:00:00',
    p_room_id: null,
    p_technician_id: doctor.user_id, // using doctor as tech for sim
    p_estimated_duration: 30
  }, { count: 'exact', head: false })

  if (schedErr) console.error('❌ Scheduling failed:', schedErr)
  else console.log('✅ Scheduled Successfully:', schedData)
  
  // 3. Study Execution (Imaging)
  const { data: study, error: studyErr } = await supabase.schema('radiology').from('imaging_studies').insert({
    radiology_order_item_id: radOrderItemId,
    clinic_id: clinic.id,
    study_date: new Date().toISOString().split('T')[0],
    study_time: new Date().toISOString(),
    performing_technician_id: doctor.user_id,
    status: 'In Progress',
    notes: 'Patient was cooperative.'
  }).select().single()

  if (studyErr) console.error('❌ Study creation failed:', studyErr)
  else console.log('✅ Study In Progress:', study.id)

  // Complete study
  await supabase.schema('radiology').from('imaging_studies').update({ status: 'Completed', end_time: new Date().toISOString() }).eq('id', study.id)
  console.log('✅ Study Completed.')

  // 4. Reporting & Findings
  const { data: report, error: reportErr } = await supabase.schema('radiology').from('radiology_reports').insert({
    imaging_study_id: study.id,
    clinic_id: clinic.id,
    radiologist_id: doctor.user_id,
    report_status: 'Draft'
  }).select().single()
  
  if (reportErr) console.error('❌ Report creation failed:', reportErr)
  else console.log('✅ Draft Report Created:', report.id)

  await supabase.schema('radiology').from('radiologist_findings').insert({
    radiology_report_id: report.id,
    findings_text: 'No acute cardiopulmonary abnormalities.',
    impression: 'Normal study.',
    is_critical: false
  })
  
  // 5. Approval & Dispatch (RPC)
  const { data: approvalData, error: approvalErr } = await supabase.rpc('approve_radiology_report', {
    p_report_id: report.id,
    p_user_id: doctor.user_id
  }, { count: 'exact', head: false })

  if (approvalErr) console.error('❌ Report Approval failed:', approvalErr)
  else console.log('✅ Report Approved! RPC Result:', approvalData)

  // Verify Audit Logs
  const { data: audit } = await supabase.schema('radiology').from('radiology_audit').select('*').eq('radiology_order_id', radOrderId)
  console.log(`✅ Audit Logs found: ${audit?.length}`)
  
  console.log('--- RADIOLOGY SIMULATION COMPLETE ---')
}

run().catch(console.error)
