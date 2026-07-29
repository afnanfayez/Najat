# Najat — Project Instructions

Najat is a Next.js 16 / React 19 crisis-response platform (health services, emergency guidance,
maps, humanitarian aid, offline access, admin operations) for Gaza/Palestine. PWA with full
offline support via IndexedDB/Dexie and a service worker.

## Current state: mock-data mode

The original backend (Railway-hosted) has **permanently expired**. The app currently runs
entirely on a local mock data layer — see [README.md](README.md) → "Mock Data Mode" and
[lib/mocks/isMockMode.ts](lib/mocks/isMockMode.ts). Controlled by
`NEXT_PUBLIC_USE_MOCK_DATA` (anything but the literal `"false"` = mock mode on).

## Active migration: real backend on Supabase

We are replacing the mock layer with a real backend: **Next.js Route Handlers + Supabase**
(Postgres + Auth + Storage), living in this same repo — no separate server to host.

**Source of truth for this migration:** [docs/BACKEND_API_SPEC.md](docs/BACKEND_API_SPEC.md).
It's a complete reverse-engineered spec of the API contract, entities, and endpoints the frontend
currently expects (extracted from `lib/mocks/`, `lib/api/api.ts`, hooks, and `data/*.json`).
Read it before designing schema or writing backend code for this migration — it exists so the
implicit contract isn't rediscovered or reinvented differently each time.

### Rules for this migration

- **Generated docs are overwritten in place, not versioned.** When `docs/BACKEND_API_SPEC.md` (or
  any similar generated reference doc for this migration) needs regenerating or updating,
  overwrite the existing file. Never create dated/numbered/suffixed copies
  (`_v2`, `.old`, `_backup`, timestamped filenames, etc.). Git history is the backup mechanism —
  extra copies on disk just create ambiguity about which one is current.
- **Ask before proceeding to the next migration step.** This is a multi-stage rewrite (schema
  design → Supabase/auth setup → route handlers per domain → data migration → flipping the mock
  flag off). Do not chain into the next stage automatically after finishing one — check in and
  get explicit go-ahead first, even if the overall direction was already agreed.
- Preserve the response envelope, soft-delete convention, and status-vs-full-update split
  documented in `docs/BACKEND_API_SPEC.md` §12 — the frontend code is written against these
  exact conventions and should not need to change during the rewrite.
- Keep the mock layer intact and working until the real backend is verified end-to-end; don't
  delete `lib/mocks/` or flip `NEXT_PUBLIC_USE_MOCK_DATA` to `false` until told to.

## Stack

- Next.js 16, React 19, TypeScript, Tailwind CSS 4
- shadcn/ui, Radix UI, Lucide React, Sonner
- TanStack Query, Zustand, React Hook Form, Zod
- Axios, Fetch API
- Leaflet, React Leaflet, OpenStreetMap/CARTO tiles
- PWA Service Worker, Web App Manifest, Dexie/IndexedDB
- ESLint, Prettier, Vitest, React Testing Library, jsdom
