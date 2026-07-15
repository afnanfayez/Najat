import { simulateDelay } from '@/lib/mocks/store/delay'
import { MockHttpError } from '@/lib/mocks/store/errorTriggers'
import type { MockRequestBody } from '@/lib/mocks/formDataUtils'
import type { CrudResource } from '@/lib/mocks/crud/createCrudResource'
import * as authHandlers from '@/lib/mocks/handlers/auth.mock'
import { hospitalsResource } from '@/lib/mocks/resources/hospitals.mock'
import { pharmaciesResource } from '@/lib/mocks/resources/pharmacies.mock'
import { labsResource } from '@/lib/mocks/resources/labs.mock'
import { clinicsResource } from '@/lib/mocks/resources/clinics.mock'
import { dentalClinicsResource } from '@/lib/mocks/resources/dentalClinics.mock'
import { articlesResource } from '@/lib/mocks/resources/articles.mock'
import { aidResource } from '@/lib/mocks/resources/aid.mock'
import { safetyZonesResource } from '@/lib/mocks/resources/safetyZones.mock'
import { safeRoadsResource } from '@/lib/mocks/resources/safetyRoads.mock'
import { resourcePointsResource } from '@/lib/mocks/resources/safetyResourcePoints.mock'
import * as safetyMisc from '@/lib/mocks/handlers/safetyMisc.mock'
import * as providers from '@/lib/mocks/handlers/providers.mock'
import * as adminUsers from '@/lib/mocks/handlers/adminUsers.mock'
import * as adminSecurity from '@/lib/mocks/handlers/adminSecurity.mock'
import * as adminAudit from '@/lib/mocks/handlers/adminAudit.mock'
import * as adminReports from '@/lib/mocks/handlers/adminReports.mock'
import * as adminStats from '@/lib/mocks/handlers/adminStats.mock'
import * as adminCommunication from '@/lib/mocks/handlers/adminCommunication.mock'
import * as adminData from '@/lib/mocks/handlers/adminData.mock'
import * as adminAlerts from '@/lib/mocks/handlers/adminAlerts.mock'

type Handler = (
  match: RegExpMatchArray,
  query: URLSearchParams,
  options: RequestInit,
) => unknown | Promise<unknown>

interface RouteDef {
  method: string
  regex: RegExp
  handler: Handler
}

const routes: RouteDef[] = []

/** Registers the standard list/nearby/getById/create/update/delete/status routes for a CRUD resource. */
function registerCrudRoutes<T extends { id: string }>(
  base: string,
  resource: CrudResource<T>,
  options?: { statusField?: string; nearby?: boolean },
) {
  const statusField = options?.statusField ?? 'status'
  if (options?.nearby !== false) {
    routes.push({
      method: 'GET',
      regex: new RegExp(`^${base}/nearby$`),
      handler: (_m, query) => resource.nearby(query),
    })
  }
  routes.push(
    {
      method: 'GET',
      regex: new RegExp(`^${base}$`),
      handler: (_m, query) => resource.list(query),
    },
    {
      method: 'GET',
      regex: new RegExp(`^${base}/([^/]+)$`),
      handler: (m) => resource.getById(decodeURIComponent(m[1])),
    },
    {
      method: 'POST',
      regex: new RegExp(`^${base}$`),
      handler: (_m, _q, opts) => resource.create(opts.body as MockRequestBody),
    },
    {
      method: 'PATCH',
      regex: new RegExp(`^${base}/([^/]+)/status$`),
      handler: (m, _q, opts) =>
        resource.updateStatus(decodeURIComponent(m[1]), opts.body as MockRequestBody, statusField),
    },
    {
      method: 'PATCH',
      regex: new RegExp(`^${base}/([^/]+)$`),
      handler: (m, _q, opts) => resource.update(decodeURIComponent(m[1]), opts.body as MockRequestBody),
    },
    {
      method: 'DELETE',
      regex: new RegExp(`^${base}/([^/]+)$`),
      handler: (m) => resource.remove(decodeURIComponent(m[1])),
    },
  )
}

