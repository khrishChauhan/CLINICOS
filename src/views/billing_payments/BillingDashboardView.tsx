import React from 'react';
import { SpecCard } from '../../components/SpecCard';

export default function BillingDashboardView() {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-secondary mb-2">Billing Dashboard</h2>
        <p className="text-slate-500 mb-8 max-w-3xl">
          Detailed specifications for the primary Billing Dashboard, designed for receptionists and cashiers to manage daily collections, pending dues, and billing workflows.
        </p>
      </div>

      <SpecCard
        title="Billing Command Center"
        purpose={
          <p>
            Provides a real-time overview of the financial operations at the front desk. It highlights immediate action items like pending payments, failed transactions, and the day's total cash flow.
          </p>
        }
        widgets={
          <ul className="list-disc pl-4 space-y-1">
            <li><strong>Today's Collections:</strong> Total money received today (split by Cash, Card, UPI).</li>
            <li><strong>Pending Invoices:</strong> Count and total value of invoices generated but not yet paid.</li>
            <li><strong>Insurance Claims Pending:</strong> Value of bills sent to TPA/Insurance awaiting approval.</li>
            <li><strong>Refunds Processed:</strong> Value of refunds issued today.</li>
          </ul>
        }
        tables={
          <ul className="list-disc pl-4 space-y-1">
            <li><strong>Live Billing Queue:</strong> Patients currently at the billing desk or who have just finished a consultation and have unbilled charges. Columns: Token, Patient, Unbilled Amount, Status (Waiting, Processing, Paid), Action.</li>
            <li><strong>Recent Transactions:</strong> The ledger of the last 50 payments.</li>
          </ul>
        }
        filters={
          <ul className="list-disc pl-4 space-y-1">
            <li>Filter by Payment Status (Paid, Partial, Unpaid).</li>
            <li>Filter by Department (Consultation, Pharmacy, Lab).</li>
          </ul>
        }
        actions={
          <ul className="list-disc pl-4 space-y-1">
            <li>Jump to Invoice Generation for waiting patient.</li>
            <li>Send Payment Link via SMS/WhatsApp for pending dues.</li>
            <li>Print/Reprint Receipt.</li>
          </ul>
        }
        userFlow={
          <p>
            Doctor finishes consultation → "Mr. Sharma" appears in Live Billing Queue → Cashier clicks his name → Opens Invoice Generator automatically populated with consultation fee and prescribed lab tests.
          </p>
        }
        responsive={
          <ul className="list-disc pl-4 space-y-1">
            <li><strong>Desktop:</strong> High density data table prioritizing speed. Live queue auto-refreshes via WebSockets.</li>
            <li><strong>Mobile:</strong> Simplified view focusing on the day's totals and a quick QR scanner to pull up a patient's bill physically.</li>
          </ul>
        }
      />

      <SpecCard
        title="Daily Closing Dashboard (Cashier Shift Close)"
        purpose={
          <p>
            The critical end-of-day (or end-of-shift) workflow for cashiers to reconcile physical cash in the drawer against the system's recorded transactions.
          </p>
        }
        widgets={
          <ul className="list-disc pl-4 space-y-1">
            <li><strong>System Cash Expected:</strong> Calculation of Opening Balance + Cash Payments - Cash Refunds.</li>
            <li><strong>Physical Cash Counted:</strong> Input field for the cashier to enter actual till contents.</li>
            <li><strong>Discrepancy Amount:</strong> The difference (if any) between expected and actual cash.</li>
          </ul>
        }
        tables={
          <ul className="list-disc pl-4 space-y-1">
            <li><strong>Shift Ledger:</strong> Detailed breakdown of every transaction during the cashier's active shift.</li>
          </ul>
        }
        actions={
          <ul className="list-disc pl-4 space-y-1">
            <li><strong>Submit Shift Closure:</strong> Locks the shift, logs the discrepancy, and sends a summary report to the Clinic Owner.</li>
            <li><strong>Add Cash Note:</strong> Allows cashier to explain a discrepancy (e.g., "Gave 50rs change from personal wallet, will adjust").</li>
          </ul>
        }
        userFlow={
          <p>
            End of shift. Cashier opens 'Daily Closing' → System expects Rs. 14,500 in cash → Cashier enters denomination breakdown (e.g., 20 x 500) → Total matches → Cashier clicks 'Submit Shift Closure' → Drawer locks, session ends.
          </p>
        }
      />
    </div>
  );
}
