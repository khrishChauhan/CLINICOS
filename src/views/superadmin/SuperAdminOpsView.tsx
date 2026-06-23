import React from 'react';
import { SpecCard } from '../../components/SpecCard';

export default function SuperAdminOpsView() {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-secondary mb-2">Platform Operations</h2>
        <p className="text-slate-500 mb-8 max-w-3xl">
          Detailed specifications for managing customer success, marketing announcements, feature flags, and global knowledge distribution.
        </p>
      </div>

      <SpecCard
        title="Support Tickets"
        purpose={
          <p>
            Centralized helpdesk for resolving tenant issues. Integrates with the in-app support module used by Clinic Admins and Doctors.
          </p>
        }
        widgets={
          <ul className="list-disc pl-4 space-y-1">
            <li><strong>Open Tickets:</strong> Count of unresolved inquiries.</li>
            <li><strong>Avg Resolution Time:</strong> Metric tracking support team efficiency.</li>
            <li><strong>SLA Breaches:</strong> Tickets older than 24h requiring immediate escalation.</li>
          </ul>
        }
        tables={
          <ul className="list-disc pl-4 space-y-1">
            <li><strong>Ticket Inbox:</strong> Columns: Ticket ID, Severity, Subject, Requesting Clinic, Assigned Agent, Status, Last Updated.</li>
          </ul>
        }
        filters={
          <ul className="list-disc pl-4 space-y-1">
            <li>Filter by Severity (Low, Medium, High, Critical).</li>
            <li>Filter by Status (Open, Pending, Resolved).</li>
            <li>Assignee (Me, Unassigned, Specific Agent).</li>
          </ul>
        }
        actions={
          <ul className="list-disc pl-4 space-y-1">
            <li>Reply to Ticket (Rich text editor).</li>
            <li>Change Status or Escalate.</li>
            <li>Attach internal notes (invisible to tenant).</li>
          </ul>
        }
        buttons={
          <ul className="list-disc pl-4 space-y-1">
            <li><strong>Primary:</strong> "Submit Reply"</li>
            <li><strong>Secondary:</strong> "Resolve Ticket"</li>
          </ul>
        }
        userFlow={
          <p>
            Support Agent logs in → Filters by "Severity: Critical" → Selects top ticket → Reads issue → Adds internal note for dev team → Replies to customer asking for screenshot → Marks status as "Pending".
          </p>
        }
        responsive={
          <p>
            Dual-pane layout on desktop (List on left, Chat thread on right). Mobile uses standard drill-down navigation (List view → Tap into thread).
          </p>
        }
      />

      <SpecCard
        title="Feature Management & Announcements"
        purpose={
          <p>
            Controls the rollout of new software modules (Feature Flags) and pushes global notification banners to all active tenants.
          </p>
        }
        tables={
          <ul className="list-disc pl-4 space-y-1">
            <li><strong>Feature Flags:</strong> Columns: Feature Name, Key, Rollout % (0-100%), Status (Enabled/Disabled).</li>
            <li><strong>Broadcasts:</strong> Columns: Announcement Title, Target Audience (All, specific plan), Go-Live Date, Status.</li>
          </ul>
        }
        actions={
          <ul className="list-disc pl-4 space-y-1">
            <li>Toggle Feature Flag globally or for specific tenant IDs (Beta testing).</li>
            <li>Create Announcement Banner (Text, Color, CTA Link).</li>
          </ul>
        }
        buttons={
          <ul className="list-disc pl-4 space-y-1">
            <li><strong>Primary:</strong> "New Broadcast" / "Create Flag".</li>
            <li><strong>Toggle Switch:</strong> Enable/Disable logic.</li>
          </ul>
        }
        userFlow={
          <p>
            Product manager creates "AI Diagnosis Module" flag → Sets rollout to 10% (Beta) → Creates Broadcast announcement linking to documentation → Broadcast appears in the header for beta users.
          </p>
        }
      />

      <SpecCard
        title="Knowledge Base & Software Updates"
        purpose={
          <p>
            Manages the central help documentation (FAQs, tutorials) and the changelog version history pushed to clients.
          </p>
        }
        widgets={
          <ul className="list-disc pl-4 space-y-1">
            <li><strong>Articles Published:</strong> Total KB count.</li>
            <li><strong>Current App Version:</strong> e.g., v2.4.1.</li>
          </ul>
        }
        tables={
          <ul className="list-disc pl-4 space-y-1">
            <li><strong>Article Directory:</strong> Columns: Title, Category, Views, Last Edited.</li>
            <li><strong>Changelog Releases:</strong> Columns: Version Number, Release Date, Status (Draft, Published).</li>
          </ul>
        }
        actions={
          <ul className="list-disc pl-4 space-y-1">
            <li>WYSIWYG Editor for Knowledge Base articles (Supports Markdown & Images).</li>
            <li>Publish new Release Note (Triggers 'Update Available' UI for web users).</li>
          </ul>
        }
        buttons={
          <ul className="list-disc pl-4 space-y-1">
            <li><strong>Primary:</strong> "Draft Release", "New Article".</li>
          </ul>
        }
        userFlow={
          <p>
            New software update deployed → Admin pens v2.4.2 Release Notes → Hits "Publish Release" → All connected browsers receive WebSockets ping indicating new version is ready to refresh.
          </p>
        }
        responsive={
          <p>
            Article editor requires desktop for rich text formatting. Changelog lists are fully responsive on mobile.
          </p>
        }
      />
    </div>
  );
}
