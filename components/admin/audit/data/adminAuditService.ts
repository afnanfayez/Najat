import {
  exportAdminAuditReportFromApi,
  fetchAdminAuditCompareFromApi,
  fetchAdminAuditDashboardFromApi,
  rejectAdminAuditReportFromApi,
  restoreAdminAuditVersionFromApi,
  updateAdminAuditReportFromApi,
} from '@/lib/api/adminAudit'
import {
  ADMIN_AUDIT_COMPARE_DETAILS,
  ADMIN_AUDIT_DASHBOARD,
  DEFAULT_ADMIN_AUDIT_COMPARE,
} from '@/lib/mocks/adminAuditMockData'
import { USE_MOCK_ADMIN_AUDIT } from '@/lib/mocks/mockConfig'
import type {
  AdminAuditClassificationFilter,
  AdminAuditCompareDetail,
  AdminAuditDashboard,
  AdminAuditFilterTab,
  AdminAuditPriorityFilter,
  AdminAuditReport,
  AdminAuditStats,
  UpdateAdminAuditReportBody,
} from '@/schemas/adminAudit'

function delay(ms = 280): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

let mockAuditStore: AdminAuditDashboard | null = null

function cloneDashboard(data: AdminAuditDashboard): AdminAuditDashboard {
  return structuredClone(data)
}

function getMockAuditDashboard(): AdminAuditDashboard {
  if (!mockAuditStore) {
    mockAuditStore = cloneDashboard(ADMIN_AUDIT_DASHBOARD)
  }
  return mockAuditStore
}

function syncAuditStats(reports: AdminAuditReport[]): AdminAuditStats {
  const base = ADMIN_AUDIT_DASHBOARD.stats
  const pendingUrgent = reports.filter(
    (r) => r.status === 'under_review' && r.priority === 'urgent'
  ).length
  return { ...base, pendingUrgent, totalReports: reports.length }
}

function triggerBlobDownload(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}

export async function fetchAdminAuditDashboard(): Promise<AdminAuditDashboard> {
  if (!USE_MOCK_ADMIN_AUDIT) {
    // TODO: Wire real API when backend adds /v1/admin/audit/* endpoints.
    // Remove NEXT_PUBLIC_ADMIN_AUDIT_MOCK=1 from .env when the endpoint is live.
    return fetchAdminAuditDashboardFromApi()
  }
  await delay()
  return cloneDashboard(getMockAuditDashboard())
}

export function filterAdminAuditReports(
  reports: AdminAuditReport[],
  tab: AdminAuditFilterTab,
  priority: AdminAuditPriorityFilter,
  classification: AdminAuditClassificationFilter
): AdminAuditReport[] {
  return reports.filter((report) => {
    const tabMatch =
      tab === 'all' ||
      (tab === 'under_review' && report.status === 'under_review') ||
      (tab === 'archived' &&
        (report.status === 'archived' || report.status === 'resolved'))
    const priorityMatch = priority === 'all' || report.priority === priority
    const classMatch =
      classification === 'all' || report.classification === classification
    return tabMatch && priorityMatch && classMatch
  })
}

export async function fetchAdminAuditCompare(
  reportId: string
): Promise<AdminAuditCompareDetail> {
  if (!USE_MOCK_ADMIN_AUDIT) {
    return fetchAdminAuditCompareFromApi(reportId)
  }
  await delay()
  return structuredClone(
    ADMIN_AUDIT_COMPARE_DETAILS[reportId] ?? {
      ...DEFAULT_ADMIN_AUDIT_COMPARE,
      reportId,
      id: `compare-${reportId}`,
    }
  )
}

export async function exportAdminAuditReport(reportId?: string): Promise<void> {
  if (!USE_MOCK_ADMIN_AUDIT) {
    const blob = await exportAdminAuditReportFromApi(reportId)
    triggerBlobDownload(blob, `audit-report-${reportId ?? 'all'}.pdf`)
    return
  }
  await delay()
  const content = reportId
    ? `تقرير المراجعة والتدقيق — ${reportId}`
    : 'تقرير المراجعة والتدقيق — شامل'
  triggerBlobDownload(new Blob([content], { type: 'text/plain' }), 'audit-report.txt')
}

export async function restoreAdminAuditVersion(
  reportId: string,
  versionId: string
): Promise<void> {
  if (!USE_MOCK_ADMIN_AUDIT) {
    await restoreAdminAuditVersionFromApi(reportId, versionId)
    return
  }
  await delay(400)
}

export async function rejectAdminAuditReport(
  reportId: string
): Promise<AdminAuditDashboard> {
  if (!USE_MOCK_ADMIN_AUDIT) {
    return rejectAdminAuditReportFromApi(reportId)
  }
  await delay()
  const store = getMockAuditDashboard()
  store.reports = store.reports.map((r) =>
    r.id === reportId
      ? {
          ...r,
          status: 'archived' as const,
          filterTab: 'archived' as const,
          isUrgent: false,
          reviewer: undefined,
        }
      : r
  )
  store.stats = syncAuditStats(store.reports)
  return cloneDashboard(store)
}

export async function updateAdminAuditReport(
  reportId: string,
  body: UpdateAdminAuditReportBody
): Promise<AdminAuditDashboard> {
  if (!USE_MOCK_ADMIN_AUDIT) {
    return updateAdminAuditReportFromApi(reportId, body)
  }
  await delay()
  const store = getMockAuditDashboard()
  store.reports = store.reports.map((r) =>
    r.id === reportId
      ? {
          ...r,
          ...body,
          facilityName: body.facilityName ?? body.targetLocation ?? r.facilityName,
        }
      : r
  )
  return cloneDashboard(store)
}
