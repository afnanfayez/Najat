import { request } from '@/lib/api/api'
import type {
  AdminSecurityDashboard,
  AdminSecurityUpdateScheduleBody,
} from '@/schemas/adminSecurity'

const V1 = '/v1/admin/security'

function unwrap<T>(raw: unknown, key?: string): T {
  if (!raw || typeof raw !== 'object') return raw as T
  const obj = raw as Record<string, unknown>
  if (key && obj[key] != null) return obj[key] as T
  if (obj.data != null) return unwrap<T>(obj.data, key)
  return raw as T
}

export async function fetchAdminSecurityDashboardFromApi(): Promise<AdminSecurityDashboard> {
  const response = await request(`${V1}/dashboard`, { method: 'GET' })
  return unwrap<AdminSecurityDashboard>(response, 'dashboard')
}

export async function updateAdminSecurityScheduleFromApi(
  body: AdminSecurityUpdateScheduleBody
): Promise<void> {
  await request(`${V1}/backup/schedule`, { method: 'PUT', body: JSON.stringify(body) })
}

export async function createAdminSecurityBackupFromApi(): Promise<void> {
  await request(`${V1}/backup`, { method: 'POST' })
}
