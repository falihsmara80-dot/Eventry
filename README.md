# BundleAI

AI-powered e-commerce platform for event bundles. Monorepo containing a
Node/Express backend (Prisma + PostgreSQL, Redis, OpenAI, Stripe) and a
React/Vite frontend (Tailwind CSS, Lucide icons).

## Project structure

```
bundle-ai/
├── backend/   # Express API, Prisma schema, business logic
└── frontend/  # React + Vite + Tailwind UI
```

## Prerequisites

- Node.js 18+
- A running PostgreSQL instance
- A running Redis instance (optional for early development)

## 1. Backend setup

```bash
cd backend
cp .env.example .env   # then fill in DATABASE_URL, OPENAI_API_KEY, STRIPE_SECRET_KEY, etc.
npm install             # if not already installed
npx prisma migrate dev --name init
npm run dev              # starts the API on http://localhost:5000
```

> **macOS note:** port 5000 is sometimes used by the AirPlay Receiver. If you
> see an `EADDRINUSE` error, either disable AirPlay Receiver
> (System Settings → General → AirDrop & Handoff) or set `PORT=5001` in
> `backend/.env`.

Health check: [http://localhost:5000/api/health](http://localhost:5000/api/health)

## 2. Frontend setup

```bash
cd frontend
npm install            # if not already installed
npm run dev             # starts the Vite dev server on http://localhost:5173
```

The Vite dev server proxies any request to `/api/*` to
`http://localhost:5000`, so the frontend can call the backend with relative
URLs (e.g. `fetch('/api/health')`).

## Running both at once

Open two terminals:

```bash
# Terminal 1
cd backend && npm run dev

# Terminal 2
cd frontend && npm run dev
```

Then visit the frontend at `http://localhost:5173`.

## Useful Prisma commands (run from `backend/`)

```bash
npx prisma studio        # browse your database in a GUI
npx prisma migrate dev   # create/apply a migration after editing schema.prisma
npx prisma generate      # regenerate the Prisma Client
```
