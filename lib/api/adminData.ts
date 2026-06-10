import { request } from '@/lib/api/api'
import type {
  AdminDataDashboard,
  AdminDataDashboardQueryParams,
  AdminDataReviewDetail,
  AdminDataSyncDashboard,
  SubmitAdminDataReviewBody,
} from '@/schemas/adminData'

const V1 = '/v1/admin/data'

function buildQuery(params: AdminDataDashboardQueryParams): string {
  if (!params.filter) return ''
  return `?filter=${encodeURIComponent(params.filter)}`
}

function unwrap<T>(raw: unknown, key?: string): T {
  if (!raw || typeof raw !== 'object') return raw as T
  const obj = raw as Record<string, unknown>
  if (key && obj[key] != null) return obj[key] as T
  if (obj.data != null) return unwrap<T>(obj.data, key)
  return raw as T
}

/**
 * جلب لوحة نظرة عامة على البيانات.
 * فعّل عبر NEXT_PUBLIC_ADMIN_DATA_API=1 ثم عدّل المسارات حسب عقد API الفعلي.
 */
export async function fetchAdminDataDashboardFromApi(
  params: AdminDataDashboardQueryParams = {}
): Promise<AdminDataDashboard> {
  const response = await request(`${V1}/dashboard${buildQuery(params)}`, {
    method: 'GET',
  })
  return unwrap<AdminDataDashboard>(response, 'dashboard')
}

export async function fetchAdminDataReviewFromApi(
  id: string
): Promise<AdminDataReviewDetail> {
  const response = await request(`${V1}/requests/${id}/review`, { method: 'GET' })
  return unwrap<AdminDataReviewDetail>(response, 'review')
}

export async function fetchAdminDataSyncDashboardFromApi(): Promise<AdminDataSyncDashboard> {
  const response = await request(`${V1}/sync`, { method: 'GET' })
  return unwrap<AdminDataSyncDashboard>(response, 'sync')
}

export async function deleteAdminDataRequestFromApi(id: string): Promise<void> {
  await request(`${V1}/requests/${id}`, { method: 'DELETE' })
}

export async function approveAdminDataRequestFromApi(id: string): Promise<void> {
  await request(`${V1}/requests/${id}/approve`, { method: 'POST' })
}

export async function submitAdminDataReviewFromApi(
  id: string,
  body: SubmitAdminDataReviewBody,
  mode: 'draft' | 'publish'
): Promise<AdminDataReviewDetail> {
  const response = await request(`${V1}/requests/${id}/review`, {
    method: 'POST',
    body: JSON.stringify({ ...body, mode }),
  })
  return unwrap<AdminDataReviewDetail>(response, 'review')
}

export async function downloadAdminDataReviewReportFromApi(id: string): Promise<Blob> {
  const token =
    typeof window !== 'undefined'
      ? (await import('@/lib/api/auth')).getToken()
      : null

  const base =
    process.env.NEXT_PUBLIC_BASE_URL ||
    process.env.NEXT_PUBLIC_API_BASE_URL ||
    ''
  const res = await fetch(`${base}${V1}/requests/${id}/report`, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  })
  if (!res.ok) throw new Error('Failed to download report')
  return res.blob()
}

export async function publishAdminDataSyncRequestFromApi(id: string): Promise<void> {
  await request(`${V1}/sync/requests/${id}/publish`, { method: 'POST' })
}

export async function publishAllAdminDataSyncFromApi(): Promise<void> {
  await request(`${V1}/sync/publish-all`, { method: 'POST' })
}

export async function exportAdminDataSyncCsvFromApi(): Promise<Blob> {
  const token =
    typeof window !== 'undefined'
      ? (await import('@/lib/api/auth')).getToken()
      : null

  const base =
    process.env.NEXT_PUBLIC_BASE_URL ||
    process.env.NEXT_PUBLIC_API_BASE_URL ||
    ''
  const res = await fetch(`${base}${V1}/sync/export`, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  })
  if (!res.ok) throw new Error('Failed to export CSV')
  return res.blob()
}
