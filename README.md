# Najat

Najat is a crisis-response web platform for health services, emergency guidance, maps, humanitarian aid, offline access, and admin operations.

> **Mock Data Mode**: this app's original backend has permanently expired. It now runs entirely on local mock data by default — see [Mock Data Mode](#mock-data-mode) below for demo accounts and how to reconnect a real backend later.

## Features

- Beneficiary pages for hospitals, pharmacies, clinics, labs, dental clinics, aid points, maps, emergency content, profile, and requests.
- Admin role for managing health facilities, aid points, maps, alerts, users, reports, communication, audit, security, and data review.
- PWA/offline support with cached app pages, API data, map tiles, IndexedDB storage, and queued sync actions.

## Tech Stack

- Next.js 16, React 19, TypeScript, Tailwind CSS 4
- shadcn/ui, Radix UI, Lucide React, Sonner
- TanStack Query, Zustand, React Hook Form, Zod
- Axios, Fetch API — backed by a local mock data layer (see Mock Data Mode) with an intact code path for a real REST backend
- Leaflet, React Leaflet, OpenStreetMap/CARTO tiles
- PWA Service Worker, Web App Manifest, Dexie/IndexedDB
- ESLint, Prettier, Vitest, React Testing Library, jsdom

## Getting Started

Install dependencies:

```bash
npm install
```

Run the development server:

```bash
npm run dev
```

Build for production:

```bash
npm run build
```

Run tests:

```bash
npm run test
```

## Project Notes

- The app is optimized for Arabic RTL user flows.
- Offline behavior depends on opening relevant pages and maps once while online so the service worker can cache assets and map tiles.
- Environment variables should be based on `.env.example`.

## Mock Data Mode

The backend this app originally talked to (a Railway-hosted API) has **permanently expired**. To keep the app fully functional, self-contained, and demoable without any external server, it now runs entirely on a local mock data layer by default.

### How it works

- A single environment flag, `NEXT_PUBLIC_USE_MOCK_DATA` (see `.env` / `.env.example`), controls this. It defaults to mock mode — anything other than the literal string `"false"` counts as "on".
- The interception happens in one place: `request()` in [`lib/api/api.ts`](lib/api/api.ts). When mock mode is on, it routes every API call to [`lib/mocks/mockRouter.ts`](lib/mocks/mockRouter.ts) instead of making a real network request, returning data shaped exactly like the real backend would — so every hook, mapper, and Zod schema downstream is unaffected.
- Mock data is seeded from realistic fixtures under `lib/mocks/seeds/` and persisted in the browser's `localStorage` (see `lib/mocks/store/localStore.ts`), so create/edit/delete actions survive a page reload.
- Two Next.js API routes (`/api/profile`, `/api/aid-requests`) already had a local JSON-file fallback for when the real backend was unreachable — in mock mode they skip the dead-backend attempt entirely and use that fallback directly (see `data/*.json`).
- Simulated network delay (150–500ms) keeps loading states visible, and a few reserved values (below) let you deliberately trigger error UI for testing.

### Demo accounts

| Role | Email | Password |
|---|---|---|
| Admin | `admin@najat.ps` | `Admin@12345` |
| Volunteer | `volunteer@najat.ps` | `Volunteer@12345` |
| Resident | `resident@najat.ps` | `Resident@12345` |

Registration works end-to-end too — new accounts are created and persisted locally. The verification/OTP code is always `123456` in mock mode.

### Triggering mock error states

Pass one of these reserved values wherever an id or a `since` query param is accepted (e.g. open a facility detail page with an id containing it) to force a specific error response instead of the real mock data:

`mock-error-400`, `mock-error-401`, `mock-error-403`, `mock-error-404`, `mock-error-500`, `mock-error-network` (the last simulates a connectivity failure rather than an HTTP error, exercising the offline-cache fallback path).

### Reconnecting a real backend later

No rewrites are needed — the real-fetch code path in `request()` was left completely intact.

1. Set `NEXT_PUBLIC_USE_MOCK_DATA=false`.
2. Set `NEXT_PUBLIC_BASE_URL` (and `NEXT_PUBLIC_API_V1_ROOT` if different) to the new backend's URL.
3. Rebuild (`npm run build`) and redeploy.

The two OpenStreetMap Nominatim geocoding calls (address search on the maps page and admin facility setup) are unrelated third-party lookups, not part of this backend — they're left untouched and simply require internet access to work, same as before.
