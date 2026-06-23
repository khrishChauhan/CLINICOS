import React from 'react';
import { SpecCard } from '../../components/SpecCard';

export default function InvoiceGeneratorView() {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-secondary mb-2">Invoice & Charge Generation</h2>
        <p className="text-slate-500 mb-8 max-w-3xl">
          Detailed specifications for creating comprehensive invoices that cover mixed service types, packages, insurance copays, and complex discount logic.
        </p>
      </div>

      <SpecCard
        title="Invoice Page Structure"
        purpose={
          <p>
            The interface where clinical services are translated into financial line items. Designed to handle diverse billing scenarios (Pharmacy + Consult + Lab) in a single unified invoice.
          </p>
        }
        widgets={
          <ul className="list-disc pl-4 space-y-1">
            <li><strong>Patient Banner:</strong> Sticky header with Patient Name, UHID, and Primary Insurance summary.</li>
            <li><strong>Total Summary Card:</strong> Floating sticky card showing Subtotal, Tax/GST, Discounts, and Final Amount Due.</li>
          </ul>
        }
        actions={
          <ul className="list-disc pl-4 space-y-1">
            <li><strong>Add Consultation Charges:</strong> Auto-pulls from the doctor's set fee, or allows manual overwrite.</li>
            <li><strong>Add Procedure Charges:</strong> Select from the clinic's master tariff list. Assesses correct tax bracket automatically.</li>
            <li><strong>Add Lab/Medicine Charges:</strong> Integrates with EMR to auto-fill items the doctor requested, or allows manual barcode scanning by the pharmacist.</li>
            <li><strong>Add Health Packages:</strong> E.g., "Full Body Checkup Package", which bundles multiple labs and a consult at a fixed lower price.</li>
          </ul>
        }
        tables={
          <ul className="list-disc pl-4 space-y-1">
            <li><strong>Line Items Grid:</strong> Columns: Category, Item Description, Qty, Unit Rate, Discount %, Tax %, Total. Editable inline.</li>
          </ul>
        }
        responsive={
          <ul className="list-disc pl-4 space-y-1">
            <li><strong>Desktop:</strong> Spread-sheet like data entry grid for rapid keyboard navigation.</li>
          </ul>
        }
      />

      <SpecCard
        title="Discounts & Insurance Overlays"
        purpose={
          <p>
            Handles complex pricing modulations, ensuring appropriate approvals are logged when revenue is waived or deferred to third-party payers.
          </p>
        }
        actions={
          <ul className="list-disc pl-4 space-y-1">
            <li><strong>Apply Discount:</strong> Allows percentage or flat-fee reduction. Prompts for "Reason" (e.g., Staff Family, Manager Override, Marketing Promo). Certain discount thresholds may require a digital pin from the Clinic Manager.</li>
            <li><strong>Insurance/TPA Workflow:</strong> Applies a Copay/Coinsurance logic. Splits the final bill into "Patient Responsibility" and "Insurance Responsibility".</li>
          </ul>
        }
        userFlow={
          <p>
            Cashier adds 3 line items → Subtotal is $100 → Patient says they have a 10% Senior discount → Cashier clicks "Apply Discount" → Selects "Senior Citizen" → System updates Total to $90 and logs the discount against the cashier's ID for auditing.
          </p>
        }
      />
    </div>
  );
}
