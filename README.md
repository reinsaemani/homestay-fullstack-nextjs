# Bee Nirwana Homestay

Management system for Bee Nirwana Homestay — manage bookings, track income, and handle finances.

## Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript
- **UI:** React 19, Tailwind CSS v4, ApexCharts, FullCalendar
- **Database:** PostgreSQL (Supabase) with Prisma ORM
- **Auth:** NextAuth v4 (Credentials provider, JWT, bcrypt)
- **Validation:** Zod
- **i18n:** Indonesian (default) & English

## Features

### Dashboard
- Metric cards: total bookings, active guests, today revenue, pending check-ins, piggy bank total
- Revenue chart (monthly bar chart)
- Occupancy rate (radial gauge)
- City distribution (pie chart)
- Booking trends (line chart)
- Upcoming check-ins (7 days)

### Bookings
- Create, edit, view, and delete bookings
- Status workflow: BOOKED → CHECKED_IN → CHECKED_OUT / CANCELLED
- Time recording on check-in/check-out via confirmation modal
- Search by guest name, filter by check-in date range
- Paginated table sorted by check-in date (ascending)
- Guest city of origin via Indonesian region selector (province → city)

### Reports
- Income report grouped by daily/weekly/monthly/yearly periods
- CSV export

### Piggy Bank
- Track income/expense entries
- Running total balance
- CSV export

### Landing Page
- Public calendar view showing all booking statuses with color coding
- Dashboard login button

## Prerequisites

- Node.js 20+
- PostgreSQL database (Supabase recommended)
- npm or pnpm

## Getting Started

### 1. Clone & Install

```bash
git clone <repo-url>
cd homestay
cp .env.example .env
npm install
```

### 2. Environment Variables

Edit `.env`:

```env
# PostgreSQL (Supabase)
DATABASE_URL="postgresql://user:password@host:6543/postgres?pgbouncer=true"
DIRECT_URL="postgresql://user:password@host:5432/postgres"

# NextAuth (generate: openssl rand -hex 32)
AUTH_SECRET="your-random-secret"

# Deployment URL (for Vercel)
NEXTAUTH_URL="http://localhost:3000"

# App Environment
APP_ENV="development"
```

### 3. Database

```bash
npx prisma migrate dev --name init
npx prisma db seed
```

### 4. Run

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Project Structure

```
src/
├── app/
│   ├── (admin)/           # Admin pages (dashboard, bookings, reports, piggybank)
│   │   ├── bookings/      # Booking list, create, detail, edit
│   │   ├── dashboard/     # Dashboard page
│   │   ├── piggybank/     # Piggy bank page
│   │   └── reports/       # Income reports
│   ├── (auth)/signin/     # Sign-in page
│   ├── api/               # API routes
│   │   ├── auth/          # NextAuth handler
│   │   ├── bookings/      # Booking CRUD
│   │   ├── piggybank/     # Piggy bank CRUD
│   │   ├── public/        # Public endpoints (calendar)
│   │   ├── reports/       # Income reports
│   │   └── wilayah/       # Indonesian region proxy
│   ├── layout.tsx         # Root layout with providers
│   └── page.tsx           # Landing page
├── components/
│   ├── auth/              # Sign-in form
│   ├── common/            # Badge, table, modal, currency, date, etc.
│   ├── form/              # Input, checkbox, date-picker
│   ├── landing/           # Landing header, booking calendar
│   └── ui/                # Button, city-select, table
├── features/
│   ├── bookings/          # Booking services, components, hooks, schemas, types
│   ├── dashboard/         # Dashboard charts, metrics, services
│   ├── piggybank/         # Piggy bank services, components
│   └── reports/           # Income report service
├── context/               # Locale, Theme, Sidebar providers
├── dictionaries/          # id.json, en.json
├── icons/                 # SVG icon components
├── layout/                # Admin sidebar, header, backdrop
├── lib/                   # Prisma client, auth config
├── proxy.ts               # Route protection (auth, locale)
└── types/                 # NextAuth type declarations
```

## API Routes

| Route | Methods | Auth | Description |
|-------|---------|------|-------------|
| `/api/auth/[...nextauth]` | GET, POST | — | NextAuth handler |
| `/api/bookings` | GET, POST | Yes | List / create bookings |
| `/api/bookings/:displayId` | GET, PATCH, DELETE | Yes | Single booking CRUD |
| `/api/public/bookings` | GET | No | Public calendar data |
| `/api/piggybank` | GET, POST | Yes | List / create entries |
| `/api/piggybank/:id` | DELETE | Yes | Delete entry |
| `/api/reports/income` | GET | Yes | Income report |
| `/api/wilayah/provinces` | GET | No | Indonesian provinces |
| `/api/wilayah/regencies/:code` | GET | No | Indonesian regencies |

## Database Schema

- **Booking** — guest info, dates, pricing, status workflow
- **PiggyBank** — income/expense tracking
- **User** — admin authentication (email + bcrypt password)

## Deployment

### Vercel

1. Push to GitHub
2. Import project at [vercel.com](https://vercel.com)
3. Set environment variables in Vercel dashboard
4. Deploy (build command: `prisma generate && next build`)

Required env vars on Vercel:
- `DATABASE_URL`, `DIRECT_URL`, `AUTH_SECRET`, `NEXTAUTH_URL`, `APP_ENV`
