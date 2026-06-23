import React from 'react';
import { SpecCard } from '../../components/SpecCard';

export default function SupportDashboardView() {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-secondary mb-2">Support & Helpdesk Dashboard</h2>
        <p className="text-slate-500 mb-8 max-w-3xl">
          Detailed specifications for the primary support dashboard where clinic staff can request help, report bugs, ask for features, and track ongoing issues.
        </p>
      </div>

      <SpecCard
        title="Support Command Center"
        purpose={
          <p>
            The main hub for interacting with the ClinicOS customer success and technical support teams. Designed to provide instant visibility into system status and active queries.
          </p>
        }
        widgets={
          <ul className="list-disc pl-4 space-y-1">
            <li><strong>Active System Status:</strong> Real-time indicator of ClinicOS uptime (e.g., "All Systems Operational" or "Degraded Performance").</li>
            <li><strong>My Open Tickets:</strong> Count of unresolved inquiries submitted by the current user.</li>
            <li><strong>Pending Responses:</strong> Tickets that require the user's reply or clarification.</li>
            <li><strong>Latest Platform Updates:</strong> Brief ticker or banner of the most recent feature releases.</li>
          </ul>
        }
        buttons={
          <ul className="list-disc pl-4 space-y-1">
            <li><strong>Massive Primary Action:</strong> "Create Support Ticket" (Opens modal).</li>
            <li><strong>Secondary Action:</strong> "Request Remote Assistance" (Integrates with a tool like TeamViewer/AnyDesk for immediate help).</li>
          </ul>
        }
        tables={
          <ul className="list-disc pl-4 space-y-1">
            <li><strong>Ticket Ledger (Status Tracking):</strong> Columns: Ticket ID, Subject, Type (Bug/Feature/Training), Status (Open, Pending, Resolved), Assigned To, Last Updated.</li>
          </ul>
        }
        userFlow={
          <p>
            User experiences a billing glitch → Opens Support Dashboard → Glances at "System Status" to see if it's a known issue → Clicks "Create Support Ticket" → Selects "Bug Report" → Fills out details → Submits → Ticket appears immediately in the Ledger with an "Open" status.
          </p>
        }
        responsive={
          <ul className="list-disc pl-4 space-y-1">
            <li><strong>Desktop:</strong> Split-view layout allowing the user to browse their ticket ledger while keeping the knowledge base search prominent.</li>
            <li><strong>Mobile:</strong> Streamlined for immediate action (e.g., snapping a photo of an error screen and opening a ticket directly from the phone).</li>
          </ul>
        }
      />

      <SpecCard
        title="Create Ticket Workflow"
        purpose={
          <p>
            A guided process to ensure the user provides enough context (screenshots, steps to reproduce) so the support team can resolve issues rapidly.
          </p>
        }
        filters={
          <ul className="list-disc pl-4 space-y-1">
            <li><strong>Category Selection:</strong> Bug Report, Feature Request, Billing Inquiry, Training Request.</li>
            <li><strong>Severity Level:</strong> Low (Question), Medium (Workaround exists), High (Blocking work), Critical (System down).</li>
          </ul>
        }
        actions={
          <ul className="list-disc pl-4 space-y-1">
            <li><strong>Rich Text Editor:</strong> Formatting options for describing the issue clearly.</li>
            <li><strong>Attachment Zone:</strong> Drag-and-drop area for screenshots, screen recordings, or error logs.</li>
            <li><strong>Auto-Suggested Articles:</strong> As the user types their issue, the system queries the knowledge base and suggests articles that might resolve the issue before ticket submission.</li>
          </ul>
        }
      />
    </div>
  );
}
