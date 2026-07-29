# Najat — Backend API & Data Model Spec (reverse-engineered from mock layer)

> **Source of truth for the Supabase/Next.js backend rewrite.**
> This document was reverse-engineered from the existing mock layer (`lib/mocks/`), the API
> client (`lib/api/api.ts`), hooks (`hooks/*.ts`), and JSON-file-backed routes (`app/api/*`,
> `data/*.json`) before any real-backend code was written, so the original app's implicit
> contract isn't lost or reinvented differently during the rewrite.
>
> **Maintenance rule:** this file is the single copy. When it needs regenerating or updating,
> overwrite it in place — do not create dated/numbered backup copies (`BACKEND_API_SPEC_v2.md`,
> `BACKEND_API_SPEC.old.md`, etc.). Git history is the backup.

---

## 0. Architecture Overview

**Base URL / routing construction** (`lib/api/api.ts`):
- `BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || process.env.NEXT_PUBLIC_API_BASE_URL || ''`
- `V1_ROOT = process.env.NEXT_PUBLIC_API_V1_ROOT?.replace(/\/$/, '') ?? '/v1'` — every domain API
  module builds paths as `${V1_ROOT}/<resource>` (e.g. `/v1/hospitals`, `/v1/aid`,
  `/v1/safety/zones`, `/v1/admin/users`).
- `isMockMode()`: `process.env.NEXT_PUBLIC_USE_MOCK_DATA !== 'false'` — mock is the default; only
  the literal string `"false"` disables it.
- Two "local-proxy" endpoints are special-cased and **always** routed to real Next.js Route
  Handlers regardless of mock mode (they handle their own mock/real fallback server-side):
  - `${V1_ROOT}/auth/me` → rewritten to `/api/profile`
  - `${V1_ROOT}/aid/requests` → rewritten to `/api/aid-requests`
  - `POST .../aid/:orgId/requests` → rewritten to `/api/aid-requests?aidOrganizationId=:orgId`
- For every other endpoint, when `isMockMode()` is true, `request()` calls
  `dispatchMock(endpoint, options)` instead of `fetch`. On dispatch failure it retries from the
  offline GET cache (IndexedDB via `lib/offline/db`), else throws
  `{status:0, message:'Network error / CORS issue', errors:null}`.
- Real-fetch path (used only when mock mode is off): builds headers via `buildHeaders()` — sets
  `Content-Type: application/json` (skipped for FormData), attaches
  `Authorization: Bearer <token>` from `getToken()` (cookie `auth_token`), and anti-cache headers.
  Non-2xx responses throw `{status, message, errors, detail, fullData}` where `message` is
  extracted from `data.message ?? data.error ?? data.detail`, unwrapping `{ar, en}` bilingual
  objects. Successful GETs are cached to IndexedDB (`putApiResponse`).
- **Response envelope** used everywhere: `{ success, statusCode?, message?, data, meta?, timestamp? }`.
  List endpoints wrap paginated results; `unwrapPaginated()` flattens a doubly-nested
  `{data:{data,meta}}` to `{data:[...],meta}` for callers — **the real backend should NOT
  double-nest**; that unwrap only exists because the original backend apparently did.
- `isConnectivityError(err)`: true when `status` is `0`, `502`, `504`, or `undefined` — hooks use
  this to decide whether to fall back to the offline queue rather than surface a hard error.

**Auth token plumbing** (`lib/api/auth.ts`): JWT stored in cookie `auth_token`
(`SameSite=Strict`, 7-day Max-Age, `Secure` on https).

**Mock JWT** (`lib/mocks/store/jwt.ts`): unsigned but well-formed JWT, payload
`{sub, role, email, iat, exp}`. Multiple parts of the app decode this payload directly without a
round trip (fast-path optimization) — **a real backend must issue tokens whose payload includes
at minimum `sub` (user id), `role`, `email`**, replicated via Supabase custom claims or a thin
compatibility JWT.

**Mock router** (`lib/mocks/mockRouter.ts`): a `registerCrudRoutes(base, resource, {statusField,
nearby})` helper registers the **identical 6-route CRUD+nearby shape** for every "flat resource"
(hospitals, pharmacies, labs, clinics, dental-clinics, articles, aid):
- `GET {base}/nearby` (unless `nearby:false`)
- `GET {base}` (list, paginated)
- `GET {base}/:id`
- `POST {base}` (create)
- `PATCH {base}/:id/status` (status-only update)
- `PATCH {base}/:id` (full update)
- `DELETE {base}/:id` (soft or hard delete)

**Persistence** (`lib/mocks/store/localStore.ts`): each mock "table" is a localStorage bucket.
This maps directly to CRUD table semantics a real Postgres schema needs.

