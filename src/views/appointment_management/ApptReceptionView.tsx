import React from 'react';
import { SpecCard } from '../../components/SpecCard';

export default function ApptReceptionView() {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-secondary mb-2">Reception Desk</h2>
        <p className="text-slate-500 mb-8 max-w-3xl">
          Detailed specifications for the Reception Dashboard, handling immediate front-desk workflows like walk-ins, check-ins, and online booking reconciliation.
        </p>
      </div>

      <SpecCard
        title="Reception Dashboard"
        purpose={
          <p>
            The dedicated, high-speed interface for front-desk staff. It combines elements of patient search, appointment verification, and payment collection into a single screen optimized for heavy keyboard use.
          </p>
        }
        widgets={
          <ul className="list-disc pl-4 space-y-1">
            <li><strong>Global Search Bar:</strong> Enormous, centrally placed input for scanning QR codes (UHID) or typing phone numbers.</li>
            <li><strong>Quick Stats:</strong> Walk-ins today, Online bookings awaiting check-in, Total cash collected.</li>
          </ul>
        }
        tables={
          <ul className="list-disc pl-4 space-y-1">
            <li><strong>Arrivals List:</strong> Patients holding an appointment for today who have not yet checked in.</li>
          </ul>
        }
        buttons={
          <ul className="list-disc pl-4 space-y-1">
            <li><strong>Massive Primary Action:</strong> "Register Walk-In" (F1 Shortcut).</li>
            <li><strong>Action:</strong> "Check-In Patient" (F2 Shortcut).</li>
          </ul>
        }
        userFlow={
          <p>
            Patient walks in → Receptionist asks if they have an appointment. Patient says yes. → Receptionist searches phone number → Record pops up → Clicks "Check-In" → System prints Token ticket → Patient goes to waiting area.
          </p>
        }
        responsive={
          <ul className="list-disc pl-4 space-y-1">
            <li><strong>Strictly Desktop Optimized:</strong> Receptionists use PCs or laptops. The UI focuses on keyboard shortcuts (Cmd/Ctrl + K hooks) to eliminate mouse dependency for speed.</li>
          </ul>
        }
      />

      <SpecCard
        title="Walk-In Registration Flow"
        purpose={
          <p>
            A highly compressed version of the full patient registration, designed to capture the bare minimum details required to generate a token and get the patient in the queue immediately.
          </p>
        }
        actions={
          <ul className="list-disc pl-4 space-y-1">
            <li>Captures only: Mobile Number, First Name, Last Name, Gender, and assigned Doctor/Department.</li>
            <li>Bypasses detailed demographics (address, insurance, history) which can be filled by the nurse later during triage.</li>
          </ul>
        }
        userFlow={
          <p>
            New patient walks in with acute pain → Receptionist initiates 'Fast Walk-In' → Types phone, name, selects 'Emergency' department → Hits Enter → Token is generated instantly. Total elapsed time: 15 seconds.
          </p>
        }
      />

      <SpecCard
        title="Online Booking Engine & Reconciliation"
        purpose={
          <p>
            The internal view of the public-facing patient booking portal. Allows reception to manage incoming web/app bookings, handle advance payment verifications, and resolve conflicts.
          </p>
        }
        tables={
          <ul className="list-disc pl-4 space-y-1">
            <li><strong>Online Requests Inbox:</strong> Columns: Request Time, Patient, Requested Slot, Payment Status, Auto-confirmed? (Yes/No), Actions (Approve/Reject).</li>
          </ul>
        }
        filters={
          <ul className="list-disc pl-4 space-y-1">
            <li>Filter by Payment Status (Paid online, Pay at clinic).</li>
            <li>Filter by Source (Clinic Website, Google Maps, Third-party aggregator).</li>
          </ul>
        }
        actions={
          <ul className="list-disc pl-4 space-y-1">
            <li>Manually approve an online booking (if auto-confirm is disabled).</li>
            <li>Send custom SMS indicating delay or conflict.</li>
          </ul>
        }
        userFlow={
          <p>
            Web booking arrives overnight → Receptionist logs in at 8 AM → Sees 4 pending web requests → Checks doctor's schedule → Approves 3, rejects 1 (doctor unavailable) → System automatically refunds and notifies the rejected patient.
          </p>
        }
      />
    </div>
  );
}
