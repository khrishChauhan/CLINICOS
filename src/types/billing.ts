export interface ServiceCategoryRow {
  id: string
  clinic_id: string
  name: string
  description: string | null
  created_at: string
}

export interface ServiceRow {
  id: string
  category_id: string | null
  clinic_id: string
  name: string
  base_price: number
  tax_rate: number
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface BillingInvoiceRow {
  id: string
  clinic_id: string
  patient_id: string
  consultation_id: string | null
  invoice_number: string
  status: 'Draft' | 'Issued' | 'Partially Paid' | 'Paid' | 'Cancelled' | 'Refunded'
  subtotal: number
  tax_total: number
  discount_total: number
  grand_total: number
  amount_paid: number
  amount_due: number
  due_date: string | null
  issued_at: string | null
  created_by: string | null
  created_at: string
  updated_at: string
}

export interface BillingInvoiceItemRow {
  id: string
  invoice_id: string
  service_id: string | null
  item_name: string
  quantity: number
  unit_price: number
  tax_rate: number
  tax_amount: number
  discount_amount: number
  total_amount: number
  created_at: string
}

export interface PaymentRow {
  id: string
  clinic_id: string
  patient_id: string
  invoice_id: string
  payment_method: string
  amount: number
  transaction_reference: string | null
  status: 'Success' | 'Failed' | 'Refunded'
  payment_date: string
  collected_by: string | null
}