**Generic CRUD resource logic** (`lib/mocks/crud/createCrudResource.ts` +
`paginationHelpers.ts`), used for hospitals/pharmacies/labs/clinics/dental-clinics/articles/aid:
- `list(query)`: `page` (default 1), `limit` (default 20, or 50 for articles). `meta =
  {page, limit, totalItems, totalPages, hasNextPage, hasPreviousPage, syncTimestamp}`. Soft-delete
  resources filter out items with `deletedAt` set.
- `nearby(query)`: `latitude`/`lat`, `longitude`/`lng`, `radius` (default 5000m, meters);
  haversine distance, filters `distance <= radius`, sorts ascending, paginates, includes
  `distance` field. Aid meta variant only returns `{totalItems, syncTimestamp}`.
- `getById(id)`: 404 if not found; non-list envelope, no `meta`. **Does not filter by
  `deletedAt`** — still fetchable directly even when soft-deleted.
- `create(body)`: auto-generates `id`, sets `createdAt`/`updatedAt`.
- `update(id, body)`: shallow-merge, always overwrites `updatedAt`.
- `updateStatus(id, body, statusField='status')`: patches just that field + `updatedAt`.
- `remove(id)`: soft (`deletedAt = now`) or hard delete depending on resource config.

**FormData/file handling** (`lib/mocks/formDataUtils.ts`): images >1.5MB dropped; otherwise
converted to a base64 data-URL and stored inline. **Real backend implication:** images should go
to real object storage (Supabase Storage) with a URL stored in the row, not embedded base64 — the
mock's inline-base64 behavior is purely a localStorage limitation and must not be replicated.

---

## 1. Auth / Users

### Entity: User

| Field | Type | Notes |
|---|---|---|
| id | string | |
| email | string | unique, case-insensitive lookup |
| password | string | mock-only plaintext; never returned |
| fullName | string | |
| phoneNumber | string \| null | |
| gender | `'male' \| 'female'` \| null | |
| ageGroup | `'18-40' \| 'above 40'` \| null | |
| maritalStatus | `'single'\|'married'\|'divorced'\|'widowed'` \| null | |
| healthStatus | `'Healthy'\|'Chronically Ill'\|'Injured'\|'Amputee'` \| null | |
| nationalId | string \| null | exactly 9 digits |
| housingStatus | string \| null | free text |
| familyMembersCount | number \| null | |
| femalesCount | number \| null | |
| malesCount | number \| null | |
| region | string \| null | free-text region name |
| role | `'resident'\|'volunteer'\|'admin'` | |
| isVerified | boolean | OTP-verified |
| isActive | boolean | disabled accounts blocked at login (403) |
| createdAt / updatedAt | string (ISO) | |
| deletedAt | string \| null | soft-delete marker |
| version | number (optional) | |

Seed data: 3 fixed QA accounts (admin/volunteer/resident @najat.ps) + 9 extra users across
roles/regions. `MOCK_OTP = '123456'` always accepted.

### Auth/session model

- Token = JWT in cookie `auth_token`; `AuthProvider` on mount calls `refreshUser()` →
  `profileAPI.me()` (`GET /v1/auth/me`, proxied to `/api/profile`). Role cached client-side and
  cross-tab synced via `BroadcastChannel('najat-auth')`.
- Offline: loads last cached profile from IndexedDB instead of hitting network.
- 401 on refresh → `logout()`.
- **Supabase mapping:** `sub`/`id` → `auth.users.id` (uuid); `role` → custom claim or a
  `profiles.role` column (`resident|volunteer|admin`), since Supabase Auth has no native
  app-level roles. Login/registration/OTP verify/forgot-reset-password map to Supabase Auth flows
  (magic-link/OTP or password-based) + a custom `profiles` table for the extended demographic
  fields.

### Endpoints — Auth

| Method | Path | Purpose | Request body | Response |
|---|---|---|---|---|
| POST | `/v1/auth/register` | Register | `{email, password, fullName?, role?, phoneNumber?, gender?, ageGroup?, maritalStatus?, healthStatus?, nationalId?, housingStatus?, familyMembersCount?, femalesCount?, malesCount?, region?}` | 201 `{token, user}` |
| POST | `/v1/auth/login` | Login | `{email, password}` | `{token, user}`; 401 bad creds, 403 `isActive=false` |
| POST | `/v1/auth/verify` | OTP verify | `{email, code}` | `{token, user}` w/ `isVerified:true`; 400/404 |
| POST | `/v1/auth/forgot-password` | Request OTP | `{email}` | always success (mock) |
| POST | `/v1/auth/reset-password` | Reset via OTP | `{email, code, newPassword}` | success; 400/404 |
| GET | `/v1/auth/me` | Current profile | — | proxied to `/api/profile` (§7) |
| PATCH | `/v1/auth/me` | Update profile | partial `UpdateUserProfileBody` | proxied to `/api/profile` PATCH |

