import React from 'react';
import { SpecCard } from '../../components/SpecCard';

export default function OwnerFinanceSupportView() {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-secondary mb-2">Finance & Support</h2>
        <p className="text-slate-500 mb-8 max-w-3xl">
          Detailed specifications for formal reporting, taxation data, and interacting with the Click Aarambh platform support team.
        </p>
      </div>

      <SpecCard
        title="Financial Reports"
        purpose={
          <p>
            A dedicated repository for formal, legally-compliant financial documents. Different from live dashboards, this stores static, generated reports for auditors, tax filing, and investor updates.
          </p>
        }
        widgets={
          <ul className="list-disc pl-4 space-y-1">
            <li><strong>YTD Profitability:</strong> Year-to-Date net margin percentage.</li>
            <li><strong>Tax Liability:</strong> Estimated GST/Tax collected and owed for the current quarter.</li>
            <li><strong>Pending Reconciliations:</strong> Mismatch between system bills and actual bank deposits.</li>
          </ul>
        }
        tables={
          <ul className="list-disc pl-4 space-y-1">
            <li><strong>Report Archive:</strong> Columns: Report Name, Type (P&L, Tax Summary, Balance Sheet), Generated Date, format (PDF/CSV), Action (Download).</li>
          </ul>
        }
        filters={
          <ul className="list-disc pl-4 space-y-1">
            <li>Financial Year / Quarter selection.</li>
            <li>Report Type (Revenue, Tax, Expense, Payroll Liabilities).</li>
          </ul>
        }
        actions={
          <ul className="list-disc pl-4 space-y-1">
            <li>Generate New Report (Triggers async generation with parameters).</li>
            <li>Download selected reports in bulk.</li>
            <li>Securely share report link with external auditor.</li>
          </ul>
        }
        buttons={
          <ul className="list-disc pl-4 space-y-1">
            <li><strong>Primary:</strong> "Generate Statement"</li>
          </ul>
        }
        userFlow={
          <p>
            Quarterly tax deadline approaches → Owner navigates to Financial Reports → Clicks "Generate Statement" → Selects "Tax Summary (Q3)" → System processes data → File appears in Archive → Owner clicks "Download PDF" and emails to accountant.
          </p>
        }
        responsive={
          <ul className="list-disc pl-4 space-y-1">
            <li><strong>Mobile:</strong> Focus on file retrieval. Owner can view list of archived reports and hit "Share" to send them via messaging apps or email directly from phone.</li>
            <li><strong>Desktop:</strong> Complex parameter selection for report generation is optimized here. Previewing large PDF statements within the browser.</li>
          </ul>
        }
      />

      <SpecCard
        title="Support Center (To Platform)"
        purpose={
          <p>
            The clinic owner's direct lifeline to the Click Aarambh ClinicOS support team. Used for technical issues, billing disputes, or feature requests.
          </p>
        }
        cards={
          <ul className="list-disc pl-4 space-y-1">
            <li><strong>System Status Banner:</strong> (e.g., "All Systems Operational" or "Degraded Performance in SMS Delivery").</li>
            <li><strong>Knowledge Base Search:</strong> Prominent search bar for self-help articles.</li>
          </ul>
        }
        tables={
          <ul className="list-disc pl-4 space-y-1">
            <li><strong>My Support Tickets:</strong> Columns: Ticket ID, Subject, Category (Tech/Billing/Account), Status (Open, Resolved, Waiting on you), Last Updated.</li>
          </ul>
        }
        filters={
          <ul className="list-disc pl-4 space-y-1">
            <li>Ticket Status (Open, Closed).</li>
          </ul>
        }
        actions={
          <ul className="list-disc pl-4 space-y-1">
            <li>Create New Support Ticket.</li>
            <li>Reply to existing ticket thread.</li>
            <li>Browse Platform Changelog/Updates.</li>
          </ul>
        }
        buttons={
          <ul className="list-disc pl-4 space-y-1">
            <li><strong>Primary:</strong> "Open New Ticket"</li>
            <li><strong>Ghost:</strong> "View Documentation"</li>
          </ul>
        }
        userFlow={
          <p>
            Owner encounters an error saving a patient file → Goes to Support Center → Searches Knowledge base first. No result → Clicks "Open New Ticket" → Attaches screenshot and describes issue → Submits → Ticket appears in 'My Support Tickets' table with 'Open' status.
          </p>
        }
        responsive={
          <ul className="list-disc pl-4 space-y-1">
            <li><strong>Mobile:</strong> Replaces table with mobile-friendly cards. Includes a floating action button (FAB) for quick ticket creation. Allows taking and attaching photos directly from the camera roll.</li>
            <li><strong>Desktop:</strong> Split view allowing the owner to read a knowledge base article on the left while drafting a ticket on the right.</li>
          </ul>
        }
      />
    </div>
  );
}
