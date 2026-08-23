import { createClient } from '@supabase/supabase-js'

const supabase = createClient('https://ihnjzlilbwhosfpawdvx.supabase.co', process.env.SUPABASE_ACCESS_TOKEN, {
  auth: { persistSession: false }
})

// I'll copy the logic from pushOTChargesToBilling to see if it passes
async function testBilling(surgeryId) {
  // get surgery
  const { data: surgery, error: sErr } = await supabase.from('surgeries').select('*, room:rooms(*), lead_surgeon:users!lead_surgeon_id(*)').eq('id', surgeryId).single()
  if (sErr) throw sErr;
  
  const invoiceItems = []
  const roomCharge = Number(surgery.room?.base_price_per_hour || 0) * 1
  if (roomCharge > 0) {
    invoiceItems.push({
      item_type: 'Service',
      description: `OT Room Charge: ${surgery.room?.name} - ${surgery.procedure_name}`,
      quantity: 1,
      unit_price: roomCharge,
      total_amount: roomCharge
    })
  }

  invoiceItems.push({
    item_type: 'Service',
    description: `Surgeon Fee: Dr. ${surgery.lead_surgeon?.username}`,
    quantity: 1,
    unit_price: 15000,
    total_amount: 15000
  })

  const { data: consumables } = await supabase.from('consumables').select('*, medicine:medicines(*)').eq('surgery_id', surgeryId)
  if (consumables && consumables.length > 0) {
    for (const item of consumables) {
      if (!item.is_billed) {
        const itemTotal = Number(item.quantity) * Number(item.medicine?.unit_price || 0)
        if (itemTotal > 0) {
          invoiceItems.push({
            item_type: 'Medicine',
            description: `Surgical Consumable: ${item.medicine?.brand_name || item.medicine?.generic_name} (Batch: ${item.batch_number || 'N/A'})`,
            quantity: Number(item.quantity),
            unit_price: Number(item.medicine?.unit_price || 0),
            total_amount: itemTotal
          })
        }
      }
    }
  }

  if (invoiceItems.length === 0) return console.log('nothing to bill');

  const invoiceData = {
    invoice_number: `INV-OT-TEST-${Math.random().toString(36).substring(2, 6).toUpperCase()}`,
    patient_id: surgery.patient_id,
    clinic_id: surgery.clinic_id,
    status: 'Draft',
    subtotal: invoiceItems.reduce((sum, item) => sum + item.total_amount, 0),
    grand_total: invoiceItems.reduce((sum, item) => sum + item.total_amount, 0),
    amount_due: invoiceItems.reduce((sum, item) => sum + item.total_amount, 0),
    created_at: new Date().toISOString()
  }

  const { data: invoice, error: invError } = await supabase
    .from('billing_invoices')
    .insert(invoiceData)
    .select('id')
    .single()
    
  if (invError) throw invError;
  console.log('Invoice created:', invoice.id)

  const itemsToInsert = invoiceItems.map(item => ({
    invoice_id: invoice.id,
    item_name: item.description,
    quantity: item.quantity,
    unit_price: item.unit_price,
    total_amount: item.total_amount
  }))
  
  const { error: itemsError } = await supabase
    .from('billing_invoice_items')
    .insert(itemsToInsert)
    
  if (itemsError) throw itemsError;
  console.log('Items created successfully')
}

testBilling('b78a2853-7dbc-44f6-8fc9-2c82e89d85f7').catch(console.error)