### Endpoints — Admin Users

| Method | Path | Purpose | Query/body | Response |
|---|---|---|---|---|
| GET | `/v1/admin/users/stats` | Aggregate stats | — | `{totalUsers, activeUsers, verifiedUsers, roleBreakdown, genderBreakdown, healthStatusBreakdown, regionBreakdown}` |
| GET | `/v1/admin/users` | List (excludes soft-deleted) | `page,limit(def10),search,role,isActive,isVerified` | `{data:{data:[...],meta}}` |
| GET | `/v1/users` (`?since=`) | List **including** soft-deleted | `page,limit,since` | same double-nested shape |
| GET | `/v1/admin/users/:id` | Get one | — | `{data: user}` |
| PUT | `/v1/admin/users/:id` | Update | `{fullName?,email?,role?,region?,phoneNumber?,isActive?,isVerified?,status?,enabled?}` | `{data: user}` |
| PATCH | `/v1/admin/users/:id/status` | Set active | `{isActive}` | `{data:user}` |
| PATCH | `/v1/admin/users/:id/verify` | Set verified | `{isVerified}` | `{data:user}` |
| PATCH | `/v1/admin/users/:id/restore` | Undo soft-delete | — | `{data:user}` |
| DELETE | `/v1/admin/users/:id` | Soft-delete | — | `{success:true}` |
| POST | `/v1/users/volunteers` | Create volunteer | `CreateAdminVolunteerBody` | `{data:user}` |
| POST | `/v1/users/residents` | Create resident | `CreateAdminResidentBody` (+maritalStatus/familyMembersCount/femalesCount/malesCount) | `{data:user}` |

`AdminUserDto` (UI shape) additionally derives: `name`, `status:
'active'|'disabled'|'pending_review'`, `enabled`, `lastActivity` (relative time string).

---

## 2. Aid Requests & Aid Points/Donors

### Entity: AidDto (aid point / distribution point)

| Field | Type |
|---|---|
| id | string |
| name | string |
| label | string? (nullable) |
| status | string (`active\|suspended\|limited`) |
| type | string (`all\|food\|water\|health\|shelter\|clothing_blankets\|organizations`) |
| latitude, longitude | number |
| availableSupplies | string[] |
| deletedAt | string\|null |
| version | number? |
| createdAt, updatedAt | string |

`NearbyAidPointDto` = same + `distance: number` (meters).

### Entity: AidRequestDto

| Field | Type |
|---|---|
| id | string |
| aidPointId | string? |
| userId | string? |
| status | `pending\|in_progress\|approved\|rejected\|fulfilled` |
| notes | string? nullable |
| requestedSupplies | string[] |
| createdAt, updatedAt | string? |
| aidOrganizationId | string? |
| aidOrganizationName | string? |
| husbandName, wifeName | string? |
| phoneNumber | string? |
| currentLocation | string? |
| femaleChildrenCount, maleChildrenCount | number? |

**Relationships:** `aidPointId`/`aidOrganizationId` → `AidDto.id`. `userId` → User.id.

### Endpoints — Aid points (CRUD via `/aid`, soft-delete)

| Method | Path | Purpose |
|---|---|---|
| GET | `/v1/aid/nearby?latitude&longitude&radius&page&limit` | Nearby aid points |
| GET | `/v1/aid?page&limit&since` | List |
| GET | `/v1/aid/:id` | Get one |
| POST | `/v1/aid` | Create |
| PATCH | `/v1/aid/:id/status` | Update status only |
| PATCH | `/v1/aid/:id` | Update |
| DELETE | `/v1/aid/:id` | Soft-delete |

### Endpoints — Aid Requests (real Next.js routes, JSON-file-backed even in mock mode)

| Method | Path (client-facing) | Real route | Purpose |
|---|---|---|---|
| GET | `/v1/aid/requests` → `/api/aid-requests` | `app/api/aid-requests/route.ts` GET | List current user's requests, or all if `role==='admin'`. Requires `Authorization` header. |
| POST | `/v1/aid/:aidOrganizationId/requests` → `/api/aid-requests?aidOrganizationId=...` | same file, POST | Create request. Body: `{aidOrganizationName?, husbandName, wifeName, phoneNumber, currentLocation, femaleChildrenCount, maleChildrenCount, additionalNotes, requestedSupplies}` |
| PUT/PATCH | `/v1/aid/requests` (admin only) | same file, PUT | Update status. Body `{id, status}`. Falls back to a signed cookie override store if FS unwritable (Vercel). |
| POST | `/api/aid-help-request` | `app/api/aid-help-request/route.ts` | Validated by `aidHelpRequestFormSchema`. Forwards to `AID_HELP_REQUEST_BACKEND_URL` if set, else persists locally. |

