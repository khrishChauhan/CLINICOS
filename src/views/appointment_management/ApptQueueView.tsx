import React from 'react';
import { SpecCard } from '../../components/SpecCard';

export default function ApptQueueView() {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-secondary mb-2">Queue & Token System</h2>
        <p className="text-slate-500 mb-8 max-w-3xl">
          Detailed specifications for managing the live patient waiting room, algorithmic queueing, and TV-displayed token numbers.
        </p>
      </div>

      <SpecCard
        title="Queue Dashboard"
        purpose={
          <p>
            The live, operational command center for the waiting room. Used by the head receptionist or waiting area manager to track who is currently in the clinic, their wait times, and their exact stage in the visit lifecycle.
          </p>
        }
        widgets={
          <ul className="list-disc pl-4 space-y-1">
            <li><strong>Total Waiting:</strong> Count of patients physically present but not yet consulting.</li>
            <li><strong>Average Wait Time:</strong> Live calculation (e.g., 22 mins). Turns red if SLA breached.</li>
            <li><strong>Longest Waiting:</strong> Highlights the patient who has been waiting the longest to prevent escalations.</li>
          </ul>
        }
        tables={
          <ul className="list-disc pl-4 space-y-1">
            <li><strong>Live Queue Matrix:</strong> Columns: Token #, Patient Name, Doctor, Check-in Time, Current Wait Duration, Stage (Triage, Waiting, In-Consultation, Billing).</li>
          </ul>
        }
        filters={
          <ul className="list-disc pl-4 space-y-1">
            <li>Filter by Doctor (Show only Doctor A's queue).</li>
            <li>Filter by Stage (Show only people at "Billing").</li>
          </ul>
        }
        actions={
          <ul className="list-disc pl-4 space-y-1">
            <li>Override Queue Position (Move VIP or Emergency patient to the top).</li>
            <li>Mark as "No-Show" (If called 3 times and absent).</li>
            <li>Send to Triage (Nurse checks vitals before doctor).</li>
          </ul>
        }
        userFlow={
          <p>
            Receptionist monitors Queue Dashboard → Notices Patient B has been waiting 45 minutes (row turns red) → Realizes Dr. Sharma is stuck in a procedure → Receptionist overrides queue to move Patient B to Dr. Medical Officer.
          </p>
        }
        responsive={
          <ul className="list-disc pl-4 space-y-1">
            <li><strong>Desktop:</strong> Dense, live-updating board with prominent color-coding for wait-time thresholds.</li>
            <li><strong>Mobile/Tablet:</strong> Used by floor managers walking the clinic. Shows large cards with elapsed time counters.</li>
          </ul>
        }
      />

      <SpecCard
        title="Token System (TV Display & Engine)"
        purpose={
          <p>
            The public-facing side of the queue management system. Drives overhead TV displays in the waiting area to announce token numbers dynamically, removing the need for shouting names.
          </p>
        }
        widgets={
          <ul className="list-disc pl-4 space-y-1">
            <li><strong>"Now Serving" Display:</strong> Massive typography showing Token Number and Room/Cabin Number.</li>
            <li><strong>Upcoming Tokens:</strong> Smaller sidebar showing the next 5 tokens to prepare patients.</li>
          </ul>
        }
        actions={
          <ul className="list-disc pl-4 space-y-1">
            <li><strong>Doctor Action:</strong> Doctor clicks "Call Next Patient" in their clinical view.</li>
            <li><strong>System Action:</strong> TV screen flashes, plays an audio chime ("Ding-dong, Token 42, please proceed to Cabin 3"), and updates the "Now Serving" widget.</li>
          </ul>
        }
        userFlow={
          <p>
            Patient completes registration → Given physical or SMS receipt with "Token A-14" → Patient sits. Later, TV chimes and displays "A-14 → Cabin 2" → Patient walks into Cabin 2.
          </p>
        }
        responsive={
          <ul className="list-disc pl-4 space-y-1">
            <li><strong>TV Display (1080p/4K):</strong> Ultra-high contrast, massive fonts. Dark mode optimal to reduce glare. No interactive elements; strictly read-only WebSockets driven view.</li>
          </ul>
        }
      />
    </div>
  );
}