// ── Auth ─────────────────────────────────────────────────────────────────────
routes.push(
  { method: 'POST', regex: /^\/auth\/register$/, handler: (_m, _q, o) => authHandlers.handleRegister(o.body as MockRequestBody) },
  { method: 'POST', regex: /^\/auth\/login$/, handler: (_m, _q, o) => authHandlers.handleLogin(o.body as MockRequestBody) },
  { method: 'POST', regex: /^\/auth\/verify$/, handler: (_m, _q, o) => authHandlers.handleVerify(o.body as MockRequestBody) },
  { method: 'POST', regex: /^\/auth\/forgot-password$/, handler: (_m, _q, o) => authHandlers.handleForgotPassword(o.body as MockRequestBody) },
  { method: 'POST', regex: /^\/auth\/reset-password$/, handler: (_m, _q, o) => authHandlers.handleResetPassword(o.body as MockRequestBody) },
)

// ── Health facilities (identical CRUD+nearby+status shape ×5) ───────────────
registerCrudRoutes('/hospitals', hospitalsResource, { statusField: 'status' })
registerCrudRoutes('/pharmacies', pharmaciesResource, { statusField: 'status' })
registerCrudRoutes('/labs', labsResource, { statusField: 'status' })
registerCrudRoutes('/clinics', clinicsResource, { statusField: 'status' })
registerCrudRoutes('/dental-clinics', dentalClinicsResource, { statusField: 'status' })

// ── Articles ─────────────────────────────────────────────────────────────────
registerCrudRoutes('/articles', articlesResource, { nearby: false })

// ── Aid points ───────────────────────────────────────────────────────────────
registerCrudRoutes('/aid', aidResource, { statusField: 'status' })

// ── Safety (danger zones / safe roads / resource points) ────────────────────
routes.push(
  { method: 'GET', regex: /^\/safety\/map-data$/, handler: () => safetyMisc.getMapData() },
  { method: 'GET', regex: /^\/safety\/check$/, handler: (_m, q) => safetyMisc.checkSafety(q) },
)
routes.push(
  { method: 'GET', regex: /^\/safety\/zones$/, handler: (_m, q) => safetyZonesResource.list(q) },
  { method: 'GET', regex: /^\/safety\/zones\/([^/]+)$/, handler: (m) => safetyZonesResource.getById(decodeURIComponent(m[1])) },
  { method: 'POST', regex: /^\/safety\/zones$/, handler: (_m, _q, o) => safetyZonesResource.create(o.body as MockRequestBody) },
  { method: 'PATCH', regex: /^\/safety\/zones\/([^/]+)$/, handler: (m, _q, o) => safetyZonesResource.update(decodeURIComponent(m[1]), o.body as MockRequestBody) },
  { method: 'DELETE', regex: /^\/safety\/zones\/([^/]+)$/, handler: (m) => safetyZonesResource.remove(decodeURIComponent(m[1])) },
  { method: 'POST', regex: /^\/safety\/safe-roads$/, handler: (_m, _q, o) => safeRoadsResource.create(o.body as MockRequestBody) },
  { method: 'DELETE', regex: /^\/safety\/safe-roads\/([^/]+)$/, handler: (m) => safeRoadsResource.remove(decodeURIComponent(m[1])) },
  { method: 'POST', regex: /^\/safety\/resource-points$/, handler: (_m, _q, o) => resourcePointsResource.create(o.body as MockRequestBody) },
  { method: 'DELETE', regex: /^\/safety\/resource-points\/([^/]+)$/, handler: (m) => resourcePointsResource.remove(decodeURIComponent(m[1])) },
)

