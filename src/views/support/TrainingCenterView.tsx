import React from 'react';
import { SpecCard } from '../../components/SpecCard';

export default function TrainingCenterView() {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-secondary mb-2">Training Center</h2>
        <p className="text-slate-500 mb-8 max-w-3xl">
          Detailed specifications for onboarding new clinic staff, offering structured courses, video learning, and live training session bookings.
        </p>
      </div>

      <SpecCard
        title="Learning Management & Onboarding"
        purpose={
          <p>
            Facilitates seamless onboarding of new doctors and receptionists without requiring hand-holding from the clinic management or ClinicOS support team.
          </p>
        }
        widgets={
          <ul className="list-disc pl-4 space-y-1">
            <li><strong>My Progress Tracking:</strong> A visual completion meter showing how far the user is through their assigned "New Hire" track.</li>
            <li><strong>Upcoming Live Webinars:</strong> Schedule of live Q&A sessions or feature showcases hosted by ClinicOS.</li>
          </ul>
        }
        tables={
          <ul className="list-disc pl-4 space-y-1">
            <li><strong>Course Catalog:</strong> List of available training modules (e.g., "Mastering the Doctor EMR", "Advanced Billing & Insurance").</li>
          </ul>
        }
        actions={
          <ul className="list-disc pl-4 space-y-1">
            <li><strong>Video Player Integration:</strong> Embedded, chaptered video player for watching tutorials.</li>
            <li><strong>Request 1-on-1 Training:</strong> Modal to book a dedicated 30-minute Zoom session with an onboarding specialist.</li>
            <li><strong>Interactive Walkthroughs:</strong> Launch in-app guided tours (tooltips that overlay on the actual product UI).</li>
          </ul>
        }
        userFlow={
          <p>
            A new nurse log in for the first time → "Welcome to ClinicOS" modal appears → Directs them to the Training Center → Nurse watches a 5-minute "Triage Workflow" video → Completes the module → Progress bar updates to 100%.
          </p>
        }
      />
    </div>
  );
}
