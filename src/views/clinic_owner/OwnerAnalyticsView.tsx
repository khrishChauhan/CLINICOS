import React from 'react';
import { SpecCard } from '../../components/SpecCard';

export default function OwnerAnalyticsView() {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-secondary mb-2">Clinical Analytics</h2>
        <p className="text-slate-500 mb-8 max-w-3xl">
          Detailed specifications for monitoring patient demographics, retention, and doctor performance metrics.
        </p>
      </div>

      <SpecCard
        title="Patient Analytics"
        purpose={
          <p>
            Understand patient demographics, acquisition channels, retention rates, and clinical outcomes to optimize marketing and patient care.
          </p>
        }
        widgets={
          <ul className="list-disc pl-4 space-y-1">
            <li><strong>New vs Returning:</strong> Ratio of new registrations to follow-up visits.</li>
            <li><strong>Patient Satisfaction (NPS):</strong> Average rating from post-visit feedback SMS.</li>
            <li><strong>No-Show Rate:</strong> Percentage of appointments missed without cancellation.</li>
            <li><strong>Total Registered Patients:</strong> Lifetime database size.</li>
          </ul>
        }
        charts={
          <ul className="list-disc pl-4 space-y-1">
            <li><strong>Patient Age/Gender Demographics (Bar Chart):</strong> Visual breakdown of clinic's primary patient base.</li>
            <li><strong>Acquisition Source (Pie Chart):</strong> Walk-in, Google Maps, Practo, Referral, etc.</li>
            <li><strong>Disease/Diagnosis Heatmap:</strong> Most common ICC/diagnosis codes recorded this month.</li>
          </ul>
        }
        filters={
          <ul className="list-disc pl-4 space-y-1">
            <li>Time Period (Last 30 days, Year-to-Date).</li>
            <li>Specialty/Department.</li>
          </ul>
        }
        actions={
          <ul className="list-disc pl-4 space-y-1">
            <li>Generate Demographics Report.</li>
            <li>Export list of "At-Risk" patients (e.g., missed 2+ chronic care follow-ups).</li>
          </ul>
        }
        userFlow={
          <p>
            Owner reviews Monthly Patient Analytics → Notices "No-Show Rate" has spiked by 5% → Checks "Acquisition Source" and identifies issues with third-party app bookings → Decides to implement stricter SMS confirmation protocols.
          </p>
        }
        responsive={
          <ul className="list-disc pl-4 space-y-1">
            <li><strong>Mobile:</strong> Focuses on top-level metrics (New vs Returning, NPS). Complex demographic charts are scrollable horizontally.</li>
            <li><strong>Desktop:</strong> Multi-chart dashboard layout allowing side-by-side comparison of demographics and acquisition channels.</li>
          </ul>
        }
      />

      <SpecCard
        title="Doctor Analytics"
        purpose={
          <p>
            Evaluate medical staff efficiency, patient load, revenue generation, and prescription patterns to ensure optimal clinic productivity.
          </p>
        }
        tables={
          <ul className="list-disc pl-4 space-y-1">
            <li><strong>Provider Performance Matrix:</strong> Columns: Doctor Name, Patients Seen, Avg Consultation Time, Revenue Generated, Patient NPS, Follow-up Rate.</li>
          </ul>
        }
        charts={
          <ul className="list-disc pl-4 space-y-1">
            <li><strong>Consultation Time Scatter Plot:</strong> Compares doctors based on average time spent per patient vs. revenue.</li>
            <li><strong>Workload Distribution (Radar Chart):</strong> Visualizes how patient load is distributed among available doctors.</li>
          </ul>
        }
        filters={
          <ul className="list-disc pl-4 space-y-1">
            <li>Date Range.</li>
            <li>Department (e.g., compare only Pediatricians).</li>
            <li>Employment Type (Full-time vs. Visiting Consultants).</li>
          </ul>
        }
        actions={
          <ul className="list-disc pl-4 space-y-1">
            <li>Download Individual Performance Review PDF.</li>
            <li>Adjust Doctor Consultation Slots/Schedule based on load.</li>
          </ul>
        }
        userFlow={
          <p>
            Owner prepares for quarterly reviews → Opens Doctor Analytics → Filters by "Quarter 1" → Exports "Provider Performance Matrix" → Uses data on average consultation time and patient NPS during 1-on-1 feedback sessions.
          </p>
        }
        responsive={
          <ul className="list-disc pl-4 space-y-1">
            <li><strong>Mobile:</strong> Performance matrix table switches to a structured card layout for each doctor.</li>
            <li><strong>Desktop:</strong> Detailed data grid with sortable columns and expandable rows for deeper analysis of specific medical categories treated by the doctor.</li>
          </ul>
        }
      />
    </div>
  );
}