// ── Providers (composed read-only view over the 5 facility buckets) ────────
routes.push(
  { method: 'GET', regex: /^\/providers\/nearby$/, handler: (_m, q) => providers.nearby(q) },
  { method: 'GET', regex: /^\/providers$/, handler: (_m, q) => providers.list(q) },
)

// ── Admin: Users ──────────────────────────────────────────────────────────────
routes.push(
  { method: 'GET', regex: /^\/admin\/users\/stats$/, handler: () => adminUsers.getStats() },
  { method: 'GET', regex: /^\/admin\/users$/, handler: (_m, q) => adminUsers.listUsers(q) },
  { method: 'GET', regex: /^\/users$/, handler: (_m, q) => adminUsers.listUsersWithDeleted(q) },
  { method: 'GET', regex: /^\/admin\/users\/([^/]+)$/, handler: (m) => adminUsers.getUserById(decodeURIComponent(m[1])) },
  { method: 'PUT', regex: /^\/admin\/users\/([^/]+)$/, handler: (m, _q, o) => adminUsers.updateUser(decodeURIComponent(m[1]), o.body as MockRequestBody) },
  { method: 'PATCH', regex: /^\/admin\/users\/([^/]+)\/status$/, handler: (m, _q, o) => adminUsers.setActive(decodeURIComponent(m[1]), o.body as MockRequestBody) },
  { method: 'PATCH', regex: /^\/admin\/users\/([^/]+)\/verify$/, handler: (m, _q, o) => adminUsers.setVerified(decodeURIComponent(m[1]), o.body as MockRequestBody) },
  { method: 'PATCH', regex: /^\/admin\/users\/([^/]+)\/restore$/, handler: (m) => adminUsers.restoreUser(decodeURIComponent(m[1])) },
  { method: 'DELETE', regex: /^\/admin\/users\/([^/]+)$/, handler: (m) => adminUsers.deleteUser(decodeURIComponent(m[1])) },
  { method: 'POST', regex: /^\/users\/volunteers$/, handler: (_m, _q, o) => adminUsers.createVolunteer(o.body as MockRequestBody) },
  { method: 'POST', regex: /^\/users\/residents$/, handler: (_m, _q, o) => adminUsers.createResident(o.body as MockRequestBody) },
)

