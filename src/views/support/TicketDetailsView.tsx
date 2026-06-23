import React from 'react';
import { SpecCard } from '../../components/SpecCard';

export default function TicketDetailsView() {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-secondary mb-2">Ticket Details & Interaction</h2>
        <p className="text-slate-500 mb-8 max-w-3xl">
          Detailed specifications for the individual ticket view, facilitating chat-like communication between the clinic staff and the ClinicOS support engineers.
        </p>
      </div>

      <SpecCard
        title="Ticket Details Interface"
        purpose={
          <p>
            Provides a complete history of a specific issue, acting as a collaborative thread until resolution.
          </p>
        }
        widgets={
          <ul className="list-disc pl-4 space-y-1">
            <li><strong>Ticket Header:</strong> Displays Ticket ID, Status badge (e.g., Waiting on Customer), Priority, and the assigned Support Agent's name/avatar.</li>
            <li><strong>Context Sidebar:</strong> Shows original submission details, browser/OS version (auto-captured), and associated attachments.</li>
          </ul>
        }
        charts={
          <ul className="list-disc pl-4 space-y-1">
            <li><strong>Resolution Timeline:</strong> A vertical timeline showing status changes (e.g., Created → Assigned → In Progress → Resolved).</li>
          </ul>
        }
        actions={
          <ul className="list-disc pl-4 space-y-1">
            <li><strong>Conversation Thread:</strong> Chat-like interface for back-and-forth communication with support. Supports markdown and inline image viewing.</li>
            <li><strong>Accept/Reject Solution:</strong> If the agent marks it as resolved, the user can click "Yes, this is fixed" or "No, I still need help" to reopen.</li>
            <li><strong>Escalate Ticket:</strong> Button available if the SLA has been breached or the issue has become critical.</li>
          </ul>
        }
        userFlow={
          <p>
            User receives email "Support has replied" → Clicks link → Opens Ticket Details View → Reads agent's instruction to clear cache → User clears cache, it works → User replies "Fixed, thank you." → Clicks "Mark as Resolved".
          </p>
        }
        responsive={
          <ul className="list-disc pl-4 space-y-1">
            <li><strong>Mobile:</strong> Looks very similar to a standard messaging app (like WhatsApp or iMessage) for intuitive communication.</li>
            <li><strong>Desktop:</strong> Takes advantage of wider screens to maintain the context sidebar alongside the chat thread.</li>
          </ul>
        }
      />
    </div>
  );
}