**Aid Help Request form schema**: `{aidOrganizationId, husbandName, husbandNationalId, wifeName,
wifeNationalId, daughtersCount(0-50), sonsCount(0-50), phone, currentLocation}` — maps to
`CreateAidRequestDto` via `husbandNationalId→husbandIdNumber`, `wifeNationalId→wifeIdNumber`,
`daughtersCount→femaleChildrenCount`, `sonsCount→maleChildrenCount`, `phone→phoneNumber`.

> ⚠️ **Unify at rewrite time:** there are currently **two parallel "aid requests" datasets** —
> `data/aid_requests_store.json` (real flow) and `data/mock_aid_requests.json` (older
> admin-aid-tab flow via `app/api/mock/aid-requests`). The new backend should have a single
> `aid_requests` table.

### `app/api/mock/*` routes (JSON-file-backed, admin Aid section)

- `/api/mock/aid-donors` ↔ `data/mock_aid_donors.json`: `AdminAidDonorDetail` — id, name,
  subtitle, totalAmount, lastDonation, donorType (`international|local|individual|strategic`),
  sector, contactPerson, email, phone, website, country, partnershipStatus
  (`active|renewal|ended`), agreementStart/End, focusAreas[], notes, active.
- `/api/mock/aid-points` ↔ `data/mock_aid_points.json`: `AdminAidDistributionPoint` — id, name,
  region, address, manager, phone, status (`open|crowded|closed`), category, remaining, total,
  lastUpdated, aidTypes[], inventory[] (`AdminAidInventoryItem`), workingDays[], startTime,
  endTime, targetGroups[], latitude, longitude.
- `/api/mock/aid-requests` ↔ `data/mock_aid_requests.json`: superset overlapping `AidRequestDto`.

Several admin-aid fields (`region, manager, phone, remaining, total, inventory, workingDays,
startTime, endTime, targetGroups`) are marked `// TODO: not in AidDto` in the frontend — decide
whether to extend `aid_points` with these or keep them admin-only.

---

## 3. Health Facilities (hospitals / pharmacies / clinics / labs / dental)

All 5 subtypes share the same CRUD+nearby route shape. Base paths: `/hospitals`, `/pharmacies`,
`/labs`, `/clinics`, `/dental-clinics`.

### Common fields

`id, name, address, contactNumber?, image?(nullable, may be data-URL), latitude, longitude,
status?, workingDoctors?[{name,specialty,workingDays?,workingHours?}],
currentMedications?[{name,type,status}], workingHours?, workingDays?[], medicalSupplies?[],
healthcareCategories?[], createdAt, updatedAt`. All soft-deletable (`deletedAt`).

### Hospital-specific

`status: 'full'|'available'|'critical'|'closed'` (capacity), `icuCapacity?`, `totalBeds?`,
`emergencyLevel?: 'level_1'|'level_2'|'level_3'` (nullable).

### Pharmacy-specific

`is24Hours: boolean(default false)`, `deliveryAvailable: boolean(default false)`,
`deliveryRadius?: number|null`.

### Lab-specific

`availableTests?: [{name,type,resultTime}]`, `homeCollection: boolean(default false)`,
`isoCertified: boolean(default false)`.

### Clinic-specific

`specialties?: string[]`, `practitionersCount?: number`, `distance?: number` (present on list).

### Dental-specific

`dentalChairs?: number`, `implantsAvailable: boolean(default false)`,
`orthodonticsAvailable: boolean(default false)`, `availableTests?: [{name,type,resultTime}]`.

### Endpoints (×5, `{base}` = `hospitals|pharmacies|labs|clinics|dental-clinics`)

| Method | Path | Purpose |
|---|---|---|
| GET | `/v1/{base}/nearby?latitude&longitude&radius&page&limit&since` | Nearby (haversine) |
| GET | `/v1/{base}?page&limit&since` | List |
| GET | `/v1/{base}/:id` | Get one |
| POST | `/v1/{base}` | Create — JSON or multipart FormData |
| PATCH | `/v1/{base}/:id/status` | Update status only |
| PATCH | `/v1/{base}/:id` | Update (JSON or FormData) |
| DELETE | `/v1/{base}/:id` | Soft-delete |

### Endpoint — Providers (composed read-only view)

| Method | Path | Purpose |
|---|---|---|
| GET | `/v1/providers?type&page&limit` | All 5 facility buckets unioned, tagged `type` |
| GET | `/v1/providers/nearby?type&latitude&longitude&radius&page&limit` | Same, haversine-sorted |

### Unified frontend shape: `HealthFacility`

