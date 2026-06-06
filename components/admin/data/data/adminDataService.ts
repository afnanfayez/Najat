import {
  approveAdminDataRequestFromApi,
  deleteAdminDataRequestFromApi,
  downloadAdminDataReviewReportFromApi,
  exportAdminDataSyncCsvFromApi,
  fetchAdminDataDashboardFromApi,
  fetchAdminDataReviewFromApi,
  fetchAdminDataSyncDashboardFromApi,
  publishAdminDataSyncRequestFromApi,
  publishAllAdminDataSyncFromApi,
  submitAdminDataReviewFromApi,
} from '@/lib/api/adminData'
import {
  ADMIN_DATA_DASHBOARD,
  ADMIN_DATA_REVIEW_DETAILS,
  ADMIN_DATA_SYNC_DASHBOARD,
  DEFAULT_ADMIN_DATA_REVIEW,
} from '@/lib/mocks/adminDataMockData'
import { USE_MOCK_ADMIN_DATA } from '@/lib/mocks/mockConfig'
import type {
  AdminDataDashboard,
  AdminDataDashboardQueryParams,
  AdminDataFilterTab,
  AdminDataRequest,
  AdminDataReviewDetail,
  AdminDataReviewSubmitMode,
  AdminDataStats,
  AdminDataSyncDashboard,
  SubmitAdminDataReviewBody,
} from '@/schemas/adminData'

function delay(ms = 280): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

let mockDashboardStore: AdminDataDashboard | null = null
let mockSyncStore: AdminDataSyncDashboard | null = null

function cloneDashboard(data: AdminDataDashboard): AdminDataDashboard {
  return structuredClone(data)
}

function getMockDashboard(): AdminDataDashboard {
  if (!mockDashboardStore) {
    mockDashboardStore = cloneDashboard(ADMIN_DATA_DASHBOARD)
  }
  return mockDashboardStore
}

function getMockSyncDashboard(): AdminDataSyncDashboard {
  if (!mockSyncStore) {
    mockSyncStore = structuredClone(ADMIN_DATA_SYNC_DASHBOARD)
  }
  return mockSyncStore
}

function recomputeStats(requests: AdminDataRequest[]): AdminDataStats {
  return {
    pendingReview: requests.filter(
      (r) => r.status === 'under_review' || r.status === 'pending_review'
    ).length,
    publishedToday: requests.filter((r) => r.status === 'published').length,
    rejectedRequests: requests.filter((r) => r.status === 'rejected').length,
    activeVolunteers: getMockDashboard().stats.activeVolunteers,
  }
}

/** تصفية الطلبات في الواجهة — أو يُستبدل بتصفية من الباك عبر query params */
export function filterAdminDataRequests(
  requests: AdminDataRequest[],
  tab: AdminDataFilterTab
): AdminDataRequest[] {
  if (tab === 'all') return requests
  return requests.filter((r) => r.filterTab === tab)
}

export async function fetchAdminDataDashboard(
  params: AdminDataDashboardQueryParams = {}
): Promise<AdminDataDashboard> {
  if (!USE_MOCK_ADMIN_DATA) {
    return fetchAdminDataDashboardFromApi(params)
  }

  await delay()
  const dashboard = cloneDashboard(getMockDashboard())
  if (params.filter) {
    dashboard.requests = filterAdminDataRequests(dashboard.requests, params.filter)
  }
  return dashboard
}

export async function fetchAdminDataReview(
  id: string
): Promise<AdminDataReviewDetail | null> {
  if (!USE_MOCK_ADMIN_DATA) {
    return fetchAdminDataReviewFromApi(id)
  }

  await delay()
  const detail = ADMIN_DATA_REVIEW_DETAILS[id] ?? DEFAULT_ADMIN_DATA_REVIEW
  return structuredClone({ ...detail, id })
}

export async function fetchAdminDataSyncDashboard(): Promise<AdminDataSyncDashboard> {
  if (!USE_MOCK_ADMIN_DATA) {
    return fetchAdminDataSyncDashboardFromApi()
  }

  await delay()
  return structuredClone(getMockSyncDashboard())
}

export async function deleteAdminDataRequest(id: string): Promise<void> {
  if (!USE_MOCK_ADMIN_DATA) {
    await deleteAdminDataRequestFromApi(id)
    return
  }

  await delay(180)
  const dashboard = getMockDashboard()
  dashboard.requests = dashboard.requests.filter((r) => r.id !== id)
  dashboard.stats = recomputeStats(dashboard.requests)
}

