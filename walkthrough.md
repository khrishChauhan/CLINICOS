# Sprint 3: Appointment & Queue Management Complete

I have fully implemented the architecture and user interfaces for **Sprint 3: Appointment & Queue Management**.

> [!NOTE]
> All business logic has been safely encapsulated into dedicated Repositories and Services, following the strict architectural mandate (`UI -> Server Action -> Service Layer -> Repository Layer -> Supabase`).

## 1. Database Schema & RBAC
- Added schemas for `doctor_schedules`, `doctor_leaves`, `appointments`, and `appointment_status_logs`.
- Created an RPC `generate_queue_token` to handle atomic queue ticket numbering.
- Injected strict permissions (`appointments.view`, `appointments.create`, `appointments.edit`, etc.) and mapped them to Roles (Super Admin, Receptionist, Doctor).

## 2. Service & Repository Layer
- **`scheduleRepository.ts`**: Handles recurring weekly schedules and doctor leaves.
- **`appointmentRepository.ts`**: Handles single day fetch, queue fetch, and appointment creation.
- **`availabilityService.ts`**: Contains the core logic to dynamically compute available time slots based on doctor schedules, existing bookings, and approved leaves.
- **`queueService.ts`**: Handles secure state transitions (`Scheduled` -> `Checked In` -> `In Consultation` -> `Completed`) and logging.

## 3. Server Actions
We established secure server actions as the bridge between the UI and Services:
- `bookAppointmentAction`
- `getAvailableSlotsAction`
- `updateAppointmentStatusAction`

## 4. UI Components

### Receptionist Live Queue Dashboard
- **Route**: `/queue`
- **Features**: Live view of all appointments categorized by status (`Scheduled`, `Waiting`, `In Consultation`, `Completed`). 
- Receptionists can Check-in patients (generating a token number) or Cancel them.
- Click `+ Book Walk-in` to launch the **BookAppointmentModal**.

### Book Appointment Modal
- **Component**: `BookAppointmentModal.tsx`
- **Features**: Integrates with `availabilityService` to display dynamic time slots when you select a Doctor ID and Date. It strictly prevents double booking.

### Doctor Workspace Dashboard
- **Route**: `/doctor`
- **Features**: Dedicated view for doctors to see their active queue.
- Includes a rich "Active Consultation" header displaying the patient in context, alongside "Call Next" buttons to advance the queue seamlessly.

> [!TIP]
> The app is now ready. You can test it out by logging in as your newly provisioned `admin@durgaclinic.in`, generating a dummy doctor schedule in Supabase, and using the `/queue` dashboard to book and manage appointments!
