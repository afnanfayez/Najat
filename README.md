# Najat

Najat is a crisis-response web platform for health services, emergency guidance, maps, humanitarian aid, offline access, and admin operations.

## Features

- Beneficiary pages for hospitals, pharmacies, clinics, labs, dental clinics, aid points, maps, emergency content, profile, and requests.
- Admin role for managing health facilities, aid points, maps, alerts, users, reports, communication, audit, security, and data review.
- PWA/offline support with cached app pages, API data, map tiles, IndexedDB storage, and queued sync actions.

## Tech Stack

- Next.js 16, React 19, TypeScript, Tailwind CSS 4
- shadcn/ui, Radix UI, Lucide React, Sonner
- TanStack Query, Zustand, React Hook Form, Zod
- Axios, Fetch API, external REST backend
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
