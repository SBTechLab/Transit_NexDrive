<div align="center">

# 🚛 Transit NexDrive

**A production-ready, full-stack fleet management system**

Built with Next.js 16 · Prisma 5 · PostgreSQL · TypeScript · Tailwind CSS


</div>

---

## Overview

Transit NexDrive is a comprehensive fleet operations platform designed to give fleet managers, drivers, safety officers, and financial analysts a single source of truth for all fleet activity. From real-time vehicle tracking and trip dispatching to maintenance scheduling, fuel logging, and financial reporting — everything is managed in one place with role-based access control enforced at every route.

---

## Features

### 📊 Dashboard
- Real-time fleet overview with 8 live KPI cards (active vehicles, fleet utilization, total revenue, pending trips, and more)
- Auto-refresh capability with manual filter controls (by vehicle type, status, and region)
- Recent trips feed with status badges
- Fleet breakdown progress bars with utilization rate indicator

### 🚗 Vehicle Management
- Full vehicle registry with registration number, type, load capacity, odometer, acquisition cost, and region
- Status tracking: `AVAILABLE`, `ON_TRIP`, `IN_SHOP`, `RETIRED`
- Vehicle document management (insurance, registration, permits) with expiry tracking
- Search, filter, sort, and paginate across all vehicles

### 👤 Driver Management
- Driver profiles with license number, category, expiry date, contact, and safety score
- Visual safety score progress bar (green ≥ 80, yellow ≥ 60, red < 60)
- Automatic license expiry highlighting with `Expired` badge
- Status tracking: `AVAILABLE`, `ON_TRIP`, `OFF_DUTY`, `SUSPENDED`
- One-click license expiry check with email notification trigger

### 🗺️ Trip Management
- Full trip lifecycle: `DRAFT` → `DISPATCHED` → `COMPLETED` / `CANCELLED`
- Cargo weight, planned vs. actual distance, fuel consumed, and revenue tracking
- Assign eligible vehicles and drivers only (availability-checked at dispatch)
- Search by route, driver name, or vehicle registration

### 🔧 Maintenance Logs
- Log maintenance events per vehicle with description, cost, start/end dates
- Status tracking: `OPEN` / `CLOSED`
- Automatically sets vehicle status to `IN_SHOP` on open maintenance
- Paginated history with cost visibility

### ⛽ Fuel & Expenses
- Tabbed interface for fuel logs and other expenses (tolls, miscellaneous)
- Per-vehicle fuel volume (liters) and cost tracking, optionally linked to a trip
- Expense types: `TOLL`, `MAINTENANCE`, `OTHER`
- Separate pagination for fuel and expense history

### 📈 Reports & Analytics
- KPI summary: total fuel cost, maintenance cost, operating cost, revenue, avg fuel efficiency, fleet utilization
- Interactive charts powered by Recharts (cost breakdown, fuel efficiency, ROI per vehicle)
- Vehicle ROI analysis table: `(Revenue − Maintenance − Fuel) / Acquisition Cost × 100`
- Export to **CSV** (PapaParse) and **PDF** (jsPDF + AutoTable)

### 🔐 Authentication & Security
- Credential-based login with NextAuth.js v4
- Bcrypt password hashing
- Force password change on first login
- Forgot password / reset password flow via email token
- Route-level RBAC enforced in middleware

### 📧 Email Notifications
- Password reset emails with secure token links
- License expiry reminder emails (30-day and 7-day warnings)
- Configurable via any SMTP provider (Nodemailer)

### ⏰ Cron Job
- Automated license expiry check endpoint: `GET /api/cron/license-check`
- Sends reminder emails to drivers with licenses expiring within 30 days
- Tracks last reminder sent to avoid duplicate notifications

---

## Role-Based Access Control

| Route | Fleet Manager | Safety Officer | Financial Analyst | Driver |
|---|:---:|:---:|:---:|:---:|
| `/dashboard` | ✅ | ✅ | ✅ | ✅ |
| `/vehicles` | ✅ | ✅ | ✅ | ✅ |
| `/drivers` | ✅ | ✅ | ❌ | ✅ |
| `/trips` | ✅ | ❌ | ❌ | ✅ |
| `/maintenance` | ✅ | ❌ | ❌ | ❌ |
| `/fuel-expenses` | ✅ | ❌ | ✅ | ❌ |
| `/reports` | ✅ | ❌ | ✅ | ❌ |

---

## Tech Stack

