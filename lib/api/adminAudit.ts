import { request } from '@/lib/api/api'
import type { AdminAuditCompareDetail, AdminAuditDashboard, UpdateAdminAuditReportBody } from '@/schemas/adminAudit'

const V1 = '/v1/admin/audit'

function unwrap<T>(raw: unknown, key?: string): T {
  if (!raw || typeof raw !== 'object') return raw as T
  const obj = raw as Record<string, unknown>
  if (key && obj[key] != null) return obj[key] as T
  if (obj.data != null) return unwrap<T>(obj.data, key)
  return raw as T
}

export async function fetchAdminAuditDashboardFromApi(): Promise<AdminAuditDashboard> {
  const response = await request(`${V1}/dashboard`, { method: 'GET' })
  return unwrap<AdminAuditDashboard>(response, 'dashboard')
}

export async function fetchAdminAuditCompareFromApi(
  reportId: string
): Promise<AdminAuditCompareDetail> {
  const response = await request(`${V1}/reports/${reportId}/compare`, { method: 'GET' })
  return unwrap<AdminAuditCompareDetail>(response, 'compare')
}

export async function exportAdminAuditReportFromApi(reportId?: string): Promise<Blob> {
  const path = reportId ? `${V1}/reports/${reportId}/export` : `${V1}/export`
  const response = await request(path, { method: 'GET' })
  if (response instanceof Blob) return response
  return new Blob([JSON.stringify(response)], { type: 'application/pdf' })
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
  const response = await request(`${V1}/reports/${reportId}/reject`, {
    method: 'POST',
  })
  return unwrap<AdminAuditDashboard>(response, 'dashboard')
}

export async function updateAdminAuditReportFromApi(
  reportId: string,
  body: UpdateAdminAuditReportBody
): Promise<AdminAuditDashboard> {
  const response = await request(`${V1}/reports/${reportId}`, {
    method: 'PATCH',
    body: JSON.stringify(body),
  })
  return unwrap<AdminAuditDashboard>(response, 'dashboard')
}
