import React from 'react';
import { SpecCard } from '../../components/SpecCard';

export default function SuperAdminInfraView() {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-secondary mb-2">Infrastructure & Security</h2>
        <p className="text-slate-500 mb-8 max-w-3xl">
          Detailed specifications for engineering and DevOps workflows. Covers system health, server load, database backups, and global audit logging.
        </p>
      </div>

      <SpecCard
        title="System Health & Server Monitoring"
        purpose={
          <p>
            Real-time observability into the cloud infrastructure. Tracks CPU, memory usage, API latencies, and node health across the deployment regions.
          </p>
        }
        widgets={
          <ul className="list-disc pl-4 space-y-1">
            <li><strong>Global Uptime:</strong> e.g., 99.999% over 30 days.</li>
            <li><strong>Avg API Latency:</strong> Real-time p95 latency (e.g., 142ms).</li>
            <li><strong>Active Nodes:</strong> Number of spun-up container instances.</li>
            <li><strong>Error Rate:</strong> Percentage of 5xx HTTP responses.</li>
          </ul>
        }
        charts={
          <ul className="list-disc pl-4 space-y-1">
            <li><strong>CPU/Memory Utilization (Time Series):</strong> Live-updating line charts tracking resource consumption.</li>
            <li><strong>Traffic Throughput (Bar):</strong> Requests per second (RPS) plotted against time.</li>
          </ul>
        }
        filters={
          <ul className="list-disc pl-4 space-y-1">
            <li>Time Window (Live 1m, 15m, 1h, 24h).</li>
            <li>Node/Region selector (e.g., asia-south-1).</li>
          </ul>
        }
        actions={
          <ul className="list-disc pl-4 space-y-1">
            <li>Restart unresponsive node instances.</li>
            <li>Trigger manual infrastructure scaling rules.</li>
            <li>Download raw server logs.</li>
          </ul>
        }
        buttons={
          <ul className="list-disc pl-4 space-y-1">
            <li><strong>Primary:</strong> "Restart Node" (Warning state).</li>
            <li><strong>Secondary:</strong> "Export Logs" (Ghost button).</li>
          </ul>
        }
        userFlow={
          <p>
            DevOps engineer receives automated PagerDuty alert regarding high latency → Opens System Health → Identifies CPU spike on Node-B → Clicks "Restart Node" → Chart normalizes.
          </p>
        }
        responsive={
          <p>
            Highly optimized for ultra-wide desktop monitors (NOC displays). On mobile, layout degrades to simple red/green status badges and critical alert banners only.
          </p>
        }
      />

      <SpecCard
        title="Database Backups"
        purpose={
          <p>
            Mission-critical interface for ensuring multi-tenant data is securely backed up, with point-in-time recovery capabilities and snapshot management.
          </p>
        }
        widgets={
          <ul className="list-disc pl-4 space-y-1">
            <li><strong>Last Successful Backup:</strong> Timestamp indicator.</li>
            <li><strong>Total Backup Size:</strong> e.g., 4.2 TB across AWS S3.</li>
            <li><strong>Next Scheduled:</strong> Countdown to next automated snapshot.</li>
          </ul>
        }
        tables={
          <ul className="list-disc pl-4 space-y-1">
            <li><strong>Snapshot Ledger:</strong> Columns: Snapshot ID, Creation Time, Type (Automated/Manual), Status, Size, Action (Restore).</li>
          </ul>
        }
        filters={
          <ul className="list-disc pl-4 space-y-1">
            <li>Filter by Snapshot Type (Manual vs Auto).</li>
            <li>Date range.</li>
          </ul>
        }
        actions={
          <ul className="list-disc pl-4 space-y-1">
            <li>Trigger Manual Snapshot.</li>
            <li>Initiate Point-in-Time Restore (Requires 2FA & Super Admin approval).</li>
            <li>Modify automated backup schedules.</li>
          </ul>
        }
        buttons={
          <ul className="list-disc pl-4 space-y-1">
            <li><strong>Primary:</strong> "Manual Snapshot" (+ icon).</li>
            <li><strong>Destructive:</strong> "Restore Database" (Strict verification prompt).</li>
          </ul>
        }
        userFlow={
          <p>
            Pre-deployment checklist requires backup → Admin clicks "Manual Snapshot" → Wait for progress bar (Status: Creating...) → Status turns green → Admin proceeds with deployment.
          </p>
        }
      />

      <SpecCard
        title="Audit Logs"
        purpose={
          <p>
            Immutable ledger tracking every administrative action, configuration change, and critical data access event across the entire platform for HIPAA/compliance auditing.
          </p>
        }
        tables={
          <ul className="list-disc pl-4 space-y-1">
            <li><strong>Global Event Stream:</strong> Columns: Timestamp, Actor (User/Admin ID), Action Performed, Target Resource, IP Address, Status.</li>
          </ul>
        }
        filters={
          <ul className="list-disc pl-4 space-y-1">
            <li>Search by Actor ID or Email.</li>
            <li>Filter by Action Category (e.g., BILLING_CHANGE, USER_DELETED, DB_RESTORE).</li>
            <li>Date and time constraints.</li>
          </ul>
        }
        actions={
          <ul className="list-disc pl-4 space-y-1">
            <li>Export Logs to encrypted CSV for compliance auditors.</li>
            <li>View deep JSON payload of specific event (Modal).</li>
          </ul>
        }
        userFlow={
          <p>
            Compliance audit triggered → Admin sets date range to Q3 → Filters for "SECURITY_EVENT" → Clicks "Export CSV" → Provides file to external auditing firm.
          </p>
        }
        responsive={
          <p>
            Desktop prioritized. Tabular data uses dense formatting to fit IP, User Agent, and Action identifiers on single lines to maximize vertical scanability.
          </p>
        }
      />
    </div>
  );
}
