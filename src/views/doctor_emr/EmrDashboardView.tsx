import React from 'react';
import { SpecCard } from '../../components/SpecCard';

export default function EmrDashboardView() {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-secondary mb-2">Doctor Dashboard</h2>
        <p className="text-slate-500 mb-8 max-w-3xl">
          Detailed specifications for the Doctor's daily landing page, providing an overview of their shift, patient queue, and pending clinical tasks.
        </p>
      </div>

      <SpecCard
        title="Doctor Dashboard (Day View)"
        purpose={
          <p>
            Acts as the cockpit for the doctor. It organizes their daily schedule, highlights urgent tasks (like reviewing critical lab results), and manages their immediate patient queue without administrative clutter.
          </p>
        }
        widgets={
          <ul className="list-disc pl-4 space-y-1">
            <li><strong>Current Patient:</strong> The patient currently checked in and waiting outside the door.</li>
            <li><strong>Up Next:</strong> The next 3 patients in the queue to allow mental preparation.</li>
            <li><strong>Pending Reports:</strong> Number of lab/radiology reports uploaded today that require the doctor's review and sign-off.</li>
            <li><strong>Day's Progress:</strong> Progress bar showing completed consultations vs. total scheduled.</li>
          </ul>
        }
        tables={
          <ul className="list-disc pl-4 space-y-1">
            <li><strong>Today's Agenda:</strong> Columns: Time, Patient Name, Visit Type (New/Follow-up), Status (Waiting, In-Progress, Completed), Quick Actions.</li>
            <li><strong>Action Items:</strong> A mini-inbox of tasks like "Review MRI for Patient X" or "Approve refill request for Patient Y".</li>
          </ul>
        }
        actions={
          <ul className="list-disc pl-4 space-y-1">
            <li><strong>Start Consultation:</strong> Instantly opens the EMR screen for the selected patient.</li>
            <li><strong>Mark as No-Show:</strong> Removes the patient from the active queue.</li>
            <li><strong>Call Patient (Token):</strong> Triggers the waiting room TV/Audio system.</li>
          </ul>
        }
        buttons={
          <ul className="list-disc pl-4 space-y-1">
            <li><strong>Huge Primary Button:</strong> "Start Next Consultation" (Auto-loads the next waiting patient).</li>
          </ul>
        }
        userFlow={
          <p>
            Doctor arrives → Logs in to Dashboard → Sees 5 patients waiting → Clicks "Start Next Consultation" → Token screen chimes in waiting room → Doctor is taken directly to the Consultation EMR screen.
          </p>
        }
        responsive={
          <ul className="list-disc pl-4 space-y-1">
            <li><strong>Tablet (iPad Pro):</strong> Highly optimized for tablet use as many doctors prefer walking into rooms with iPads. Large touch targets and split-view agenda.</li>
            <li><strong>Desktop:</strong> Standard layout tracking the agenda on one side and action items on the other.</li>
          </ul>
        }
      />
    </div>
  );
}
