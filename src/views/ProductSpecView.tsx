import React from 'react';
import { FileText, LayoutGrid, Users, Calendar, Stethoscope, Wallet, Package, BarChart3, ShieldCheck, HelpCircle } from 'lucide-react';

export default function ProductSpecView() {
  return (
    <div className="space-y-12 animate-in fade-in duration-500 pb-20">
      
      {/* Header Section */}
      <div className="border-b border-slate-200 pb-8">
        <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 mb-4">
          Click Aarambh ClinicOS v1.0
        </h1>
        <p className="text-xl text-slate-500 max-w-4xl leading-relaxed">
          Complete Product Specification & Functional Requirements Document. This document serves as the master blueprint for the engineering, design, and product teams to implement the enterprise SaaS platform.
        </p>
      </div>

      {/* Product Vision */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold tracking-tight text-slate-800">1. Product Vision</h2>
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <p className="text-slate-600 leading-relaxed">
            <strong>Click Aarambh ClinicOS</strong> is a modern, enterprise-grade, multi-tenant SaaS operating system designed for healthcare clinics. It bridges the gap between clinical excellence and operational efficiency, providing a unified platform that handles everything from patient intake and doctor consultations to complex billing, inventory management, and multi-clinic executive analytics. It is built to be secure, highly available, and deeply integrated, eliminating the need for fragmented healthcare IT systems.
          </p>
        </div>
      </div>

      {/* Target Audience & Roles */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold tracking-tight text-slate-800">2. Core User Personas (RBAC Roles)</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            { role: "Super Admin", desc: "Oversees the entire SaaS platform, manages tenant billing, provisions new clinics, and monitors global server health." },
            { role: "Clinic Owner", desc: "The business operator. Requires top-level analytics, financial reporting, and multi-branch management capabilities." },
            { role: "Doctor / Practitioner", desc: "Focuses purely on clinical outcomes. Needs a fast, distraction-free EMR, voice dictation, and quick lab integrations." },
            { role: "Receptionist / Front Desk", desc: "Handles patient flow, triage, appointment scheduling, and token management in a high-speed environment." },
            { role: "Cashier / Billing User", desc: "Manages complex medical billing, insurance co-pays, split payments, cash drawers, and refunds." },
            { role: "Inventory Manager", desc: "Tracks pharmacy and equipment stock, handles vendor POs, physical audits, and expiration alerts." }
          ].map((persona, i) => (
            <div key={i} className="bg-slate-50 p-5 rounded-lg border border-slate-100">
              <h3 className="font-semibold text-slate-900 mb-2">{persona.role}</h3>
              <p className="text-sm text-slate-500">{persona.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Sitemap & Modules Overview */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold tracking-tight text-slate-800">3. Master Sitemap & Module Architecture</h2>
        <p className="text-slate-500 mb-4">The platform is divided into distinct operational modules, dynamically rendered based on the user's RBAC profile.</p>
        
        <div className="space-y-6">
          
          <ModuleCard icon={<ShieldCheck className="text-indigo-600" />} title="Super Admin Panel (SaaS Core)">
            <li><strong>Core Control Center:</strong> Platform revenue, MRR, active clinics, global system health.</li>
            <li><strong>Tenant Management:</strong> Clinic onboarding, subscription tier management, license allocation.</li>
            <li><strong>Infrastructure & Security:</strong> Audit logs, API gateway monitoring, database backups, disaster recovery.</li>
            <li><strong>Global Operations:</strong> Broadcast announcements, maintenance windows, top-tier support escalations.</li>
          </ModuleCard>

          <ModuleCard icon={<LayoutGrid className="text-blue-600" />} title="Clinic Owner Panel">
            <li><strong>Owner Dashboard:</strong> High-level view of daily revenue, footfall, and clinical efficiency.</li>
            <li><strong>Branch Analytics:</strong> Multi-location performance comparison, demographic trends.</li>
            <li><strong>HQ Operations:</strong> Staff scheduling, role assignments, master tariff list management.</li>
            <li><strong>Financial Hub:</strong> Settlement reports, tax summaries, insurance claims tracking.</li>
          </ModuleCard>

          <ModuleCard icon={<Users className="text-emerald-600" />} title="Patient Management (CRM)">
            <li><strong>Master Directory:</strong> Global patient search, duplicate merging, household linking.</li>
            <li><strong>Patient Profile (360° View):</strong> Demographics, clinical summary, financial history, upcoming visits.</li>
            <li><strong>Intake Workflows:</strong> Consent forms, triage, automated WhatsApp/SMS registration links.</li>
          </ModuleCard>

          <ModuleCard icon={<Calendar className="text-orange-600" />} title="Appointment & Front Desk">
            <li><strong>Calendar Management:</strong> Doctor schedules, block-outs, multi-resource booking (rooms/machines).</li>
            <li><strong>Queue & Token System:</strong> Visual lobby management, live wait-time estimations, TV display integration.</li>
            <li><strong>Reception Kiosk:</strong> Fast-track check-ins, demographic verification, copay collection.</li>
          </ModuleCard>

          <ModuleCard icon={<Stethoscope className="text-red-600" />} title="Doctor EMR (Clinical Core)">
            <li><strong>Clinical Dashboard:</strong> Day's agenda, current patient queue, pending lab reviews.</li>
            <li><strong>Consultation Interface:</strong> SOAP structure, voice dictation, vitals trending, ICD-10 diagnosis.</li>
            <li><strong>Prescription (Rx) Builder:</strong> Drug interaction checks, dosage shortcuts, digital signatures.</li>
          </ModuleCard>

          <ModuleCard icon={<Wallet className="text-teal-600" />} title="Billing & Payments">
            <li><strong>Billing Dashboard:</strong> Daily collection shifts, pending invoices, cashier reconciliation.</li>
            <li><strong>Invoice Generator:</strong> Complex charging (Labs + Consult + Pharmacy), health packages, taxation.</li>
            <li><strong>Payment Gateway:</strong> Support for Cash, Cards, UPI (Dynamic QR), Split Tenders, and Refunds.</li>
          </ModuleCard>

          <ModuleCard icon={<Package className="text-amber-600" />} title="Inventory & Supply Chain">
            <li><strong>Inventory Dashboard:</strong> Stock valuation, low stock alerts, expiring item warnings.</li>
            <li><strong>Stock Ledger:</strong> Master item database, barcode tracking, physical audit discrepancy logging.</li>
            <li><strong>Purchasing (Vendor management):</strong> Purchase orders (POs), Goods Received Notes (GRN), vendor CRM.</li>
          </ModuleCard>

          <ModuleCard icon={<BarChart3 className="text-purple-600" />} title="Executive Analytics">
            <li><strong>Patient Intelligence:</strong> Churn rates, acquisition cost, geographic heatmaps.</li>
            <li><strong>Financial Intelligence:</strong> Revenue forecasting, profit margins by department.</li>
            <li><strong>Clinical Intelligence:</strong> Doctor utilization, wait time impacts, efficacy metrics.</li>
          </ModuleCard>

          <ModuleCard icon={<HelpCircle className="text-sky-600" />} title="Support Center (Helpdesk)">
            <li><strong>Support Dashboard:</strong> Platform uptime, active ticket tracking.</li>
            <li><strong>Knowledge Base:</strong> Self-service guides, semantic search for SOPs.</li>
            <li><strong>Training Center:</strong> Onboarding videos, process tutorials, webinar bookings.</li>
          </ModuleCard>

        </div>
      </div>

      {/* Standardized User Journeys */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold tracking-tight text-slate-800">4. Core Enterprise User Journeys</h2>
        
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shrink-0">
          <div className="p-6 border-b border-slate-100 bg-slate-50">
            <h3 className="font-bold text-slate-800">Journey A: The End-to-End Walk-in Patient Flow</h3>
            <p className="text-sm text-slate-500">From arrival to exit, demonstrating cross-module integration.</p>
          </div>
          <div className="p-6 space-y-4">
            <Step number="1" module="Front Desk" text="Patient arrives. Receptionist searches directory (Ctrl+K). If new, enters phone number for fast OTP-based registration." />
            <Step number="2" module="Queue System" text="Patient is assigned to Dr. Smith's queue. A token is generated and pushed to the waiting room display." />
            <Step number="3" module="Doctor EMR" text="Dr. Smith sees the next patient on his dashboard. Clicks 'Start'. Reviews history, uses Voice Dictation to log complaints, generates Rx and Lab Request, clicks 'Finish'." />
            <Step number="4" module="Billing" text="Patient proceeds to Cashier. Cashier pulls up token. Invoice is auto-generated merging Consult Fee + Lab Charges. Patient pays via Split Tender (Cash + UPI)." />
            <Step number="5" module="Pharmacy/Inventory" text="If medicines were prescribed, Pharmacy dashboard alerts stock deduction. Expiry dates are validated before handover." />
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shrink-0">
          <div className="p-6 border-b border-slate-100 bg-slate-50">
            <h3 className="font-bold text-slate-800">Journey B: The Executive Reconciliation & Reporting</h3>
            <p className="text-sm text-slate-500">End of day/month operations guaranteeing financial safety.</p>
          </div>
          <div className="p-6 space-y-4">
            <Step number="1" module="Billing" text="Cashier ends shift. System calculates expected cash vs actual cash. Discrepancies are logged and drawer is locked in the system." />
            <Step number="2" module="Clinic Owner" text="Owner receives daily SMS summary. Logs into Owner Dashboard to view Net Collections and Departmental profitability." />
            <Step number="3" module="Inventory" text="Inventory Manager runs physical audit matching the days consumption against digital ledger. Confirms no shrinkage." />
            <Step number="4" module="Super Admin" text="SaaS billing triggers on 1st of month. Tenant credit card is auto-charged based on transaction volume/usage." />
          </div>
        </div>
      </div>

      {/* Tech Constraints & Next Steps */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold tracking-tight text-slate-800">5. Technical Implementation Guidelines</h2>
        <ul className="list-disc pl-6 space-y-2 text-slate-600">
          <li><strong>Architecture:</strong> Micro-frontend or modular Monolith architecture using React + TypeScript.</li>
          <li><strong>Styling constraint:</strong> Strictly adhere to the foundational Tailwind CSS design tokens established in the Design System module. Utilize <code>motion</code> for all transitions.</li>
          <li><strong>Database:</strong> Use PostgreSQL with Row-Level Security (RLS) for strict tenant data isolation.</li>
          <li><strong>Real-time capabilities:</strong> Implement WebSockets/Server-Sent Events for Queue Management and live Dashboard metric updates.</li>
          <li><strong>Accessibility:</strong> All interactive elements must be keyboard navigable and WCAG compliant. High contrast modes required for clinical environments.</li>
        </ul>
      </div>

    </div>
  );
}

function ModuleCard({ icon, title, children }: { icon: React.ReactNode, title: string, children: React.ReactNode }) {
  return (
    <div className="flex gap-4 p-5 bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
      <div className="mt-1 flex-shrink-0">
        <div className="w-12 h-12 rounded-lg bg-slate-50 flex items-center justify-center border border-slate-100">
          {icon}
        </div>
      </div>
      <div>
        <h3 className="text-lg font-bold text-slate-900 mb-2">{title}</h3>
        <ul className="list-disc pl-5 space-y-1 text-slate-600 text-sm">
          {children}
        </ul>
      </div>
    </div>
  );
}

function Step({ number, module, text }: { number: string, module: string, text: string }) {
  return (
    <div className="flex items-start gap-4">
      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 text-blue-700 font-bold flex items-center justify-center text-sm border border-blue-200">
        {number}
      </div>
      <div>
        <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold tracking-wider uppercase bg-slate-100 text-slate-600 mb-1 border border-slate-200">{module}</span>
        <p className="text-slate-700">{text}</p>
      </div>
    </div>
  );
}
