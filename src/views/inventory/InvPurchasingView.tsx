import React from 'react';
import { SpecCard } from '../../components/SpecCard';

export default function InvPurchasingView() {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-secondary mb-2">Purchasing & Vendors</h2>
        <p className="text-slate-500 mb-8 max-w-3xl">
          Detailed specifications for the B2B supply chain operations, managing supplier relationships, generating Purchase Orders, and receiving physical goods.
        </p>
      </div>

      <SpecCard
        title="Purchase Orders (PO) Management"
        purpose={
          <p>
            The system for requesting new stock from suppliers, tracking fulfillment, and preventing unauthorized corporate spending.
          </p>
        }
        widgets={
          <ul className="list-disc pl-4 space-y-1">
            <li><strong>Draft POs:</strong> Number of orders built but not yet sent.</li>
            <li><strong>Pending Approvals:</strong> POs exceeding the manager's spending limit awaiting Clinic Owner sign-off.</li>
            <li><strong>Overdue Deliveries:</strong> POs accepted by vendor but past expected delivery date.</li>
          </ul>
        }
        tables={
          <ul className="list-disc pl-4 space-y-1">
            <li><strong>Order Ledger:</strong> Columns: PO Number, Vendor, Issue Date, Expected Date, Total Amount, Status (Draft, Sent, Partially Received, Fulfilled).</li>
          </ul>
        }
        actions={
          <ul className="list-disc pl-4 space-y-1">
            <li>Create New PO (Auto-pulls items below minimum threshold).</li>
            <li>Approve / Reject PO.</li>
            <li>Send PO to Vendor (Email PDF / WhatsApp dispatch directly from system).</li>
          </ul>
        }
        userFlow={
          <p>
            System detects 15 items low on stock → Generates "Draft Auto-PO" for primary supplier → Manager reviews list, adjusts quantities up slightly to meet free-shipping minimum → Hits "Send and Email PO" → Vendor receives PDF.
          </p>
        }
      />

      <SpecCard
        title="Goods Received Note (GRN) & Inwarding"
        purpose={
          <p>
            The critical process of physically receiving goods at the loading dock, verifying them against the PO, recording batch/expiry dates, and injecting them into the active stock ledger.
          </p>
        }
        actions={
          <ul className="list-disc pl-4 space-y-1">
            <li><strong>Scan to Receive:</strong> Scan incoming boxes to match against expected PO line-items.</li>
            <li><strong>Batch/Expiry Capture:</strong> Mandatory fields to enter the manufacturer's batch number and expiry date before finalizing stock ingestion.</li>
            <li><strong>Partial Receipt:</strong> Ability to log that only 50 of 100 ordered items arrived (Backordering).</li>
          </ul>
        }
        userFlow={
          <p>
            Delivery truck arrives → Staff opens "Pending PO" on tablet → Scans box of Paracetamol → System prompts for "Batch #" and "Expiry Date" → Staff types in details from the box → Clicks "Accept 100 Units" → Stock ledger instantly increases by 100.
          </p>
        }
      />

      <SpecCard
        title="Vendor Directory"
        purpose={
          <p>
            CRM for suppliers ranging from pharmaceutical distributors to medical equipment manufacturers.
          </p>
        }
        tables={
          <ul className="list-disc pl-4 space-y-1">
            <li><strong>Vendors List:</strong> Columns: Vendor Name, Category, Contact Person, Phone, Email, Average Delivery Time, Account Balance (Amount Owed).</li>
          </ul>
        }
        actions={
          <ul className="list-disc pl-4 space-y-1">
            <li>Add / Edit Vendor details.</li>
            <li>View Vendor Performance (Historical fulfillment accuracy and speed).</li>
          </ul>
        }
      />
    </div>
  );
}
