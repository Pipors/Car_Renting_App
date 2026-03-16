# Car Rental Marketplace

A full-stack car rental marketplace with a **cross-agency renter reputation system**.

## Tech Stack

### Backend
| Layer | Technology |
|---|---|
| Runtime | Node.js 20 + TypeScript |
| Framework | Express 5 |
| ORM | Prisma + PostgreSQL |
| Cache / Sessions | Redis (ioredis) |
| Auth | JWT (jsonwebtoken) |
| Payments | Stripe |
| Validation | Zod |

### Frontend
| Layer | Technology |
|---|---|
| UI framework | React 18 + TypeScript + Vite |
| Data fetching | TanStack Query v5 |
| Global state | Zustand |
| Forms | React Hook Form + Zod |
| Styles | Tailwind CSS + shadcn/ui |
| HTTP client | Axios |

---

## User Roles

| Role | Capabilities |
|---|---|
| **Agency** | List / edit / delete own cars, manage bookings (approve / reject / complete), rate renters after rental completion |
| **Renter** | Search & filter cars, create bookings, pay deposit via Stripe, view own reputation score |

### Cross-Agency Renter Reputation
Every time a rental is completed an agency can submit a star rating (1–5) plus an optional comment for the renter. The **aggregated score is visible platform-wide** to all agencies when they view a booking request — helping agencies make informed decisions about potential renters.

---

## Project Structure

```
.
├── backend/                  # Express API
│   ├── prisma/
│   │   └── schema.prisma     # Database schema
│   └── src/
│       ├── controllers/      # Route handlers
│       ├── middleware/        # Auth & error middleware
│       ├── routes/           # Express routers
│       ├── services/         # Business logic (Stripe, Redis, …)
│       ├── types/            # Shared TypeScript types
│       └── app.ts            # Express app entry point
└── frontend/                 # React SPA
    └── src/
        ├── components/       # Reusable UI components
        ├── pages/            # Page-level components
        ├── store/            # Zustand stores
        ├── hooks/            # Custom React hooks
        ├── services/         # Axios API clients
        └── types/            # Shared TypeScript types
```

---

## Quick Start

### Prerequisites
- Docker & Docker Compose
- Node.js 20+
- pnpm (or npm / yarn)

### 1 – Start infrastructure

```bash
docker compose up -d
```

This starts **PostgreSQL** on port `5432` and **Redis** on port `6379`.

### 2 – Configure environment variables

```bash
cp .env.example backend/.env
cp .env.example frontend/.env
# Edit both files and fill in your Stripe keys / JWT secret
```

### 3 – Backend

```bash
cd backend
npm install
npx prisma migrate dev --name init
npm run dev
```

API will be available at `http://localhost:4000/api`.

### 4 – Frontend

```bash
cd frontend
npm install
npm run dev
```

App will be available at `http://localhost:5173`.

---

## API Overview

| Method | Path | Role | Description |
|--------|------|------|-------------|
| POST | `/api/auth/register` | Public | Register as Agency or Renter |
| POST | `/api/auth/login` | Public | Login, receive JWT |
| GET | `/api/cars` | Public | List/search cars |
| POST | `/api/cars` | Agency | Create a car listing |
| PUT | `/api/cars/:id` | Agency (owner) | Update a car listing |
| DELETE | `/api/cars/:id` | Agency (owner) | Delete a car listing |
| POST | `/api/bookings` | Renter | Create a booking |
| GET | `/api/bookings` | Auth | List own bookings |
| PATCH | `/api/bookings/:id/status` | Agency | Approve / reject / complete |
| POST | `/api/bookings/:id/pay` | Renter | Pay deposit via Stripe |
| POST | `/api/ratings` | Agency | Rate a renter after completion |
| GET | `/api/ratings/renter/:renterId` | Agency | View renter reputation |
| POST | `/api/payments/webhook` | Stripe | Stripe webhook handler |

---

## Environment Variables

See [`.env.example`](.env.example) for all required variables.

---

## License

MIT
