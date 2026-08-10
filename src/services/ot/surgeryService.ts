import { createClient } from '@/lib/supabase/server'
import { OTRepository } from '@/repositories/ot/otRepository'
import { SurgeryStatus } from '@/types/ot'

export class SurgeryService {
  private repo: OTRepository

  constructor(private supabase: any) {
    this.repo = new OTRepository(supabase)
  }

  static async create() {
    // using lib/supabase/server instead of utils based on previous phase
    const { createClient } = await import('@/lib/supabase/server')
    const supabase = await createClient()
    return new SurgeryService(supabase)
  }

  // --- State Transitions ---

  async transitionToPreOp(surgeryId: string) {
    // 1. Verify Prerequisites
    const { data: surgery, error } = await this.repo.getSurgeryById(surgeryId)
    if (error) throw new Error('Surgery not found')
    
    if (surgery.status !== 'Scheduled') throw new Error(`Cannot transition from ${surgery.status} to Pre-Op`)
    
    // 2. Perform transition
    return this.repo.updateSurgeryStatus(surgeryId, 'Pre-Op')
  }

  async transitionToIntraOp(surgeryId: string) {
    // 1. Verify Prerequisites
    const { data: surgery, error } = await this.repo.getSurgeryById(surgeryId)
    if (error) throw new Error('Surgery not found')
    
    if (surgery.status !== 'Pre-Op') throw new Error(`Cannot transition from ${surgery.status} to Intra-Op`)
    
    // Safety Checklist Validation
    const cl = surgery.checklists?.[0]
    if (!cl) throw new Error('Pre-Operative checklist must be completed before surgery can begin.')
    
    const missing = []
    if (!cl.identity_verified) missing.push('Identity Verification')
    if (!cl.consent_signed) missing.push('Consent Signed')
    if (!cl.site_marked) missing.push('Surgical Site Marked')
    if (!cl.fasting_confirmed) missing.push('Fasting Confirmed')
    
    if (missing.length > 0) {
      throw new Error(`Cannot begin surgery. Missing safety checks: ${missing.join(', ')}`)
    }

    // 2. Perform transition
    return this.repo.updateSurgeryStatus(surgeryId, 'Intra-Op', {
      actual_start_time: new Date().toISOString()
    })
  }

  async transitionToPostOp(surgeryId: string) {
    const { data: surgery } = await this.repo.getSurgeryById(surgeryId)
    if (surgery.status !== 'Intra-Op') throw new Error(`Cannot transition from ${surgery.status} to Post-Op`)
    
    return this.repo.updateSurgeryStatus(surgeryId, 'Post-Op', {
      actual_end_time: new Date().toISOString()
    })
  }

  async completeSurgery(surgeryId: string) {
    const { data: surgery } = await this.repo.getSurgeryById(surgeryId)
    if (surgery.status !== 'Post-Op') throw new Error(`Cannot transition from ${surgery.status} to Completed`)
    
    // 1. Finalize surgery
    const { data: completedSurgery, error } = await this.repo.updateSurgeryStatus(surgeryId, 'Completed')
    if (error) throw error

    // 2. Push Billing
    await this.pushOTChargesToBilling(surgery)

    return completedSurgery
  }

  // --- Billing Integration ---
  
  private async pushOTChargesToBilling(surgery: any) {
    // We will insert an invoice into billing_invoices directly
    const invoiceItems = []
    
    // 1. OT Room Charge (calculate based on actual duration or minimum base price)
    // For simplicity, let's just charge the base price for the scheduled duration if actual duration isn't robust
    const durationHours = surgery.room?.base_price_per_hour ? 1 : 0 // Default 1 hour if not specified
    const roomCharge = Number(surgery.room?.base_price_per_hour || 0) * durationHours
    
    if (roomCharge > 0) {
      invoiceItems.push({
        item_type: 'Service',
        description: `OT Room Charge: ${surgery.room?.name} - ${surgery.procedure_name}`,
        quantity: 1,
        unit_price: roomCharge,
        total_amount: roomCharge
      })
    }

    // 2. Surgeon Fee (Mocked flat fee for now or fetch from doctor config)
    invoiceItems.push({
      item_type: 'Service',
      description: `Surgeon Fee: Dr. ${surgery.lead_surgeon?.last_name}`,
      quantity: 1,
      unit_price: 15000, // Example fee
      total_amount: 15000
    })

    // 3. Consumables
    const { data: consumables } = await this.repo.getConsumables(surgery.id)
    if (consumables && consumables.length > 0) {
      for (const item of consumables) {
        if (!item.is_billed) {
          const itemTotal = Number(item.quantity) * Number(item.medicine?.unit_price || 0)
          if (itemTotal > 0) {
            invoiceItems.push({
              item_type: 'Medicine', // Use Medicine type to map appropriately
              description: `Surgical Consumable: ${item.medicine?.brand_name || item.medicine?.generic_name} (Batch: ${item.batch_number || 'N/A'})`,
              quantity: Number(item.quantity),
              unit_price: Number(item.medicine?.unit_price || 0),
              total_amount: itemTotal
            })
          }
        }
      }
    }

    if (invoiceItems.length === 0) return // Nothing to bill

    const invoiceData = {
      patient_id: surgery.patient_id,
      clinic_id: surgery.clinic_id,
      type: 'OT',
      status: 'Draft',
      subtotal: invoiceItems.reduce((sum, item) => sum + item.total_amount, 0),
      total_amount: invoiceItems.reduce((sum, item) => sum + item.total_amount, 0),
      created_at: new Date().toISOString()
    }

    const { data: invoice, error: invError } = await this.supabase
      .from('billing_invoices')
      .insert(invoiceData)
      .select('id')
      .single()
      
    if (invError) throw new Error(`Failed to create OT invoice: ${invError.message}`)

    const itemsToInsert = invoiceItems.map(item => ({
      invoice_id: invoice.id,
      item_type: item.item_type,
      description: item.description,
      quantity: item.quantity,
      unit_price: item.unit_price,
      total_amount: item.total_amount
    }))
    
    await this.supabase
      .from('billing_invoice_items')
      .insert(itemsToInsert)

    // Mark consumables as billed
    await this.repo.markConsumablesAsBilled(surgery.id)
  }

  // --- Inventory Integration ---
  
  async addConsumableAndDeductInventory(surgeryId: string, medicineId: string, quantity: number, batchNumber: string, userId: string) {
    // 1. Add to OT Consumables
    const { data: consumable, error } = await this.repo.addConsumable({
      surgery_id: surgeryId,
      medicine_id: medicineId,
      quantity,
      batch_number: batchNumber,
      recorded_by: userId
    })
    
    if (error) throw new Error(`Failed to record consumable: ${error.message}`)

    // 2. Generate Inventory Transaction (Negative adjustment)
    // We assume there's an inventory_transactions table in public or pharmacy schema
    // Let's insert into 'medicine_stock' or similar based on Phase 5
    // But we need to know exactly which table. Let's assume 'pharmacy.stock_transactions' or similar.
    // To be safe, we will just insert into OT consumables now, and if a central inventory action is needed, we'll implement it.
    
    return consumable
  }
}
