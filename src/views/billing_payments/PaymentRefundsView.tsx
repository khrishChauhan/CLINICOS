import React from 'react';
import { SpecCard } from '../../components/SpecCard';

export default function PaymentRefundsView() {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-secondary mb-2">Payments & Refunds</h2>
        <p className="text-slate-500 mb-8 max-w-3xl">
          Detailed specifications for the point-of-sale payment capture, multi-tender support, and the secure refund workflow.
        </p>
      </div>

      <SpecCard
        title="Payment Modal & Tender Types"
        purpose={
          <p>
            The final step interface where money is actually collected from the patient. Built to handle standard payments and complex split-tender scenarios.
          </p>
        }
        widgets={
          <ul className="list-disc pl-4 space-y-1">
            <li><strong>Amount Due Display:</strong> Large, unambiguous typography.</li>
            <li><strong>Dynamic QR Code:</strong> Auto-generates a UPI QR code containing the exact bill amount and clinic VPA for instant zero-error scanning.</li>
          </ul>
        }
        actions={
          <ul className="list-disc pl-4 space-y-1">
            <li><strong>UPI:</strong> Triggers QR display or pushes payment link to phone.</li>
            <li><strong>Cash:</strong> Cashier enters amount received. System calculates exact change to return.</li>
            <li><strong>Card / POS:</strong> Integration with physical EDC machines, or manual reference number entry.</li>
            <li><strong>Split Payment:</strong> Allows patient to pay part in Cash and part on Card. Dynamically updates "Remaining Balance".</li>
          </ul>
        }
        buttons={
          <ul className="list-disc pl-4 space-y-1">
            <li><strong>Huge Primary:</strong> "Confirm Payment" (Disabled until Remaining Balance is $0).</li>
            <li><strong>Secondary:</strong> "Mark as Due" (Credit basis).</li>
          </ul>
        }
        userFlow={
          <p>
            Bill is Rs. 1500. Patient prefers split. Cashier hits "Split Payment" → Selects "Cash" and types Rs. 500 → Remaining is Rs. 1000. Cashier selects "UPI" → QR appears on secondary customer-facing screen. Patient scans. System detects payment via webhook → Prints receipt automatically.
          </p>
        }
      />

      <SpecCard
        title="Refund Workflow"
        purpose={
          <p>
            A secure, auditable process for returning money to patients due to cancelled appointments, unavailable lab services, or dissatisfaction.
          </p>
        }
        actions={
          <ul className="list-disc pl-4 space-y-1">
            <li><strong>Locate Transaction:</strong> Search by Bill ID or Patient Phone.</li>
            <li><strong>Initiate Refund:</strong> Select specific line items to refund (e.g., just refunding the X-Ray, not the Consultation) or refund the entire bill.</li>
            <li><strong>Refund Method:</strong> Determines if cash is returned from the till, or if an API call is made to a payment gateway to reverse a card/UPI charge.</li>
          </ul>
        }
        filters={
          <ul className="list-disc pl-4 space-y-1">
            <li><strong>Approval Gate:</strong> Attempting to refund an amount &gt; $50 may trigger an authorization request to the Clinic Manager's mobile app.</li>
          </ul>
        }
        userFlow={
          <p>
            Patient cancels appointment. Cashier searches Bill ID → Selects the Consultation fee line item → Clicks "Refund to Original Source (Card)" → Enters reason "Patient Emergency" → Hits Submit → System confirms API reversal and prints refund slip.
          </p>
        }
      />
    </div>
  );
}
