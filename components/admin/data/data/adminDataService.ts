import { toast } from 'sonner'
import {
  downloadAdminDataReviewReportFromApi,
  exportAdminDataSyncCsvFromApi,
  fetchAdminDataDashboardFromApi,
  fetchAdminDataReviewFromApi,
  fetchAdminDataSyncDashboardFromApi,
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

export async function deleteAdminDataRequest(_id: string): Promise<void> {
  toast.error('حذف الطلبات غير متاح حالياً')
}

export async function approveAdminDataRequest(_id: string): Promise<void> {
  toast.error('الموافقة المباشرة غير متاحة — استخدم صفحة المراجعة')
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

export async function publishAdminDataSyncRequest(_id: string): Promise<void> {
  toast.error('نشر الطلبات الفردية غير متاح حالياً')
}

export async function publishAllAdminDataSync(): Promise<void> {
  toast.error('النشر الجماعي غير متاح حالياً')
}

export async function exportAdminDataSyncCsv(): Promise<void> {
  const blob = await exportAdminDataSyncCsvFromApi()
  triggerBlobDownload(blob, 'sync-requests.csv')
}