`{id, name, address, category:'hospitals'|'pharmacies'|'clinics'|'labs'|'dental', isOpen,
medicineAvailability?, imageUrl?, distance?, phone?, latitude?, longitude?, capacityStatus?,
distanceMeters?, updatedAt?, fromHospitalApi?, region?:'north'|'south', detail?:
HealthFacilityDetail}`. `HealthFacilityDetail` is a UI-presentation projection derived
client-side from the 5 DTOs — **not a distinct backend entity**; keep serving flat DTOs.

---

## 4. Admin: Health Facilities & Medical Content

### `AdminHealthFacility` — derived client-side, not a new table

Built by calling all 5 real facility list endpoints in parallel and mapping each DTO to
`{id,name,address,imageUrl,isOpen,workloadPercent,phone?,region:'north'|'central'|'south'
(derived from lat), status:'open'|'closed'|'maintenance',
facilityType:'hospital'|'pharmacy'|'lab'|'clinic'|'dental_clinic', latitude?,longitude?,
workingDoctors?,currentMedications?,workingHours?,workingDays?}`. Filtering is client-side.

There is also a separate JSON-file-backed "setup form" mock at `/api/mock/health-facilities`
(`data/mock_health_facilities.json` + `data/mock_health_facility_forms.json`) storing a richer
admin "facility setup wizard" form (`drugs[]`, `staff[]`, `selectedServices[]`, `images[]`,
`operatingStatus`) that doesn't map 1:1 onto the 5 backend DTOs.

### `AdminHealthMedicalContent` — maps onto Articles

Maps `ArticleResponseDto` → `{id,title,author,date,thumbnailUrl,status:'published'|'draft',
category,description,body,references}`. **References are packed into `contentAr` using a
`\n\n---REFERENCES---\n` sentinel** — add a first-class `references` column instead.

Parallel JSON-file mock at `/api/mock/medical-content` (`data/mock_medical_content.json`).

No dedicated `/admin/health/*` backend route exists today — a real backend could add genuine
aggregate endpoints (`GET /admin/health/facilities`, `GET /admin/health/content`) for efficiency,
but it's not required to preserve the current contract.

---

## 5. Admin Alerts

### Entity: `AdminAlertDto`

`{id, title, message, severity:'critical'|'warning'|string, source:'system'|'sync'|'user_report'|
string, isResolved, createdAt?, updatedAt?}`.

| Method | Path | Purpose |
|---|---|---|
| GET | `/v1/admin/alerts` | List all alerts (no pagination) |

`mapCenter` isn't actually returned by the mock — frontend falls back to a hardcoded constant.
No create/update/resolve endpoints exist today — alerts are read-only from the frontend's
perspective; a real backend likely needs internal ingestion rather than a public write API,
unless product wants an admin "mark resolved" action added.

---

## 6. Admin Dashboard / Stats

- **`GET /v1/admin/stats`** → `AdminSystemStatsDto`: `{responseTime, informationAccuracy,
  activeActivitiesCount, urgentAlertsCount, userStats:{totalUsers,activeUsers,verifiedUsers,
  roleBreakdown}, hospitalCount, aidRequestCount}`.
- The main admin dashboard landing page (`ADMIN_DASHBOARD_MOCK`) is **100% hardcoded today, not
  backed by any endpoint**. Recommended: add a genuine `GET /admin/dashboard` aggregate covering
  total users/volunteers, completed tasks, active alerts count, weekly response-time series,
  accuracy %, recent activity feed, urgent-alerts preview.

### Admin Reports

| Method | Path | Purpose |
|---|---|---|
| GET | `/v1/admin/reports/dashboard` | `{overview:{totalVolunteers,totalResidents,totalHospitals,totalDangerZones,totalAidPoints}, safetyStats:{activeEscalations,resolvedZones,dangerousRoadsCount}, activitySummary:{weeklySyncVolume,avgResponseTime,medicalDispatches}}` |
| GET | `/v1/admin/reports/export/pdf` | Binary PDF export |

Much of the richer UI data (KPIs, regional distribution, resource breakdown, charts) is filled
from static mock constants client-side — only `overview`/`safetyStats`/`activitySummary` are
"real" today.

### Admin Communication

| Method | Path | Purpose |
|---|---|---|
| GET | `/v1/admin/communication/dashboard` | `{tasks:{total,pending,inProgress,completed}, totalBroadcasts, totalFeedback}` |
| POST | `/v1/admin/communication/tasks` | Create task `{title,description,volunteerId?,priority,dueDate,dueTime}` |
| POST | `/v1/admin/communication/broadcasts` | Launch broadcast `{alertType,title,description,geographicScope,beneficiarySegment}` |
| GET | `/v1/admin/communication/broadcasts/export` | Blob export |
| GET | `/v1/admin/communication/feedback/export` | Blob export |

