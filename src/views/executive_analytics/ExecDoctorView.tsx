import React from 'react';
import { SpecCard } from '../../components/SpecCard';

export default function ExecDoctorView() {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-secondary mb-2">Clinical Performance</h2>
        <p className="text-slate-500 mb-8 max-w-3xl">
          Analytics to evaluate the efficiency, utilization, and revenue generation of the medical staff.
        </p>
      </div>

      <SpecCard
        title="Provider Utilization & Efficiency"
        purpose={
          <p>
            Ensures that expensive medical talent is being utilized optimally without suffering from burnout. Provides macro-level insights for hiring decisions.
          </p>
        }
        widgets={
          <ul className="list-disc pl-4 space-y-1">
            <li><strong>Overall Capacity Utilization:</strong> % of available clinical slots booked vs empty globally or per doctor.</li>
            <li><strong>Average Consult Time:</strong> Benchmarked against clinic standards.</li>
            <li><strong>Wait Time Impact:</strong> Correlation between specific doctors and waiting room delays.</li>
          </ul>
        }
        charts={
          <ul className="list-disc pl-4 space-y-1">
            <li><strong>Utilization Matrix (Heatmap):</strong> Days of the week vs Hours, colored by Doctor busyness across the clinic.</li>
            <li><strong>Doctor Efficacy (Scatter Plot):</strong> X-axis: Consult Volume, Y-axis: Patient NPS, Bubble Size: Revenue Generated.</li>
          </ul>
        }
        tables={
          <ul className="list-disc pl-4 space-y-1">
            <li><strong>Provider Leaderboard:</strong> Columns: Doctor Name, Specialty, Patients Seen, Gross Billed, Rx Conversion Rate.</li>
          </ul>
        }
        filters={
          <ul className="list-disc pl-4 space-y-1">
            <li>Filter by Specialty (e.g., compare only Orthopedics).</li>
            <li>Time Window.</li>
          </ul>
        }
        actions={
          <ul className="list-disc pl-4 space-y-1">
            <li>Export Provider Scorecards for 1-on-1 reviews.</li>
          </ul>
        }
      />
    </div>
  );
}
