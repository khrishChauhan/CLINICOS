import React from 'react';
import { SpecCard } from '../../components/SpecCard';

export default function ExecPatientView() {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-secondary mb-2">Patient Intelligence</h2>
        <p className="text-slate-500 mb-8 max-w-3xl">
          Enterprise-level analytics focusing on patient acquisition, retention, demographics, and clinical outcomes forecasting.
        </p>
      </div>

      <SpecCard
        title="Patient Acquisition & Growth"
        purpose={
          <p>
            Tracks the effectiveness of marketing channels and organic growth, forecasting future patient loads to aid in capacity planning.
          </p>
        }
        widgets={
          <ul className="list-disc pl-4 space-y-1">
            <li><strong>Total Active Patients:</strong> Growth MoM and YoY.</li>
            <li><strong>Customer Acquisition Cost (CAC):</strong> Estimated cost per new patient.</li>
            <li><strong>Churn Rate:</strong> Patients with no visits in 12+ months.</li>
            <li><strong>Predicted Next Month Intake:</strong> ML-driven forecast based on historical trends.</li>
          </ul>
        }
        charts={
          <ul className="list-disc pl-4 space-y-1">
            <li><strong>Acquisition Trend (Area Chart):</strong> New patients overlaid with marketing spend over the last 12 months.</li>
            <li><strong>Source Attribution (Funnel/Donut):</strong> Breakdown of where patients originate (Walk-in, Google, Referrals, Aggregators).</li>
          </ul>
        }
        filters={
          <ul className="list-disc pl-4 space-y-1">
            <li>Date Range (YTD, Q1, Last 12 Months).</li>
            <li>Location/Branch (for multi-clinic setups).</li>
          </ul>
        }
        actions={
          <ul className="list-disc pl-4 space-y-1">
            <li>Export growth report to CSV/PDF.</li>
            <li>Toggle overlay for "Target KPIs".</li>
          </ul>
        }
      />

      <SpecCard
        title="Demographics & Behavior"
        purpose={
          <p>
            Deep dive into who the patients are and how they interact with the clinic, enabling hyper-targeted services.
          </p>
        }
        charts={
          <ul className="list-disc pl-4 space-y-1">
            <li><strong>Age & Gender Pyramid:</strong> Visual distribution of the patient base.</li>
            <li><strong>Visit Frequency Distribution (Histogram):</strong> Shows how many patients visit 1x, 2x, 5x+ a year.</li>
            <li><strong>Geographic Heatmap:</strong> Map visualization showing patient origins based on zip code.</li>
          </ul>
        }
        tables={
          <ul className="list-disc pl-4 space-y-1">
            <li><strong>High-Value Patient Cohorts:</strong> Groupings of patients by lifetime value and frequency.</li>
          </ul>
        }
      />
    </div>
  );
}
