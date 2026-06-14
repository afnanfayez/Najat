import { request } from '@/lib/api/api'
import { getToken } from '@/lib/api/auth'
import type {
  AdminDataDashboard,
  AdminDataDashboardQueryParams,
  AdminDataRequest,
  AdminDataRequestStatus,
  AdminDataReviewDetail,
  AdminDataSyncDashboard,
  SubmitAdminDataReviewBody,
} from '@/schemas/adminData'

const V1 = '/v1/admin/data'

interface ApiDataDashboard {
  totalSyncRequests?: number
  pendingApprovalsCount?: number
  approvedChangesCount?: number
  errorRatePercentage?: number
  syncHealthStatus?: string
}

interface ApiDataSyncRequest {
  id: string
  // Fields from actual API response
  entityName?: string
  action?: string
  payload?: unknown
  reviewNotes?: string | null
  isDraft?: boolean
  createdAt?: string
  updatedAt?: string | null
  deletedAt?: string | null
  // Legacy field names (kept for backward compat)
  nodeId?: string
  requestType?: string
  changesData?: unknown
  submittedAt?: string
  reviewedAt?: string | null
  reviewedBy?: string | null
  status?: string
  // Danger zone / polygon fields
  area?: string
  dangerLevel?: string
  description?: string
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

function adaptDataRequest(r: ApiDataSyncRequest): AdminDataRequest {
  const statusMap: Record<string, AdminDataRequestStatus> = {
    pending: 'pending_review',
    approved: 'published',
    published: 'published',
    rejected: 'rejected',
    under_review: 'under_review',
  }
  const rawStatus = r.status ?? ''
  const status: AdminDataRequestStatus = statusMap[rawStatus] ?? 'under_review'
  const filterTabMap: Record<AdminDataRequestStatus, AdminDataRequest['filterTab']> = {
    published: 'published',
    rejected: 'reviewed',
    under_review: 'under_review',
    pending_review: 'under_review',
  }

  // Build title from actual API fields
  const entityName = r.entityName ?? r.requestType ?? r.nodeId ?? ''
  const action = r.action ?? ''
  const title = entityName && action
    ? `${action}: ${entityName}`
    : entityName || action || 'طلب مزامنة'

  // Build subtitle from area/description or payload
  const subtitle = r.description
    ?? r.area
    ?? (r.payload ? (r.payload as Record<string, unknown>)?.name as string : undefined)
    ?? r.nodeId
    ?? '—'

  // Build description from payload or changesData
  const changesData = r.payload ?? r.changesData
  const description = changesData
    ? JSON.stringify(changesData, null, 0).slice(0, 120)
    : r.reviewNotes ?? '—'

  // Date from createdAt or submittedAt
  const dateRaw = r.createdAt ?? r.submittedAt
  const submittedAt = dateRaw
    ? new Date(dateRaw).toLocaleDateString('ar-EG')
    : '—'

  return {
    id: r.id,
    title,
    subtitle,
    description,
    status,
    volunteerName: r.reviewNotes ?? r.reviewedBy ?? '—',
    submittedAt,
    filterTab: filterTabMap[status],
  }
}

export async function fetchAdminDataDashboardFromApi(
  _params: AdminDataDashboardQueryParams = {}
): Promise<AdminDataDashboard> {
  const [dashRaw, syncRaw] = await Promise.all([
    request(`${V1}/dashboard`, { method: 'GET' }),
    request(`${V1}/sync`, { method: 'GET' }),
  ])

  const dash = unwrap<ApiDataDashboard>(dashRaw)
  const syncRequests: ApiDataSyncRequest[] = unwrapArray<ApiDataSyncRequest>(syncRaw)
  const requests = syncRequests.map(adaptDataRequest)

  return {
    stats: {
      pendingReview: dash.pendingApprovalsCount ?? requests.filter((r) => r.status === 'pending_review' || r.status === 'under_review').length,
      publishedToday: dash.approvedChangesCount ?? requests.filter((r) => r.status === 'published').length,
      rejectedRequests: requests.filter((r) => r.status === 'rejected').length,
      activeVolunteers: 0,
    },
    requests,
  }
}

export async function fetchAdminDataReviewFromApi(
  id: string
): Promise<AdminDataReviewDetail> {
  const response = await request(`${V1}/requests/${id}/review`, { method: 'GET' })
  const raw = unwrap<ApiDataSyncRequest & Record<string, unknown>>(response)

  const entityName = String(raw.entityName ?? raw.nodeId ?? '—')
  const action = String(raw.action ?? raw.requestType ?? '—')
  const title = entityName !== '—' && action !== '—'
    ? `${action}: ${entityName}`
    : entityName !== '—' ? entityName : action !== '—' ? action : 'طلب مزامنة'
  const dateRaw = raw.createdAt ?? raw.submittedAt
  const reviewDateRaw = raw.updatedAt ?? raw.reviewedAt
  const changesData = raw.payload ?? raw.changesData

  return {
    id: String(raw.id ?? id),
    requestCode: String(raw.id ?? id).slice(0, 8),
    title,
    submittedAgo: dateRaw
      ? new Date(String(dateRaw)).toLocaleDateString('ar-EG')
      : '—',
    facilityName: entityName,
    facilityType: action,
    location: String(raw.description ?? raw.area ?? '—'),
    lastFieldUpdate: reviewDateRaw ? new Date(String(reviewDateRaw)).toLocaleDateString('ar-EG') : '—',
    isOpen: (raw.status ?? '') === 'pending' || (raw.status ?? '') === 'under_review',
    inventory: [],
    services: [],
    sourceNotes: changesData ? JSON.stringify(changesData, null, 2) : String(raw.reviewNotes ?? '—'),
    auditLog: [],
  }
}

export async function fetchAdminDataSyncDashboardFromApi(): Promise<AdminDataSyncDashboard> {
  const [dashRaw, syncRaw] = await Promise.all([
    request(`${V1}/dashboard`, { method: 'GET' }),
    request(`${V1}/sync`, { method: 'GET' }),
  ])

  const dash = unwrap<ApiDataDashboard>(dashRaw)
  const syncRequests: ApiDataSyncRequest[] = unwrapArray<ApiDataSyncRequest>(syncRaw)
  const accepted = syncRequests
    .filter((r) => r.status === 'approved' || r.status === 'published')
    .map((r) => ({
      id: r.id,
      code: (r.entityName ?? r.nodeId ?? r.id).slice(0, 8),
      location: r.description ?? r.area ?? '—',
      dataType: r.action ?? r.requestType ?? r.entityName ?? '—',
      acceptedAt: (r.updatedAt ?? r.reviewedAt ?? r.createdAt)
        ? new Date(String(r.updatedAt ?? r.reviewedAt ?? r.createdAt)).toLocaleDateString('ar-EG')
        : '—',
      priority: 'medium' as const,
    }))

  return {
    syncStatus: {
      lastSyncAgo: '—',
      successRate: Math.max(0, 100 - (dash.errorRatePercentage ?? 0)),
      queueCount: dash.pendingApprovalsCount ?? 0,
    },
    acceptedRequests: accepted,
    activityLog: [],
  }
}

export async function deleteAdminDataRequestFromApi(_id: string): Promise<void> {
  throw { status: 501, message: 'حذف الطلبات غير متاح حالياً' }
}

export async function approveAdminDataRequestFromApi(_id: string): Promise<void> {
  throw { status: 501, message: 'الموافقة المباشرة غير متاحة — استخدم صفحة المراجعة' }
}

export async function submitAdminDataReviewFromApi(
  id: string,
  body: SubmitAdminDataReviewBody,
  mode: 'draft' | 'publish'
): Promise<AdminDataReviewDetail> {
  await request(`${V1}/requests/${id}/review`, {
    method: 'POST',
    body: JSON.stringify({ ...body, mode }),
  })
  return fetchAdminDataReviewFromApi(id)
}

export async function downloadAdminDataReviewReportFromApi(id: string): Promise<Blob> {
  const token =
    typeof window !== 'undefined' ? getToken() : null

  const base =
    process.env.NEXT_PUBLIC_BASE_URL ||
    process.env.NEXT_PUBLIC_API_BASE_URL ||
    ''
  const res = await fetch(`${base}${V1}/requests/${id}/report`, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  })
  if (!res.ok) throw new Error('تعذّر تحميل التقرير')
  return res.blob()
}

export async function publishAdminDataSyncRequestFromApi(_id: string): Promise<void> {
  throw { status: 501, message: 'نشر الطلبات الفردية غير متاح حالياً' }
}

export async function publishAllAdminDataSyncFromApi(): Promise<void> {
  throw { status: 501, message: 'النشر الجماعي غير متاح حالياً' }
}

export async function exportAdminDataSyncCsvFromApi(): Promise<Blob> {
  const token =
    typeof window !== 'undefined' ? getToken() : null

  const base =
    process.env.NEXT_PUBLIC_BASE_URL ||
    process.env.NEXT_PUBLIC_API_BASE_URL ||
    ''
  const res = await fetch(`${base}${V1}/sync/export`, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  })
  if (!res.ok) throw new Error('تعذّر تصدير الملف')
  return res.blob()
}