| Layer | Technology | Version |
|---|---|---|
| Framework | [Next.js](https://nextjs.org/) (App Router) | 16 |
| Language | [TypeScript](https://www.typescriptlang.org/) | 5 |
| Database | [PostgreSQL](https://www.postgresql.org/) | Latest |
| ORM | [Prisma](https://www.prisma.io/) | 5 |
| Auth | [NextAuth.js](https://next-auth.js.org/) | v4 |
| UI Components | [Radix UI](https://www.radix-ui.com/) + [shadcn/ui](https://ui.shadcn.com/) | Latest |
| Styling | [Tailwind CSS](https://tailwindcss.com/) | v4 |
| Forms | [React Hook Form](https://react-hook-form.com/) + [Zod](https://zod.dev/) | Latest |
| Charts | [Recharts](https://recharts.org/) | 2 |
| Email | [Nodemailer](https://nodemailer.com/) | 9 |
| PDF Export | [jsPDF](https://github.com/parallax/jsPDF) + [jspdf-autotable](https://github.com/simonbengtsson/jsPDF-AutoTable) | Latest |
| CSV Export | [PapaParse](https://www.papaparse.com/) | 5 |
| Icons | [Lucide React](https://lucide.dev/) | Latest |
| Toasts | [Sonner](https://sonner.emilkowal.ski/) | Latest |

---

## Data Models

```
User            — id, name, email, passwordHash, role, resetToken, forcePasswordChange
Vehicle         — id, registrationNumber, name, type, maxLoadCapacityKg, odometerKm, acquisitionCost, status, region
Driver          — id, name, email, licenseNumber, licenseCategory, licenseExpiryDate, contactNumber, safetyScore, status
Trip            — id, source, destination, cargoWeightKg, plannedDistanceKm, actualDistanceKm, fuelConsumedLiters, status, revenue
MaintenanceLog  — id, vehicleId, description, cost, startDate, endDate, status
FuelLog         — id, vehicleId, tripId?, liters, cost, date
VehicleDocument — id, vehicleId, name, documentType, expiryDate, fileUrl
Expense         — id, vehicleId, type, amount, date, notes
```

---

## Getting Started

### Prerequisites

- **Node.js** 18+
- **PostgreSQL** database — [Supabase](https://supabase.com) (free tier works great)

### 1. Clone & Install

```bash
git clone https://github.com/your-username/Transit_NexDrive.git
cd Transit_NexDrive/transitops
npm install
```

### 2. Environment Variables

Create a `.env` file inside `transitops/`:

```env
# Database
DATABASE_URL=postgresql://user:password@host:port/dbname
DIRECT_URL=postgresql://user:password@host:port/dbname

# Auth
NEXTAUTH_SECRET=your_random_secret_here
NEXTAUTH_URL=http://localhost:3000

# Email (SMTP)
EMAIL_HOST=smtp.example.com
EMAIL_PORT=587
EMAIL_USER=your@email.com
EMAIL_PASS=your_password
EMAIL_FROM=your@email.com
```

> **Tip:** Generate a strong `NEXTAUTH_SECRET` with `openssl rand -base64 32`

### 3. Database Setup

```bash
# Run migrations
npx prisma migrate dev

# Seed with sample data and default users
npx prisma db seed
```

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## Project Structure

```
transitops/
├── prisma/
│   ├── schema.prisma        # Database schema & enums
│   ├── seed.ts              # Sample data seeder
│   ├── addUsers.ts          # Utility to add users
│   ├── checkUsers.ts        # Utility to verify users
│   └── resetPasswords.ts    # Utility to reset passwords
│
└── src/
    ├── app/
    │   ├── actions/         # Server actions
    │   │   ├── auth.ts      # Login, password reset
    │   │   ├── vehicle.ts   # CRUD for vehicles & documents
    │   │   ├── driver.ts    # CRUD for drivers
    │   │   ├── trip.ts      # Trip lifecycle management
    │   │   ├── maintenance.ts
    │   │   ├── expenses.ts
    │   │   ├── document.ts
    │   │   └── user.ts
    │   ├── api/
    │   │   ├── auth/[...nextauth]/route.ts
    │   │   └── cron/license-check/route.ts
    │   ├── dashboard/
    │   ├── vehicles/
    │   ├── drivers/
    │   ├── trips/
    │   ├── maintenance/
    │   ├── fuel-expenses/
    │   ├── reports/
    │   ├── login/
    │   ├── forgot-password/
    │   ├── reset-password/
    │   └── change-password/
    ├── components/
    │   ├── layout/          # DashboardLayout, Header, Sidebar
    │   └── ui/              # shadcn/ui components
    ├── lib/
    │   ├── auth.ts          # NextAuth config
    │   ├── prisma.ts        # Prisma client singleton
    │   ├── rbac.ts          # Route permission map
    │   ├── mail.ts          # Nodemailer transport
    │   ├── utils.ts
    │   └── email-templates/
    ├── services/
    │   ├── vehicleService.ts
    │   ├── driverService.ts
    │   ├── tripService.ts
    │   └── maintenanceService.ts
    ├── types/
    │   └── next-auth.d.ts   # Session type augmentation
    └── middleware.ts        # RBAC route guard
```

---

## Scripts

```bash
npm run dev      # Start development server (http://localhost:3000)
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint
```

---


