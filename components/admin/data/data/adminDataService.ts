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
import type {
  AdminDataDashboard,
  AdminDataDashboardQueryParams,
  AdminDataFilterTab,
  AdminDataRequest,
  AdminDataReviewDetail,
  AdminDataReviewSubmitMode,
  AdminDataSyncDashboard,
  SubmitAdminDataReviewBody,
} from '@/schemas/adminData'

function triggerBlobDownload(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob)
  const anchor = document.createElement('a')
  anchor.href = url
  anchor.download = filename
  anchor.click()
  URL.revokeObjectURL(url)
}

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
  const dashboard = await fetchAdminDataDashboardFromApi(params)
  if (params.filter) {
    dashboard.requests = filterAdminDataRequests(dashboard.requests, params.filter)
  }
  return dashboard
}

export async function fetchAdminDataReview(
  id: string
): Promise<AdminDataReviewDetail | null> {
  return fetchAdminDataReviewFromApi(id)
}

export async function fetchAdminDataSyncDashboard(): Promise<AdminDataSyncDashboard> {
  return fetchAdminDataSyncDashboardFromApi()
}

export async function deleteAdminDataRequest(id: string): Promise<void> {
  await deleteAdminDataRequestFromApi(id)
}

export async function approveAdminDataRequest(id: string): Promise<void> {
  await approveAdminDataRequestFromApi(id)
}

export async function submitAdminDataReview(
  id: string,
  body: SubmitAdminDataReviewBody,
  mode: AdminDataReviewSubmitMode
): Promise<AdminDataReviewDetail> {
  return submitAdminDataReviewFromApi(id, body, mode)
}

export async function downloadAdminDataReviewReport(id: string): Promise<void> {
  const blob = await downloadAdminDataReviewReportFromApi(id)
  triggerBlobDownload(blob, `data-review-${id}.pdf`)
}

export async function publishAdminDataSyncRequest(id: string): Promise<void> {
  await publishAdminDataSyncRequestFromApi(id)
}

export async function publishAllAdminDataSync(): Promise<{ processed: number; details: Array<{ id: string; success: boolean; error?: string }> }> {
  return publishAllAdminDataSyncFromApi()
}

export async function exportAdminDataSyncCsv(): Promise<void> {
  const blob = await exportAdminDataSyncCsvFromApi()
  triggerBlobDownload(blob, 'sync-requests.csv')
}