// ── Admin: bespoke dashboards ─────────────────────────────────────────────────
routes.push(
  { method: 'GET', regex: /^\/admin\/security\/dashboard$/, handler: () => adminSecurity.getDashboard() },
  { method: 'PUT', regex: /^\/admin\/security\/backup\/schedule$/, handler: (_m, _q, o) => adminSecurity.updateBackupSchedule(o.body as MockRequestBody) },
  { method: 'POST', regex: /^\/admin\/security\/backup$/, handler: () => adminSecurity.runBackup() },

  { method: 'GET', regex: /^\/admin\/audit\/dashboard$/, handler: () => adminAudit.getDashboard() },
  { method: 'GET', regex: /^\/admin\/audit\/reports\/([^/]+)\/compare$/, handler: (m) => adminAudit.compareReport(decodeURIComponent(m[1])) },
  { method: 'GET', regex: /^\/admin\/audit\/reports\/([^/]+)\/export$/, handler: (m) => adminAudit.exportReport(decodeURIComponent(m[1])) },
  { method: 'GET', regex: /^\/admin\/audit\/export$/, handler: () => adminAudit.exportAll() },
  { method: 'GET', regex: /^\/admin\/audit\/reports$/, handler: (_m, q) => adminAudit.listReports(q) },
  { method: 'POST', regex: /^\/admin\/audit\/reports\/([^/]+)\/versions\/([^/]+)\/restore$/, handler: (m) => adminAudit.restoreVersion(decodeURIComponent(m[1]), decodeURIComponent(m[2])) },
  { method: 'POST', regex: /^\/admin\/audit\/reports\/([^/]+)\/reject$/, handler: (m) => adminAudit.rejectReport(decodeURIComponent(m[1])) },
  { method: 'PATCH', regex: /^\/admin\/audit\/reports\/([^/]+)$/, handler: (m, _q, o) => adminAudit.updateReport(decodeURIComponent(m[1]), o.body as MockRequestBody) },

  { method: 'GET', regex: /^\/admin\/reports\/dashboard$/, handler: () => adminReports.getDashboard() },

  { method: 'GET', regex: /^\/admin\/stats$/, handler: () => adminStats.getStats() },

  { method: 'GET', regex: /^\/admin\/communication\/dashboard$/, handler: () => adminCommunication.getDashboard() },
  { method: 'POST', regex: /^\/admin\/communication\/tasks$/, handler: (_m, _q, o) => adminCommunication.createTask(o.body as MockRequestBody) },
  { method: 'POST', regex: /^\/admin\/communication\/broadcasts$/, handler: (_m, _q, o) => adminCommunication.launchBroadcast(o.body as MockRequestBody) },
  { method: 'GET', regex: /^\/admin\/communication\/broadcasts\/export$/, handler: () => adminCommunication.exportBroadcasts() },
  { method: 'GET', regex: /^\/admin\/communication\/feedback\/export$/, handler: () => adminCommunication.exportFeedback() },

  { method: 'GET', regex: /^\/admin\/data\/dashboard$/, handler: () => adminData.getDashboard() },
  { method: 'GET', regex: /^\/admin\/data\/sync$/, handler: () => adminData.getSync() },
  { method: 'GET', regex: /^\/admin\/data\/requests\/([^/]+)\/review$/, handler: (m) => adminData.getReview(decodeURIComponent(m[1])) },
  // Note: GET .../report and GET .../sync/export bypass request() entirely via raw
  // fetch() in lib/api/adminData.ts (binary blob downloads) — their mock branches
  // live there directly instead of here; see isMockMode() checks in that file.
  { method: 'POST', regex: /^\/admin\/data\/requests\/([^/]+)\/review$/, handler: (m, _q, o) => adminData.submitReview(decodeURIComponent(m[1]), o.body as MockRequestBody) },
  { method: 'DELETE', regex: /^\/admin\/data\/requests\/([^/]+)$/, handler: (m) => adminData.deleteRequest(decodeURIComponent(m[1])) },
  { method: 'POST', regex: /^\/admin\/data\/requests\/([^/]+)\/approve$/, handler: (m) => adminData.approveRequest(decodeURIComponent(m[1])) },
  { method: 'POST', regex: /^\/admin\/data\/sync\/requests\/([^/]+)\/publish$/, handler: (m) => adminData.publishRequest(decodeURIComponent(m[1])) },
  { method: 'POST', regex: /^\/admin\/data\/sync\/publish-all$/, handler: () => adminData.publishAll() },

  { method: 'GET', regex: /^\/admin\/alerts$/, handler: () => adminAlerts.getAlerts() },
)

const V1_ROOT = process.env.NEXT_PUBLIC_API_V1_ROOT?.replace(/\/$/, '') ?? '/v1'

function stripV1Root(path: string): string {
  if (path.startsWith(V1_ROOT)) return path.slice(V1_ROOT.length) || '/'
  if (path.startsWith('/v1')) return path.slice(3) || '/'
  return path
}

/** Single entry point: pattern-matches (method, endpoint) against the table above. */
export async function dispatchMock(endpoint: string, options: RequestInit): Promise<unknown> {
  await simulateDelay()
  const method = (options.method ?? 'GET').toUpperCase()
  const [rawPath, queryString] = endpoint.split('?')
  const path = stripV1Root(rawPath)
  const query = new URLSearchParams(queryString ?? '')

  for (const route of routes) {
    if (route.method !== method) continue
    const match = path.match(route.regex)
    if (match) {
      return route.handler(match, query, options)
    }
  }

  throw new MockHttpError(404, `Mock route not found: ${method} ${endpoint}`)
}
