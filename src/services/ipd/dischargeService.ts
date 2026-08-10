import { createClient } from '@/lib/supabase/server'
import { IPDRepository } from '@/repositories/ipd/ipdRepository'
import dayjs from 'dayjs'

export class DischargeService {
  private ipdRepo: IPDRepository

  constructor(supabase: any) {
    this.ipdRepo = new IPDRepository(supabase)
  }

  static async create() {
    const supabase = await createClient()
    return new DischargeService(supabase)
  }

  async initiateDischarge(admissionId: string) {
    // 1. Fetch Admission
    const { data: admission, error: admError } = await this.ipdRepo.getAdmissionById(admissionId)
    if (admError) throw new Error(`Failed to fetch admission: ${admError.message}`)
    
    // 2. End current bed allocation if active
    const activeAllocation = admission.bed_allocations?.find((ba: any) => !ba.end_time)
    if (activeAllocation) {
      const now = new Date().toISOString()
      await this.ipdRepo.endBedAllocation(activeAllocation.id, now)
      await this.ipdRepo.updateBedStatus(activeAllocation.bed_id, 'Cleaning')
    }

    // 3. Update Admission status
    const { error: updError } = await this.ipdRepo.updateAdmission(admissionId, {
      status: 'Discharge Requested',
      actual_discharge_date: new Date().toISOString()
    })
    if (updError) throw new Error(`Failed to update admission status: ${updError.message}`)

    // 4. Generate IPD Invoice Draft
    await this.generateDischargeInvoice(admissionId)
  }

  private async generateDischargeInvoice(admissionId: string) {
    // Fetch complete admission details including historical beds
    const { data: allocations, error: allocError } = await this.ipdRepo.getHistoricalBedAllocations(admissionId)
    if (allocError) throw new Error(`Failed to fetch bed allocations for billing: ${allocError.message}`)
    
    const { data: admission } = await this.ipdRepo.getAdmissionById(admissionId)

    // Calculate bed charges
    const invoiceItems = []
    
    for (const alloc of allocations) {
      if (!alloc.bed) continue
      
      const start = dayjs(alloc.start_time)
      const end = alloc.end_time ? dayjs(alloc.end_time) : dayjs()
      
      // Calculate full days (minimum 1 day charge if < 24h)
      let days = Math.ceil(end.diff(start, 'day', true))
      if (days < 1) days = 1

      const totalCharge = days * Number(alloc.bed.base_price_per_day)

      invoiceItems.push({
        item_type: 'Service',
        description: `Bed Charge: ${alloc.bed.ward?.name} - ${alloc.bed.bed_number} (${days} Days)`,
        quantity: days,
        unit_price: Number(alloc.bed.base_price_per_day),
        total_amount: totalCharge
      })
    }

    // Insert Draft Invoice directly
    const invoiceData = {
      patient_id: admission.patient_id,
      clinic_id: admission.clinic_id,
      type: 'IPD',
      status: 'Draft',
      subtotal: invoiceItems.reduce((sum, item) => sum + item.total_amount, 0),
      total_amount: invoiceItems.reduce((sum, item) => sum + item.total_amount, 0),
      created_at: new Date().toISOString()
    }
    const { data: invoice, error: invError } = await this.ipdRepo['supabase']
      .from('billing_invoices')
      .insert(invoiceData)
      .select('id')
      .single()
      
    if (invError) throw new Error(`Failed to create IPD invoice: ${invError.message}`)

    // Create line items
    const itemsToInsert = invoiceItems.map(item => ({
      invoice_id: invoice.id,
      item_type: item.item_type,
      description: item.description,
      quantity: item.quantity,
      unit_price: item.unit_price,
      total_amount: item.total_amount
    }))
    
    await this.ipdRepo['supabase']
      .from('billing_invoice_items')
      .insert(itemsToInsert)

    // Mark admission as Billing Pending
    await this.ipdRepo.updateAdmission(admissionId, { status: 'Billing Pending' })
  }
}
