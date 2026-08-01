import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY 

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)

async function seed() {
  console.log('Seeding Radiology Phase 5 (Attachments, Notifications, Audit)...')
  
  // 1. Get Clinic ID
  const { data: clinics } = await supabase.from('clinics').select('id').ilike('name', '%Durga%')
  const clinicId = clinics?.[0]?.id
  if (!clinicId) throw new Error('Durga Clinic not found')

  // 2. Get doctors
  const { data: doctors } = await supabase.from('users').select('id').eq('clinic_id', clinicId).eq('role', 'Doctor')
  const doctorId = doctors?.[0]?.id

  // 3. Get existing radiology orders
  const { data: orders } = await supabase
    .from('radiology_orders')
    .select('id, patient_id')
    .eq('clinic_id', clinicId)
    .limit(100)

  if (!orders || orders.length === 0) {
    console.log('No radiology orders found. Ensure Phase 1 seeding is complete.')
    return
  }

  let attachCount = 0
  let notifyCount = 0
  let auditCount = 0

  for (const order of orders) {
    // --- 1. ATTACHMENTS ---
    if (Math.random() > 0.5) { // 50% of orders have attachments
      const { data: fileAttachment } = await supabase.from('file_attachments').insert([{
        clinic_id: clinicId,
        module_name: 'Radiology',
        reference_table: 'radiology_orders',
        reference_id: order.id,
        file_name: 'referral_doc.pdf',
        original_file_name: 'referral_doc.pdf',
        mime_type: 'application/pdf',
        file_size_bytes: 102400,
        storage_provider: 'supabase',
        file_path: `${clinicId}/${order.id}/referral_doc.pdf`,
        uploaded_by: doctorId
      }]).select().single()

      if (fileAttachment) {
        await supabase.from('radiology_attachments').insert([{
          clinic_id: clinicId,
          radiology_order_id: order.id,
          attachment_id: fileAttachment.id,
          document_type: 'Referral Document',
          remarks: 'External referring physician notes.'
        }])
        attachCount++
      }
    }

    // --- 2. NOTIFICATIONS ---
    const notificationsToGenerate = Math.floor(Math.random() * 3) + 1 // 1 to 3 notifications
    for (let i = 0; i < notificationsToGenerate; i++) {
      const type = i === 0 ? 'Study Scheduled' : i === 1 ? 'Report Ready' : 'Critical Findings'
      await supabase.from('radiology_notifications').insert([{
        clinic_id: clinicId,
        radiology_order_id: order.id,
        recipient_type: 'Doctor',
        notification_type: type,
        status: 'Sent',
        sent_at: new Date().toISOString()
      }])
      notifyCount++
    }

    // --- 3. AUDIT LOGS ---
    const auditsToGenerate = Math.floor(Math.random() * 10) + 1 // 1 to 10 audit logs per order
    const auditPayload = []
    const actions = ['Order Created', 'Schedule Created', 'Study Acquired', 'Images Uploaded', 'Report Draft Saved', 'Report Approved']
    for (let i = 0; i < auditsToGenerate; i++) {
      auditPayload.push({
        clinic_id: clinicId,
        radiology_order_id: order.id,
        action: actions[i % actions.length],
        action_by: doctorId,
        new_value: { timestamp: new Date().toISOString() },
        action_time: new Date(Date.now() - Math.random() * 1000000000).toISOString()
      })
      auditCount++
    }
    
    if (auditPayload.length > 0) {
      await supabase.from('radiology_audit').insert(auditPayload)
    }
  }

  console.log(`Phase 5 Seeding completed!`)
  console.log(`Created: ${attachCount} Attachments, ${notifyCount} Notifications, ${auditCount} Audit Logs.`)
}

seed().catch(console.error)
