import React from 'react';
import { SpecCard } from '../../components/SpecCard';

export default function SuperAdminTenantsView() {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-secondary mb-2">Tenant & User Management</h2>
        <p className="text-slate-500 mb-8 max-w-3xl">
          Detailed specifications for managing Clinics (Tenants), their subscriptions, and the individual global users accessing the platform.
        </p>
      </div>

      <SpecCard
        title="Clinic Management"
        purpose={
          <p>
            The core multi-tenant control center. Allows super admins to view, edit, suspend, or provision new clinic environments, managing their specific configurations and data isolation.
          </p>
        }
        widgets={
          <ul className="list-disc pl-4 space-y-1">
            <li><strong>Total Clinics:</strong> Active vs Suspended split.</li>
            <li><strong>Storage Consumed:</strong> Aggregate DB/File storage used across tenants.</li>
            <li><strong>Avg Onboarding Time:</strong> Metric showing time from signup to first active patient.</li>
          </ul>
        }
        tables={
          <ul className="list-disc pl-4 space-y-1">
            <li><strong>Clinics Directory:</strong> Comprehensive list. Columns: Tenant ID, Clinic Name, Location, Plan, Storage Used, Primary Contact, Status (Active/Suspended/Trial).</li>
          </ul>
        }
        charts={
          <ul className="list-disc pl-4 space-y-1">
            <li><strong>Geographic Distribution (Map/Bar):</strong> Clinics mapped by state or region.</li>
          </ul>
        }
        filters={
          <ul className="list-disc pl-4 space-y-1">
            <li>Status Filter (Active, Trial, Suspended, Churned).</li>
            <li>Search by Clinic Name, ID, or Contact Email.</li>
          </ul>
        }
        actions={
          <ul className="list-disc pl-4 space-y-1">
            <li>Provision New Clinic (Triggers setup wizard).</li>
            <li>Suspend Clinic (Hard locks access for all their users).</li>
            <li>Impersonate Clinic Admin (Login as tenant for support).</li>
          </ul>
        }
        buttons={
          <ul className="list-disc pl-4 space-y-1">
            <li><strong>Primary:</strong> "+ Provision Clinic"</li>
            <li><strong>Ghost/Icon:</strong> "Impersonate" (Eye icon), "Edit Settings" (Gear icon).</li>
          </ul>
        }
        userFlow={
          <p>
            Admin searches for "Durga Clinic" → Clicks row to open side-sheet details → Adjusts storage quota limits → Clicks "Save Configuration" → System fires confirmation toast.
          </p>
        }
        responsive={
          <p>
            <strong>Mobile:</strong> Replaces standard table with list view (cards for each clinic). Actions move to a bottom-sheet on tap. <strong>Desktop:</strong> Standard dense table with sticky headers.
          </p>
        }
      />

      <SpecCard
        title="Subscription Management"
        purpose={
          <p>
            Manages SaaS plans, custom billing overrides, feature unlocking, and trials for individual clinics.
          </p>
        }
        widgets={
          <ul className="list-disc pl-4 space-y-1">
            <li><strong>Expiring Trials:</strong> Counter of clinics ending trial in 7 days.</li>
            <li><strong>Upgrade Requests:</strong> Clinics requesting tier jumps.</li>
          </ul>
        }
        tables={
          <ul className="list-disc pl-4 space-y-1">
            <li><strong>Subscription Roster:</strong> Maps Clinics to Plans. Columns: Clinic, Plan Tier, Billing Cycle (Monthly/Annual), Next Invoice Date, Status.</li>
          </ul>
        }
        filters={
          <ul className="list-disc pl-4 space-y-1">
            <li>Filter by Plan Tier (Free, Basic, Pro, Enterprise).</li>
          </ul>
        }
        actions={
          <ul className="list-disc pl-4 space-y-1">
            <li>Override Plan (Force upgrade/downgrade).</li>
            <li>Extend Trial (Adds +X days to trial period).</li>
            <li>Apply Custom Discount (Percentage/Fixed).</li>
          </ul>
        }
        buttons={
          <ul className="list-disc pl-4 space-y-1">
            <li><strong>Primary:</strong> "Manage Plans" (Opens global plan configuration).</li>
            <li><strong>Context Menu:</strong> "Extend Trial", "Apply Discount".</li>
          </ul>
        }
        userFlow={
          <p>
            Sales rep requests trial extension for Clinic X → Admin locates Clinic X in Subscription Management → Clicks "Extend Trial" → Enters "30 days" in modal → Confirms.
          </p>
        }
        responsive={
          <p>
            Modals for applying discounts use bottom-sheets on mobile to preserve screen real estate. Form inputs resize aggressively to fit small viewports.
          </p>
        }
      />

      <SpecCard
        title="User Management"
        purpose={
          <p>
            A global directory of every individual user (Doctor, Nurse, Receptionist, Tenant Admin) across the entire platform. Used for cross-tenant security auditing.
          </p>
        }
        tables={
          <ul className="list-disc pl-4 space-y-1">
            <li><strong>Global User Index:</strong> Columns: Name, Email, Global Role, Parent Clinic(s), Last Login Date, 2FA Status, Status.</li>
          </ul>
        }
        filters={
          <ul className="list-disc pl-4 space-y-1">
            <li>Filter by Global Role (e.g., Tenant Admin, Super Admin).</li>
            <li>Filter by 2FA enforcement status.</li>
            <li>Search by Email or Phone.</li>
          </ul>
        }
        actions={
          <ul className="list-disc pl-4 space-y-1">
            <li>Force Password Reset.</li>
            <li>Disable User Account globally.</li>
            <li>Revoke all active sessions (Force logout).</li>
          </ul>
        }
        buttons={
          <ul className="list-disc pl-4 space-y-1">
            <li><strong>Action:</strong> "Force Logout" (Shield Icon).</li>
            <li><strong>Action:</strong> "Reset 2FA" (Key Icon).</li>
          </ul>
        }
        userFlow={
          <p>
            Security alert indicates compromised email → Admin searches email → Clicks "Revoke all sessions" and "Force Password Reset" → User is instantly logged out globally.
          </p>
        }
        responsive={
          <p>
            Focuses heavily on search input visibility. On desktop, side-panel slides out with user's full login history and device metadata.
          </p>
        }
      />
    </div>
  );
}
