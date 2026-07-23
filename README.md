# Click Aarambh ClinicOS

Welcome to **Click Aarambh ClinicOS**, a modern, multi-tenant, enterprise-grade clinic management system. 
This platform is built with Next.js, TailwindCSS, and Supabase, featuring deep Row-Level Security (RLS) ensuring absolute clinic data isolation.

## Key Modules

### 1. Appointment Module (Completed)
The Appointment module has been fully refactored and modernized to support high-concurrency enterprise workflows.
- **Core Appointments**: Advanced scheduling with status tracking.
- **Queue & Token Management**: Clinic-wide daily token generation and wait-time estimations for walk-ins and scheduled patients.
- **Lifecycle & History**: A state-machine approach to transitions (`Scheduled` -> `Checked In` -> `In Consultation` -> `Completed`) with automatic history logging.
- **Communication & Documents**: Native integration with the Notification Center for reminders, and secure Supabase Storage integration for patient documents and prescriptions.
- **Patient Feedback**: Clinic-isolated 5-star rating mechanisms dynamically calculating average doctor and staff ratings.
- **Immutable Audit Trail**: An impenetrable Postgres RLS-backed audit layer that tracks all events (`INSERT`/`SELECT` only). Even database administrators cannot `UPDATE` or `DELETE` forensic logs.

### 2. Analytics Dashboard
- Executive insights featuring Live Revenue Tracking, Consultation statistics, and Patient Satisfaction aggregates dynamically fed by the Appointment Feedback module.

## Tech Stack
- **Frontend**: Next.js (App Router), React, Tailwind CSS, Lucide Icons.
- **Backend**: Supabase (PostgreSQL), Next.js Server Actions.
- **Database**: 
  - Advanced PostgreSQL implementations including JSONB payloads for auditing.
  - Granular multi-tenant architecture using `clinic_id` RLS policies on *every* operational table.

## Local Development

### Prerequisites
- Node.js (v18+)
- Local Supabase CLI or connection to an active Supabase project.

### Setup
1. Clone the repository.
2. Run `npm install`.
3. Set your Supabase environment variables in `.env.local`:
   ```bash
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```

## Architecture
The system strictly adheres to a **Repository / Service / Server Action** pattern:
- **Repositories**: Pure SQL CRUD operations mapping strictly to tables.
- **Services**: Pure business logic, validation, and multi-repository transactions.
- **Server Actions**: Authentication, AuthZ, and Next.js bridging logic exposing internal services to client-side React Components.
