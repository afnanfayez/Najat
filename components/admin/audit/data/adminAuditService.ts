import {
  exportAdminAuditReportFromApi,
  fetchAdminAuditCompareFromApi,
  fetchAdminAuditDashboardFromApi,
  rejectAdminAuditReportFromApi,
  restoreAdminAuditVersionFromApi,
  updateAdminAuditReportFromApi,
} from '@/lib/api/adminAudit'
import type {
  AdminAuditClassificationFilter,
  AdminAuditCompareDetail,
  AdminAuditDashboard,
  AdminAuditFilterTab,
  AdminAuditPriorityFilter,
  AdminAuditReport,
  UpdateAdminAuditReportBody,
} from '@/schemas/adminAudit'

function triggerBlobDownload(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}

export async function fetchAdminAuditDashboard(): Promise<AdminAuditDashboard> {
  return fetchAdminAuditDashboardFromApi()
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
  return fetchAdminAuditCompareFromApi(reportId)
}

export async function exportAdminAuditReport(reportId?: string): Promise<void> {
  const blob = await exportAdminAuditReportFromApi(reportId)
  triggerBlobDownload(blob, `audit-report-${reportId ?? 'all'}.json`)
}

export async function restoreAdminAuditVersion(
  reportId: string,
  versionId: string
): Promise<void> {
  await restoreAdminAuditVersionFromApi(reportId, versionId)
}

export async function rejectAdminAuditReport(
  reportId: string
): Promise<AdminAuditDashboard> {
  return rejectAdminAuditReportFromApi(reportId)
}

export async function updateAdminAuditReport(
  reportId: string,
  body: UpdateAdminAuditReportBody
): Promise<AdminAuditDashboard> {
  return updateAdminAuditReportFromApi(reportId, body)
}
