# Najat · نجاة

A crisis-response platform for Gaza — health services, emergency guidance, maps, humanitarian aid,
and admin operations. Arabic-first (RTL), installable as a PWA, and built to keep working when the
network doesn't.

---

## Architecture at a glance

Najat is a single Next.js app. The backend lives in the same repo as Route Handlers under
`app/api/v1/`, talking to **Supabase** (Postgres + Auth + Storage). There is no separate server to
deploy.

```
Browser ──► Next.js Route Handlers (app/api/v1) ──► Supabase (Postgres · Auth · Storage)
   │                                                        ▲
   └──────────── Supabase Auth (sign-in / OTP) ─────────────┘
```

Two things are worth knowing up front:

- **Auth always goes through Supabase.** Sign-in, registration and OTP verification call Supabase
  directly and never pass through the API client. This is true regardless of the mock flag below.
- **Everything else is still on mock data by default.** The Supabase backend is complete and
  verified, but the frontend has not been switched over yet — see
  [Data modes](#data-modes).

---

## Features

- **Beneficiary** — hospitals, pharmacies, clinics, labs, dental clinics, aid points, safety maps,
  emergency guidance, profile and aid requests.
- **Admin** — manage facilities, aid points, maps, alerts, users, reports, communication, audit,
  security and data review.
- **Offline-first** — cached pages, API responses and map tiles, IndexedDB storage, and a sync queue
  that replays actions taken while offline.

---

## Tech stack

| Area | Choices |
|---|---|
| Core | Next.js 16, React 19, TypeScript, Tailwind CSS 4 |
| Backend | Next.js Route Handlers, Supabase (Postgres, Auth, Storage), PostGIS |
| UI | shadcn/ui, Radix UI, Lucide, Sonner |
| State & data | TanStack Query, Zustand, React Hook Form, Zod |
| Maps | Leaflet, React Leaflet, OpenStreetMap / CARTO tiles |
| Offline | Service Worker, Web App Manifest, Dexie / IndexedDB |
| Tooling | ESLint, Prettier, Vitest, React Testing Library |

---

## Getting started

### 1. Install

```bash
npm install
```

### 2. Configure environment

Copy the template and fill it in:

```bash
cp .env.example .env.local
```

**Supabase credentials are required even in mock mode**, because authentication always uses
Supabase. Without them the app throws on first render.

| Variable | Required | Notes |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | ✅ | Project Settings → API |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | ✅ | Safe in the browser; RLS enforces access |
| `SUPABASE_SERVICE_ROLE_KEY` | server only | **Never** prefix with `NEXT_PUBLIC_` |
| `NEXT_PUBLIC_USE_MOCK_DATA` | | `true` (default) or `false` — see [Data modes](#data-modes) |
| `NEXT_PUBLIC_BASE_URL` | | Leave empty — Route Handlers are same-origin |
| `NEXT_PUBLIC_API_V1_ROOT` | | Must be `/api/v1` |

> `NEXT_PUBLIC_API_V1_ROOT` must be `/api/v1`, not `/v1`. The auth middleware excludes `/api/*` from
> its redirect gate — leaving it as `/v1` sends real API calls through the page gate and they come
> back as an HTML login page.

### 3. Run

```bash
npm run dev
```

---

## Setting up the database

Only needed if you're pointing at a fresh Supabase project.

```bash
npx supabase login
npx supabase link --project-ref <your-project-ref>
npx supabase db push      # applies supabase/migrations in order
npx tsx scripts/seed-supabase.ts
```

The seed script is re-runnable — it skips accounts that already exist.

Two settings must be configured in the Supabase dashboard, since they aren't in migrations:

- **Auth → Hooks** — enable the Custom Access Token hook pointing at
  `public.custom_access_token_hook`. This writes the user's role into the JWT so middleware and
  every RLS policy can read it without a database round trip.
- **Auth → Emails** — the "Confirm sign up" and "Reset password" templates must include
  `{{ .Token }}`, since the app uses a 6-digit code screen rather than magic links.

---

## Data modes

A single flag, `NEXT_PUBLIC_USE_MOCK_DATA`, decides where data comes from. Anything other than the
literal string `"false"` means mock mode is on.

| | Mock mode (default) | Supabase mode |
|---|---|---|
| Auth | Supabase | Supabase |
| Profile, aid requests | Supabase | Supabase |
| Facilities, articles, safety, admin | Local mock layer | Supabase |

Interception happens in exactly one place — `request()` in [`lib/api/api.ts`](lib/api/api.ts) — so
every hook, mapper and Zod schema downstream is identical either way.

**Mock mode** seeds realistic fixtures from `lib/mocks/seeds/` into `localStorage`, so edits survive
a reload. It adds a 150–500 ms delay to keep loading states visible. To force an error state, pass
one of these anywhere an id or `since` param is accepted:

`mock-error-400` · `mock-error-401` · `mock-error-403` · `mock-error-404` · `mock-error-500` ·
`mock-error-network`

**To switch to Supabase**, set `NEXT_PUBLIC_USE_MOCK_DATA=false` and rebuild. Verify each domain
afterwards — this cutover has not been exercised through the UI yet.

---

## Demo accounts

The same three accounts exist in both modes (in Supabase they're created by the seed script).

| Role | Email | Password |
|---|---|---|
| Admin | `admin@najat.ps` | `Admin@12345` |
| Volunteer | `volunteer@najat.ps` | `Volunteer@12345` |
| Resident | `resident@najat.ps` | `Resident@12345` |

Registration works end-to-end. In mock mode the OTP is always `123456`; against Supabase a real code
is emailed.

---

## Scripts

| Command | What it does |
|---|---|
| `npm run dev` | Development server |
| `npm run build` | Production build + precache manifest |
| `npm start` | Serve the production build |
| `npm run lint` | ESLint |
| `npm run test` | Vitest (`test:watch` for watch mode) |
| `npx supabase db push` | Apply migrations |
| `npx tsx scripts/seed-supabase.ts` | Seed the database |

---

## Project structure

```
app/
  api/v1/           74 Route Handlers — the REST backend
  (auth)/           login, register, verify
  (app)/            dashboard, facilities, maps, aid, admin, volunteer
lib/
  supabase/         browser, server and service-role clients
  api-handlers/     shared envelope, pagination, CRUD factory
  api/              frontend API client
  auth/             session identity and role helpers
  offline/          IndexedDB store and sync queue
  mocks/            mock data layer
supabase/
  migrations/       23 ordered SQL migrations
schemas/            Zod schemas shared by client and server
docs/               BACKEND_API_SPEC.md — the API contract
```

---

## Notes

- **API contract** — [`docs/BACKEND_API_SPEC.md`](docs/BACKEND_API_SPEC.md) is the source of truth
  for every entity, endpoint and convention. Read it before changing backend code.
- **Security** — Row Level Security is enabled on every table and is the real access boundary, not
  just hidden UI. Route Handlers additionally enforce the field-level admin split, since RLS is
  table-level.
- **Offline** — pages and map tiles must be visited once while online for the service worker to
  cache them.
- **Geocoding** — the address lookups on the maps and admin facility pages call OpenStreetMap
  Nominatim directly. That's a third-party service, unrelated to this backend, and needs internet.
