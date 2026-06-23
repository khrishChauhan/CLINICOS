import React from 'react';
import { SpecCard } from '../../components/SpecCard';

export default function KnowledgeBaseView() {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-secondary mb-2">Knowledge Base & FAQs</h2>
        <p className="text-slate-500 mb-8 max-w-3xl">
          Detailed specifications for the self-service documentation portal, empowering users to solve standard problems without opening a ticket.
        </p>
      </div>

      <SpecCard
        title="Documentation Portal"
        purpose={
          <p>
            A searchable, structured repository of how-to guides, video tutorials, and common troubleshooting steps for all modules in the software.
          </p>
        }
        widgets={
          <ul className="list-disc pl-4 space-y-1">
            <li><strong>Hero Search Bar:</strong> Prominent, Google-style search input that uses autocomplete and semantic search to understand intent (e.g., matching "how to refund" with "Payment Reversals").</li>
            <li><strong>Most Popular Articles:</strong> Dynamically updated list of trending topics based on what other clinics are searching for right now.</li>
            <li><strong>Category Grid:</strong> Visual tiles for browsing by topic (Billing, EMR, Inventory, Setup & Config).</li>
          </ul>
        }
        actions={
          <ul className="list-disc pl-4 space-y-1">
            <li><strong>Article Viewer:</strong> Clean, distraction-free reading experience. Includes table of contents for long guides.</li>
            <li><strong>Feedback Mechanism:</strong> "Was this article helpful? (Yes/No)" at the bottom of every page to help improve documentation quality.</li>
            <li><strong>Print/Export:</strong> Ability to download articles as PDFs for offline clinic binders.</li>
          </ul>
        }
        userFlow={
          <p>
            New receptionist doesn't know how to split a payment → Opens Knowledge Base → Types "split payment" → Clicks top result "How to accept partial cash/card payments" → Reads step-by-step guide with GIFs → Solves problem independently.
          </p>
        }
        responsive={
          <ul className="list-disc pl-4 space-y-1">
            <li><strong>Mobile:</strong> Emphasizes the search bar and collapses categories into a hamburger menu.</li>
            <li><strong>Desktop:</strong> Multi-pane layout with a sticky navigation tree on the left for exploring deep documentation hierarchies.</li>
          </ul>
        }
      />
    </div>
  );
}