A fully real version needs actual `tasks`, `broadcasts`, `feedback` tables (current contract only
requires 2 counters + 2 write actions).

### Admin Audit

Entity `AuditReportRecord`: `{id, facilityName, issueType, status:'pending'|'approved'|'rejected',
targetLocation, region, reporter, isUrgent, createdAt}`.

| Method | Path | Purpose |
|---|---|---|
| GET | `/v1/admin/audit/dashboard` | `{approvedCount,pendingCount,rejectedCount,complianceRating}` |
| GET | `/v1/admin/audit/reports` | List all reports |
| GET | `/v1/admin/audit/reports/:id/compare` | Version-compare detail |
| GET | `/v1/admin/audit/reports/:id/export` | Export one (Blob) |
| GET | `/v1/admin/audit/export` | Export all (Blob) |
| POST | `/v1/admin/audit/reports/:id/versions/:versionId/restore` | Restore a version |
| POST | `/v1/admin/audit/reports/:id/reject` | Set status=rejected |
| PATCH | `/v1/admin/audit/reports/:id` | Update — **field-mapping inconsistency to resolve**: pick one canonical field set (`issueType?,targetLocation?,reporter?,reportDate?,facilityName?`) |

Frontend adapts real API status values (`approved/published→resolved`,
`pending/under_review→under_review`, `rejected→archived`) — a real backend should pick a single
canonical status enum; the frontend adapter already handles legacy synonyms.

### Admin Security

Entity `AdminSecurityApiRaw` (singleton): `{backupSchedule:{cronExpression,isEnabled},
backupStats:{totalBackups,lastBackupFile,lastBackupSize,lastBackupDate},
securityStatus:{firewallStatus,ddosProtection,sslStatus,activeSessions}}`.

| Method | Path | Purpose |
|---|---|---|
| GET | `/v1/admin/security/dashboard` | Get singleton dashboard state |
| PUT | `/v1/admin/security/backup/schedule` | Update `{cronExpression,isEnabled}` |
| POST | `/v1/admin/security/backup` | Trigger backup → `{id,filename,sizeBytes,status,scheduledCron,createdAt}` |

Roles/permissions/encryption/alerts/audit-log UI is static mock data — a full "security control"
panel would need `roles`, `permissions`, `role_permissions`, `security_alerts`, `audit_log`
tables, but that's beyond the currently contracted surface.

### Admin Data / Sync Review

Entity `DataSyncRequestRecord`: `{id, entityName, action, description, area,
status:'pending'|'approved'|'rejected'|'published', reviewNotes?, createdAt, updatedAt?}`.

| Method | Path | Purpose |
|---|---|---|
| GET | `/v1/admin/data/dashboard` | `{totalRequests,pendingRequests,approvedRequests,rejectedRequests,publishedRequests,syncHealth}` |
| GET | `/v1/admin/data/sync` | All sync requests |
| GET | `/v1/admin/data/requests/:id/review` | One request detail |
| POST | `/v1/admin/data/requests/:id/review` | Submit decision `{status,reviewNotes}` |
| DELETE | `/v1/admin/data/requests/:id` | Delete request |
| POST | `/v1/admin/data/requests/:id/approve` | Shortcut: set status=approved |
| POST | `/v1/admin/data/sync/requests/:id/publish` | Set status=published |
| POST | `/v1/admin/data/sync/publish-all` | Bulk-publish all approved → published |
| GET | `/v1/admin/data/requests/:id/report` | Binary report download |
| GET | `/v1/admin/data/sync/export` | CSV export |

Consumer code references more fields (`payload`, `nodeId`, `requestType`, `changesData`,
`reviewedAt`, `reviewedBy`) than the mock returns — likely anticipated real-backend fields,
suggesting `data_sync_requests` needs a polymorphic entity-diff `payload`/`changesData` column.
Confirm with product.

### Admin Maps

No dedicated backend endpoint — `AdminMapsDashboard` is built client-side from Safety Map Data
(§8). The editor's verification-requests/field-reports/quick-actions panels have no backing data
model yet if product wants them real.

---

## 7. Profile

### Entity: `UserProfile`

| Field | Type | Source of truth |
|---|---|---|
| id, email, fullName, role | — | backend |
| phoneNumber, gender, ageGroup, maritalStatus, healthStatus, nationalId, housingStatus, familyMembersCount, femalesCount, malesCount, region | nullable | backend |
| isVerified, isActive | boolean? | backend |
| avatarUrl | string? nullable (may be data-URL) | **local-only** |
| assistancePreferences | `{food,medicine,water,clothes,health,transport}: boolean` | **local-only** |
| assistanceLocation | string? nullable | **local-only** |
| assistanceRadius | number? nullable | **local-only** |
| emergencyContacts | `Array<{id,name,phone}>`? nullable | **local-only** |
| sosMessage | string? nullable | **local-only** |
| bloodType | string? nullable | **local-only** |

