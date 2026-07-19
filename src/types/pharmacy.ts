export interface MedicineCategoryRow {
  id: string
  clinic_id: string
  name: string
  description: string | null
  created_at: string
}

export interface MedicineRow {
  id: string
  clinic_id: string
  category_id: string | null
  name: string
  generic_name: string | null
  manufacturer: string | null
  unit: string | null
  reorder_level: number
  is_active: boolean
  created_at: string
}

export interface SupplierRow {
  id: string
  clinic_id: string
  name: string
  contact_name: string | null
  email: string | null
  phone: string | null
  address: string | null
  created_at: string
}

export interface PurchaseOrderRow {
  id: string
  clinic_id: string
  supplier_id: string
  po_number: string
  status: 'Draft' | 'Ordered' | 'Received' | 'Cancelled'
  order_date: string | null
  expected_date: string | null
  created_by: string | null
  created_at: string
  updated_at: string
}

export interface PurchaseOrderItemRow {
  id: string
  po_id: string
  medicine_id: string
  quantity: number
  unit_price: number
  total_price: number
  created_at: string
}

export interface MedicineBatchRow {
  id: string
  medicine_id: string
  batch_number: string
  expiry_date: string
  mfg_date: string | null
  barcode: string | null
  created_at: string
}

export interface MedicineStockRow {
  id: string
  clinic_id: string
  medicine_id: string
  batch_id: string
  current_quantity: number
}

export interface StockTransactionRow {
  id: string
  clinic_id: string
  medicine_id: string
  batch_id: string
  transaction_type: 'Purchase' | 'Dispense' | 'Adjustment' | 'Return'
  quantity_change: number
  reference_id: string | null
  remarks: string | null
  created_by: string | null
  created_at: string
}

export interface DispenseRecordRow {
  id: string
  clinic_id: string
  patient_id: string
  prescription_id: string | null
  dispense_date: string
  status: 'Dispensed' | 'Cancelled'
  dispensed_by: string | null
  created_at: string
}

export interface DispenseItemRow {
  id: string
  dispense_record_id: string
  medicine_id: string
  batch_id: string
  quantity: number
  unit_price: number
  total_price: number
  created_at: string
}
