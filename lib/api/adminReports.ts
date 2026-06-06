import { request } from '@/lib/api/api'
import type { AdminReportsDashboard } from '@/schemas/adminReports'

const V1 = '/v1/admin/reports'

function unwrap<T>(raw: unknown, key?: string): T {
  if (!raw || typeof raw !== 'object') return raw as T
  const obj = raw as Record<string, unknown>
  if (key && obj[key] != null) return obj[key] as T
  if (obj.data != null) return unwrap<T>(obj.data, key)
  return raw as T
}

export async function fetchAdminReportsDashboardFromApi(): Promise<AdminReportsDashboard> {
  const response = await request(`${V1}/dashboard`, { method: 'GET' })
  return unwrap<AdminReportsDashboard>(response, 'dashboard')
}

export async function exportAdminReportsPdfFromApi(): Promise<Blob> {
  const response = await request(`${V1}/export/pdf`, { method: 'GET' })
  if (response instanceof Blob) return response
  return new Blob([JSON.stringify(response)], { type: 'application/pdf' })
}