**Critical detail:** the original backend had **no columns** for avatar/assistance
preferences/emergency contacts/SOS message/blood type — those were always local-only. Decide
whether the new Supabase backend finally persists these server-side (recommended — they're
safety-critical for a crisis-response app) or keeps them device-local as before.

### Endpoints (`app/api/profile/route.ts`, not mockRouter)

| Method | Path | Purpose |
|---|---|---|
| GET | `/api/profile` (aliased from `/v1/auth/me`) | Requires `Authorization: Bearer <jwt>`. Returns `{success:true, data: UserProfile}`, or 401/504. |
| PATCH | `/api/profile` (aliased from `/v1/auth/me`) | Body: any subset of `UserProfile`, split into backend fields vs. the 7 local-only fields. |

---

## 8. Safety Map (danger zones / safe roads / resource points)

### Entities

- **DangerZoneDto**: `{id, description, dangerLevel:'low'|'medium'|'high'|'critical'|string,
  area: GeoJSON Polygon | string, isActive(default true), deletedAt?}`
- **SafeRoadDto**: `{id, name, description(default ''), path: GeoJSON LineString | string,
  isActive(default true), deletedAt?}`
- **ResourcePointDto**: `{id, name, type: string, location: GeoJSON Point | string,
  isActive(default true), deletedAt?}`

GeoJSON: `Point.coordinates:[lng,lat]`, `LineString.coordinates:[[lng,lat],...]`,
`Polygon.coordinates:[[[lng,lat],...]]`. Schemas accept either parsed GeoJSON or a raw string — a
Postgres/PostGIS backend should store these as `geography`/`geometry` columns and return proper
GeoJSON.

| Method | Path | Purpose |
|---|---|---|
| GET | `/v1/safety/map-data` | All 3 layers at once |
| GET | `/v1/safety/check?lat&lng` | Point-in-polygon check → `{safe, zones}` (mock uses bounding-box, not true point-in-polygon) |
| GET | `/v1/safety/zones?page&limit&since` | List zones |
| GET | `/v1/safety/zones/:id` | Get one zone |
| POST | `/v1/safety/zones` | Create `{description,dangerLevel,area,isActive}` |
| PATCH | `/v1/safety/zones/:id` | Update |
| DELETE | `/v1/safety/zones/:id` | Soft-delete zone |
| POST | `/v1/safety/safe-roads` | Create `{name,description?,path,isActive?}` |
| DELETE | `/v1/safety/safe-roads/:id` | Delete road (**no update endpoint**) |
| POST | `/v1/safety/resource-points` | Create `{name,description?,type,location,isActive?}` |
| DELETE | `/v1/safety/resource-points/:id` | Delete point (**no update endpoint**) |

---

## 9. Articles / Health Guide

### Entity: `ArticleResponseDto`

`{id, titleAr, titleEn?, contentAr, contentEn?,
category:'first-aid'|'awareness'|'mental-health', image?(nullable), readTime: number,
viewsCount: number, isActive: boolean, author?:{id,fullName,role}(nullable), createdAt,
updatedAt}`. Field-name normalization exists for several backend casing variants (`title_ar`,
snake_case author, etc.) — keep it or standardize on camelCase server-side.

| Method | Path | Purpose |
|---|---|---|
| GET | `/v1/articles?page&limit(def50)&since` | List |
| GET | `/v1/articles/:id` | Get one |
| POST | `/v1/articles` | Create (JSON or FormData) |
| PATCH | `/v1/articles/:id` | Update |
| DELETE | `/v1/articles/:id` | Soft-delete |

Production backend does **not** support filtering by `category` server-side — client always
filters locally.

---

## 10. Environment / Config Summary

- `NEXT_PUBLIC_USE_MOCK_DATA` — anything other than `"false"` = mock mode on.
- `NEXT_PUBLIC_BASE_URL` (or legacy `NEXT_PUBLIC_API_BASE_URL`) — real backend origin.
- `NEXT_PUBLIC_API_V1_ROOT` (default `/v1`) — path prefix; adjust based on whether
  `NEXT_PUBLIC_BASE_URL` already includes `/api`.
- `AID_HELP_REQUEST_BACKEND_URL` — optional forwarding target for `/api/aid-help-request`.
- Demo accounts: `admin@najat.ps` / `Admin@12345`, `volunteer@najat.ps` / `Volunteer@12345`,
  `resident@najat.ps` / `Resident@12345`. OTP always `123456`.
- Original real backend's base path shape (dead, historical reference only):
  `https://graduation-project-api-production-8251.up.railway.app/api/v1`.
- Two OpenStreetMap Nominatim geocoding calls (address search, admin facility setup) are
  third-party and unrelated to this backend.

