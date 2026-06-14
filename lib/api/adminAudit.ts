import { request } from '@/lib/api/api'
import type {
  AdminAuditCompareDetail,
  AdminAuditDashboard,
  AdminAuditReport,
  AdminAuditReportStatus,
  UpdateAdminAuditReportBody,
} from '@/schemas/adminAudit'

const V1 = '/v1/admin/audit'

interface ApiAuditDashboard {
  approvedCount?: number
  pendingCount?: number
  rejectedCount?: number
  complianceRating?: number
}

interface ApiAuditReport {
  id: string
  title?: string
  description?: string
  content?: string
  status?: string
  versionHistory?: Array<{ version?: string; content?: string; timestamp?: string }>
  createdAt?: string
  updatedAt?: string
  // Alternative field names that some API versions use
  entityName?: string
  action?: string
  payload?: unknown
  reviewNotes?: string | null
  isDraft?: boolean
  nodeId?: string
  requestType?: string
  changesData?: unknown
  submittedAt?: string
  facilityName?: string
  issueType?: string
  targetLocation?: string
  region?: string
  reporter?: string
  isUrgent?: boolean
}

function unwrap<T>(raw: unknown, key?: string): T {
  if (!raw || typeof raw !== 'object') return raw as T
  const obj = raw as Record<string, unknown>
  if (key && obj[key] != null) return obj[key] as T
  if (obj.data != null) return unwrap<T>(obj.data, key)
  return raw as T
}

function unwrapArray<T>(raw: unknown): T[] {
  if (Array.isArray(raw)) return raw as T[]
  if (raw && typeof raw === 'object') {
    const obj = raw as Record<string, unknown>
    if (Array.isArray(obj.data)) return obj.data as T[]
    if (obj.data && typeof obj.data === 'object') {
      const inner = obj.data as Record<string, unknown>
      if (Array.isArray(inner.data)) return inner.data as T[]
    }
  }
  return []
}

function adaptApiAuditReport(r: ApiAuditReport): AdminAuditReport {
  const statusMap: Record<string, AdminAuditReportStatus> = {
    approved: 'resolved',
    published: 'resolved',
    pending: 'under_review',
    under_review: 'under_review',
    rejected: 'archived',
  }
  const status: AdminAuditReportStatus = statusMap[r.status ?? ''] ?? 'under_review'

  // Support multiple field naming conventions from the API
  const facilityName =
    r.facilityName ??
    r.title ??
    r.entityName ??
    r.nodeId ??
    '—'

  const issueType =
    r.issueType ??
    r.description ??
    r.action ??
    r.requestType ??
    r.title ??
    'مراجعة عامة'

  const dateRaw = r.createdAt ?? r.submittedAt

  return {
    id: r.id,
    facilityName,
    issueType,
    classification: 'medical',
    priority: 'normal',
    status,
    targetLocation: r.targetLocation ?? r.reviewNotes ?? '—',
    region: r.region ?? '—',
    reporter: r.reporter ?? '—',
    reportDate: dateRaw
      ? new Date(dateRaw).toLocaleDateString('ar-EG')
      : '—',
    isUrgent: r.isUrgent ?? false,
    filterTab: status === 'under_review' ? 'under_review' : 'archived',
  }
}

export async function fetchAdminAuditDashboardFromApi(): Promise<AdminAuditDashboard> {
  const [dashRaw, reportsRaw] = await Promise.all([
    request(`${V1}/dashboard`, { method: 'GET' }),
    request(`${V1}/reports`, { method: 'GET' }),
  ])

  const dash = unwrap<ApiAuditDashboard>(dashRaw)
  const reports: ApiAuditReport[] = unwrapArray<ApiAuditReport>(reportsRaw)
  const adapted = reports.map(adaptApiAuditReport)

  const pending = dash.pendingCount ?? adapted.filter((r) => r.status === 'under_review').length
  const resolved = dash.approvedCount ?? adapted.filter((r) => r.status === 'resolved').length
  const urgent = adapted.filter((r) => r.isUrgent).length

  return {
    stats: {
      totalReports: adapted.length,
      resolvedWeekly: resolved,
      pendingUrgent: urgent,
      pointsSpent: pending,
    },
    reports: adapted,
  }
}

export async function fetchAdminAuditCompareFromApi(
  reportId: string
): Promise<AdminAuditCompareDetail> {
  const response = await request(`${V1}/reports/${reportId}/compare`, { method: 'GET' })
  const raw = unwrap<Record<string, unknown>>(response)

  return {
    id: String(raw.id ?? `compare-${reportId}`),
    reportId,
    title: String(raw.title ?? 'مقارنة الإصدارات'),
    subtitle: String(raw.subtitle ?? ''),
    changes: Array.isArray(raw.changes) ? raw.changes : [],
    recoveryBullets: Array.isArray(raw.recoveryBullets) ? raw.recoveryBullets : [],
    recoveryWarning: String(raw.recoveryWarning ?? ''),
    recoveryFooterNote: raw.recoveryFooterNote ? String(raw.recoveryFooterNote) : undefined,
    versions: Array.isArray(raw.versions) ? raw.versions : [],
  }
}

export async function exportAdminAuditReportFromApi(reportId?: string): Promise<Blob> {
  const path = reportId ? `${V1}/reports/${reportId}/export` : `${V1}/export`
  const response = await request(path, { method: 'GET' })
  if (response instanceof Blob) return response
  return new Blob([JSON.stringify(response)], { type: 'application/json' })
}

export async function restoreAdminAuditVersionFromApi(
  reportId: string,
  versionId: string
): Promise<void> {
  await request(`${V1}/reports/${reportId}/versions/${versionId}/restore`, {
    method: 'POST',
  })
}

export async function rejectAdminAuditReportFromApi(
  reportId: string
): Promise<AdminAuditDashboard> {
  await request(`${V1}/reports/${reportId}/reject`, { method: 'POST' })
  return fetchAdminAuditDashboardFromApi()
}

export async function updateAdminAuditReportFromApi(
  reportId: string,
  body: UpdateAdminAuditReportBody
): Promise<AdminAuditDashboard> {
  const apiBody = {
    title: body.facilityName ?? body.issueType,
    description: body.targetLocation ?? body.reporter,
  }
  await request(`${V1}/reports/${reportId}`, {
    method: 'PATCH',
    body: JSON.stringify(apiBody),
  })
  return fetchAdminAuditDashboardFromApi()
}
