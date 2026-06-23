import React from 'react';
import { SpecCard } from '../../components/SpecCard';

export default function ExecRevenueView() {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-secondary mb-2">Revenue & Financial Analytics</h2>
        <p className="text-slate-500 mb-8 max-w-3xl">
          C-suite level financial dashboard. Tracks macro revenue trends, department profitability, and predictive financial health.
        </p>
      </div>

      <SpecCard
        title="Revenue & Profitability"
        purpose={
          <p>
            High-level financial KPIs required by founders and investors to gauge the clinic's monetary health.
          </p>
        }
        widgets={
          <ul className="list-disc pl-4 space-y-1">
            <li><strong>Gross Revenue:</strong> Total billed volume.</li>
            <li><strong>Net Collections:</strong> Actual cash/bank deposits received.</li>
            <li><strong>Average Revenue Per Patient (ARPP):</strong> MoM growth.</li>
            <li><strong>Forecasted Q-End Revenue:</strong> Predictive model estimating the quarter's finish based on current run rate.</li>
          </ul>
        }
        charts={
          <ul className="list-disc pl-4 space-y-1">
            <li><strong>Revenue vs Target (Combo Chart):</strong> Bar chart for actuals, Line chart for targets/budget.</li>
            <li><strong>Collections by Tender (Stacked Bar):</strong> Cash vs Card vs UPI vs Insurance over time.</li>
          </ul>
        }
        actions={
          <ul className="list-disc pl-4 space-y-1">
            <li>Download Auditable Financial Pack (PDF).</li>
            <li>Drill down into specific days or branches.</li>
          </ul>
        }
      />

      <SpecCard
        title="Departmental Performance"
        purpose={
          <p>
            Breaks down revenue by service line (e.g., Pharmacy vs Consultations vs Procedures) to identify the most lucrative business units.
          </p>
        }
        tables={
          <ul className="list-disc pl-4 space-y-1">
            <li><strong>Unit Economics Table:</strong> Columns: Department, Gross Revenue, Direct Costs, Margin %, YoY Growth.</li>
          </ul>
        }
        charts={
          <ul className="list-disc pl-4 space-y-1">
            <li><strong>Revenue Contribution (Treemap):</strong> Visual representation of which departments drive the most money.</li>
          </ul>
        }
      />
    </div>
  );
}