---

## 11. `data/*.json` — Full File Inventory & Shapes

| File | Shape | Used by |
|---|---|---|
| `aid_requests_store.json` | `Record<userId, AidRequestRecord[]>` | `/api/aid-requests` |
| `aid_request_status_overrides.json` | `Record<requestId, {status, updatedAt}>` | `/api/aid-requests` PUT fallback + cookie |
| `aid_help_requests_store.json` | `Array<AidHelpRequestForm & {id, createdAt}>` | `/api/aid-help-request` |
| `medical_content_store.json` | currently `[]` — appears unused/leftover | none actively |
| `mock_aid_donors.json` | `AdminAidDonorDetail[]` | `/api/mock/aid-donors` |
| `mock_aid_points.json` | `AdminAidDistributionPoint[]` | `/api/mock/aid-points` |
| `mock_aid_requests.json` | aid-request superset array | `/api/mock/aid-requests` |
| `mock_health_facilities.json` | summary rows array | `/api/mock/health-facilities` |
| `mock_health_facility_forms.json` | `Record<facilityId, FacilitySetupForm>` | `/api/mock/health-facilities` (`?id=`) |
| `mock_medical_content.json` | article-like array | `/api/mock/medical-content` |
| `profile_store.json` | `Record<userId, UserProfile>` (incl. local-only fields + base64 avatar) | `/api/profile` |

Each real backend table replacement should keep the same field names to avoid touching frontend
code: `aid_donors`, `aid_distribution_points`, `aid_requests`, `health_facilities` (+
`health_facility_forms` or a JSONB `form_data` column), `medical_content` (articles),
`user_profiles`.

---

## 12. Cross-cutting notes for the Supabase/Postgres rewrite

1. **Envelope contract to preserve**: single item `{success, statusCode, message?, data,
   timestamp}`; list `{success, statusCode, message?, data: T[], meta:
   {page,limit,totalItems,totalPages,hasNextPage,hasPreviousPage,syncTimestamp}, timestamp}`. Do
   **not** double-nest.
2. **Auth**: JWT payload must include `sub`/`role`/`email` at minimum.
3. **Soft delete convention**: `deletedAt: string|null` on hospitals/pharmacies/labs/clinics/
   dental-clinics/aid/articles/safety-zones/safe-roads/resource-points/users. `GET .../:id` does
   **not** filter deleted items; only list/nearby do.
4. **Status vs full update split**: every facility-like resource has a separate `PATCH
   /:id/status` distinct from `PATCH /:id` — preserve both (optimistic UI relies on the
   lightweight status-only endpoint).
5. **FormData support**: hospitals/pharmacies/labs/clinics/dental-clinics/articles accept
   multipart `POST`/`PATCH` for image uploads — persist images to Supabase Storage, return a URL.
6. **Geo**: `latitude`/`longitude` plain numbers on facilities/aid; full GeoJSON on safety
   entities — a `PostGIS geography` column matches this.
7. **Nearby search**: `radius` in meters, `latitude`/`longitude` (or `lat`/`lng`), haversine sort
   — implementable via `ST_DWithin`/`ST_Distance`.
8. **Persistence tiers today**: mockRouter/localStorage (client-only, per-browser) vs. real
   Next.js Route Handlers + `data/*.json` (server-side, shared) for Profile and Aid Requests only.
   **Every domain should move to shared server-side state in the rewrite.**
9. **Local-only profile fields** (avatar, assistance*, emergencyContacts, sosMessage, bloodType)
   were never sent to the original real backend — decide explicitly whether the new backend
   finally owns them (recommended for emergencyContacts/sosMessage/bloodType given the app's
   crisis-response purpose).
10. **Admin dashboards with partially-mocked data** (Reports, Communication, Security, Maps
    package-editor, main Admin Dashboard landing page) — decide per-widget whether the rewrite
    adds real tables or keeps static content until product prioritizes it.
11. **Offline sync queue** mutation types observed: `DELETE_AID_POINT`, `UPDATE_AID_STATUS`,
    `DELETE_FACILITY`, `UPDATE_FACILITY_STATUS`, `UPDATE_ADMIN_USER`, `SET_ADMIN_USER_ACTIVE`,
    `RESTORE_ADMIN_USER`, `DELETE_ADMIN_USER`, `CREATE_DANGER_ZONE`, `UPDATE_DANGER_ZONE`,
    `DELETE_DANGER_ZONE`, `CREATE_SAFE_ROAD`, `DELETE_SAFE_ROAD`, `CREATE_RESOURCE_POINT`,
    `DELETE_RESOURCE_POINT`, `PROFILE_SYNC` — each replayed later against the same endpoints once
    connectivity returns; the new backend just needs idempotent versions of these same write
    endpoints.
