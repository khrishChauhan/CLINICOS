import React from 'react';
import { SpecCard } from '../../components/SpecCard';

export default function SuperAdminCoreView() {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-secondary mb-2">Core Telemetry & Analytics</h2>
        <p className="text-slate-500 mb-8 max-w-3xl">
          Detailed specifications for the primary overview and revenue analytics modules. These pages provide high-level metrics required by the founders and business managers.
        </p>
      </div>

      <SpecCard
        title="Dashboard (Global Overview)"
        purpose={
          <p>
            The central command center for Super Admins. It offers a 10,000-foot view of the entire SaaS platform's health, active tenants (clinics), real-time user activity, and immediate operational alerts.
          </p>
        }
        widgets={
          <ul className="list-disc pl-4 space-y-1">
            <li><strong>Total MRR:</strong> Aggregated Monthly Recurring Revenue with MoM % change.</li>
            <li><strong>Active Clinics:</strong> Total number of onboarded and active clinics.</li>
            <li><strong>Total Doctors/Users:</strong> Global user count across all tenants.</li>
            <li><strong>System Load/Health:</strong> Instant red/green/yellow indicator of platform uptime.</li>
          </ul>
        }
        tables={
          <ul className="list-disc pl-4 space-y-1">
            <li><strong>Recent Onboardings:</strong> Table showing the latest 5 clinics joined, their plan, and setup status.</li>
            <li><strong>Active Alerts:</strong> A streamlined table highlighting system anomalies or high-severity support tickets.</li>
          </ul>
        }
        charts={
          <ul className="list-disc pl-4 space-y-1">
            <li><strong>Platform Growth (Line):</strong> Number of active users/clinics over the last 30/90 days.</li>
            <li><strong>Usage Heatmap:</strong> API/Server activity mapped against hours of the day to identify peak usage.</li>
          </ul>
        }
        filters={
          <ul className="list-disc pl-4 space-y-1">
            <li>Date Range Picker (Today, Last 7 Days, Last 30 Days, YTD).</li>
            <li>Geographical Region (if deployed across multiple regions).</li>
          </ul>
        }
        actions={
          <ul className="list-disc pl-4 space-y-1">
            <li>Refresh Data (force cache bypass).</li>
            <li>Generate Executive Report (PDF/CSV export).</li>
          </ul>
        }
        buttons={
          <ul className="list-disc pl-4 space-y-1">
            <li><strong>Primary:</strong> "Add New Clinic" (Quick action for onboarding).</li>
            <li><strong>Secondary:</strong> "View System Health" (Jumps to monitoring).</li>
          </ul>
        }
        userFlow={
          <ol className="list-decimal pl-4 space-y-1">
            <li>User logs in and lands on the Dashboard.</li>
            <li>Scans the top numeric widgets to gauge business health.</li>
            <li>Checks the System Load indicator. If warning/red, clicks through to Server Monitoring.</li>
            <li>Reviews the 'Recent Onboardings' table to ensure operations team is progressing smoothly.</li>
          </ol>
        }
        responsive={
          <ul className="list-disc pl-4 space-y-1">
            <li><strong>Mobile:</strong> Widgets stack vertically (1 column). Charts collapse to simplified sparklines. Tables hide non-essential columns (e.g., plan type).</li>
            <li><strong>Tablet:</strong> 2-column grid for widgets. Full charts visible but scrollable tables.</li>
            <li><strong>Desktop:</strong> 4-column Bento grid. All data persistently visible without scrolling.</li>
          </ul>
        }
      />

      <SpecCard
        title="Revenue Analytics"
        purpose={
          <p>
            Provides deep financial insights into subscription billing, revenue churn, upgrades, downgrades, and overall SaaS monetization metrics. Directly integrates with Stripe/billing providers.
          </p>
        }
        widgets={
          <ul className="list-disc pl-4 space-y-1">
            <li><strong>ARR / MRR:</strong> Current Annual/Monthly Recurring Revenue.</li>
            <li><strong>Churn Rate:</strong> Percentage of revenue lost in the rolling 30 days.</li>
            <li><strong>ARPU:</strong> Average Revenue Per Unit (Clinic).</li>
            <li><strong>Failed Charges:</strong> Sum of payment failures requiring manual intervention.</li>
          </ul>
        }
        tables={
          <ul className="list-disc pl-4 space-y-1">
            <li><strong>Transaction Ledger:</strong> Real-time feed of all successful and failed transactions across all clinics. Columns: Clinic, Amount, Status, Plan, Date.</li>
            <li><strong>Upcoming Renewals:</strong> Clinics up for annual/monthly renewal in the next 7 days.</li>
          </ul>
        }
        charts={
          <ul className="list-disc pl-4 space-y-1">
            <li><strong>Revenue Trajectory (Area Chart):</strong> Cumulative revenue over time vs. Target projection.</li>
            <li><strong>Plan Distribution (Donut Chart):</strong> Revenue split by Free/Pro/Enterprise tiers.</li>
          </ul>
        }
        filters={
          <ul className="list-disc pl-4 space-y-1">
            <li>Filter by Plan Tier (Pro, Enterprise).</li>
            <li>Filter by Cohort (Sign up month/year).</li>
            <li>Transaction Status (Success, Failed, Refunded).</li>
          </ul>
        }
        actions={
          <ul className="list-disc pl-4 space-y-1">
            <li>Export Ledger to CSV/QuickBooks format.</li>
            <li>Retry failed charges in bulk.</li>
            <li>Issue manual refund.</li>
          </ul>
        }
        buttons={
          <ul className="list-disc pl-4 space-y-1">
            <li><strong>Primary:</strong> "Export Financials" (Icon: Download).</li>
            <li><strong>Destructive:</strong> "Process Refund" (Inside table row context menu).</li>
          </ul>
        }
        userFlow={
          <ol className="list-decimal pl-4 space-y-1">
            <li>Finance Admin navigates to Revenue Analytics.</li>
            <li>Filters by "Failed Charges" to identify collections issues.</li>
            <li>Clicks "Retry Payment" on individual table rows or contacts the clinic admin directly.</li>
            <li>Generates End-of-Month CSV export for accounting.</li>
          </ol>
        }
        responsive={
          <ul className="list-disc pl-4 space-y-1">
            <li><strong>Mobile:</strong> Key metrics (MRR, Churn) fixed to top. Donut charts become bar arrays. Horizontal scrolling required for transaction ledger.</li>
            <li><strong>Desktop:</strong> Dashboard layout emphasizing area charts. Side panel reveals individual invoice details when a transaction is clicked.</li>
          </ul>
        }
      />
    </div>
  );
}