export async function approveAdminDataRequest(id: string): Promise<void> {
  if (!USE_MOCK_ADMIN_DATA) {
    await approveAdminDataRequestFromApi(id)
    return
  }

  await delay(180)
  const dashboard = getMockDashboard()
  dashboard.requests = dashboard.requests.map((r) =>
    r.id === id
      ? { ...r, status: 'published' as const, filterTab: 'published' as const }
      : r
  )
  dashboard.stats = recomputeStats(dashboard.requests)
}

export async function submitAdminDataReview(
  id: string,
  body: SubmitAdminDataReviewBody,
  mode: AdminDataReviewSubmitMode
): Promise<AdminDataReviewDetail> {
  if (!USE_MOCK_ADMIN_DATA) {
    return submitAdminDataReviewFromApi(id, body, mode)
  }

  await delay(220)
  const detail = (await fetchAdminDataReview(id))!

  const newStatus =
    body.decision === 'reject'
      ? ('rejected' as const)
      : body.decision === 'approve' && mode === 'publish'
        ? ('published' as const)
        : ('pending_review' as const)

  const dashboard = getMockDashboard()
  dashboard.requests = dashboard.requests.map((r) =>
    r.id === id
      ? {
          ...r,
          status: newStatus,
          filterTab:
            newStatus === 'published'
              ? ('published' as const)
              : newStatus === 'rejected'
                ? ('reviewed' as const)
                : ('under_review' as const),
        }
      : r
  )
  dashboard.stats = recomputeStats(dashboard.requests)

  return {
    ...detail,
    auditLog: [
      {
        id: `audit-${Date.now()}`,
        message:
          mode === 'draft'
            ? 'تم حفظ مسودة المراجعة'
            : 'تم اعتماد ونشر البيانات للعموم',
        actor: 'المراجع',
        time: 'الآن',
      },
      ...detail.auditLog,
    ],
  }
}

export async function downloadAdminDataReviewReport(id: string): Promise<void> {
  if (!USE_MOCK_ADMIN_DATA) {
    const blob = await downloadAdminDataReviewReportFromApi(id)
    triggerBlobDownload(blob, `data-review-${id}.pdf`)
    return
  }

  await delay(200)
  const blob = new Blob([`Mock report for request ${id}`], { type: 'text/plain' })
  triggerBlobDownload(blob, `data-review-${id}.txt`)
}

export async function publishAdminDataSyncRequest(id: string): Promise<void> {
  if (!USE_MOCK_ADMIN_DATA) {
    await publishAdminDataSyncRequestFromApi(id)
    return
  }

  await delay(180)
  const sync = getMockSyncDashboard()
  sync.acceptedRequests = sync.acceptedRequests.filter((r) => r.id !== id)
  sync.syncStatus.queueCount = Math.max(0, sync.syncStatus.queueCount - 1)
}

export async function publishAllAdminDataSync(): Promise<void> {
  if (!USE_MOCK_ADMIN_DATA) {
    await publishAllAdminDataSyncFromApi()
    return
  }

  await delay(250)
  const sync = getMockSyncDashboard()
  sync.acceptedRequests = []
  sync.syncStatus.queueCount = 0
  sync.syncStatus.lastSyncAgo = 'الآن'
}

export async function exportAdminDataSyncCsv(): Promise<void> {
  if (!USE_MOCK_ADMIN_DATA) {
    const blob = await exportAdminDataSyncCsvFromApi()
    triggerBlobDownload(blob, 'sync-requests.csv')
    return
  }

  await delay(200)
  const sync = getMockSyncDashboard()
  const header = 'code,location,dataType,acceptedAt,priority\n'
  const rows = sync.acceptedRequests
    .map(
      (r) =>
        `${r.code},${r.location},${r.dataType},${r.acceptedAt},${r.priority}`
    )
    .join('\n')
  const blob = new Blob([header + rows], { type: 'text/csv;charset=utf-8' })
  triggerBlobDownload(blob, 'sync-requests.csv')
}

function triggerBlobDownload(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob)
  const anchor = document.createElement('a')
  anchor.href = url
  anchor.download = filename
  anchor.click()
  URL.revokeObjectURL(url)
}
