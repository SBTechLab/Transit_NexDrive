# TransitOps — Smart Fleet Management System

A full-stack fleet management platform built with **Next.js 16**, **Prisma**, **PostgreSQL (Supabase)**, and **Tailwind CSS**.

## Features

- **Authentication & RBAC** — Secure login with role-based access (Fleet Manager, Driver, Safety Officer, Financial Analyst)
- **Dashboard** — Real-time KPIs: Active Vehicles, Available Vehicles, Fleet Utilization %, Active Trips, Pending Trips, Drivers On Duty
- **Vehicle Registry** — Full CRUD with filters by type, status, region and sort support
- **Driver Management** — Driver profiles with safety score, license expiry alerts, suspend/reinstate
- **Trip Management** — Full lifecycle: Draft → Dispatched → Completed / Cancelled with business rule validation
- **Maintenance** — Maintenance logs with automatic vehicle status transitions (IN_SHOP ↔ AVAILABLE)
- **Fuel & Expenses** — Fuel logs and expense tracking per vehicle
- **Reports & Analytics** — Fuel Efficiency, Fleet Utilization, Operational Cost, Vehicle ROI with CSV & PDF export
- **Dark Mode** — Full dark/light theme toggle with beautiful color palette
- **Search, Filter & Sort** — Available on all major pages

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript |
| Database | PostgreSQL via Supabase |
| ORM | Prisma |
| Auth | NextAuth.js v4 |
| Styling | Tailwind CSS v4 |
| UI Components | Radix UI + shadcn/ui |
| Charts | Recharts |
| Email | Nodemailer |

## Business Rules Enforced

- Vehicle registration number must be unique
- Retired or In Shop vehicles never appear in dispatch selection
- Drivers with expired licenses or Suspended status cannot be assigned
- A driver or vehicle already On Trip cannot be assigned to another trip
- Cargo weight must not exceed vehicle max load capacity
- Dispatching a trip automatically sets vehicle and driver to On Trip
- Completing a trip restores both to Available and updates odometer
- Cancelling a dispatched trip restores vehicle and driver to Available
- Opening maintenance automatically sets vehicle to In Shop
- Closing maintenance restores vehicle to Available

## Getting Started

```bash
# Install dependencies
cd transitops
npm install --legacy-peer-deps

# Setup environment
cp .env.example .env
# Fill in DATABASE_URL, DIRECT_URL, NEXTAUTH_SECRET, SMTP credentials

# Push schema and seed database
npx prisma db push
npx prisma db seed

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Default Login Credentials

| Role | Email | Password |
|------|-------|----------|
| Fleet Manager | manager1@transitops.com | password123 |
| Safety Officer | safety@transitops.com | password123 |
| Financial Analyst | finance@transitops.com | password123 |
| Driver | driver@transitops.com | password123 |

## Project Structure

```
transitops/
├── prisma/              # Schema and seed
├── src/
│   ├── app/             # Next.js App Router pages
│   │   ├── dashboard/
│   │   ├── vehicles/
│   │   ├── drivers/
│   │   ├── trips/
│   │   ├── maintenance/
│   │   ├── fuel-expenses/
│   │   └── reports/
│   ├── components/      # Reusable UI components
│   ├── lib/             # Prisma client, auth, mail, utils
│   ├── services/        # Business logic layer
│   └── types/           # TypeScript type definitions
```

## License

MIT
