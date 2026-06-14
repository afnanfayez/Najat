import { request } from '@/lib/api/api'
import type { AdminSecurityUpdateScheduleBody } from '@/schemas/adminSecurity'

const V1 = '/v1/admin/security'

function unwrap<T>(raw: unknown): T {
  if (!raw || typeof raw !== 'object') return raw as T
  const obj = raw as Record<string, unknown>
  if (obj.data != null) return unwrap<T>(obj.data)
  return raw as T
}

export interface AdminSecurityApiRaw {
  backupSchedule?: { cronExpression?: string; isEnabled?: boolean }
  backupStats?: {
    totalBackups?: number
    lastBackupFile?: string
    lastBackupSize?: string
    lastBackupDate?: string
  }
  securityStatus?: {
    firewallStatus?: string
    ddosProtection?: string
    sslStatus?: string
    activeSessions?: number
  }
}

export async function fetchAdminSecurityDashboardFromApi(): Promise<AdminSecurityApiRaw> {
  const response = await request(`${V1}/dashboard`, { method: 'GET' })
  return unwrap<AdminSecurityApiRaw>(response)
}

export async function updateAdminSecurityScheduleFromApi(
  body: AdminSecurityUpdateScheduleBody
): Promise<void> {
  await request(`${V1}/backup/schedule`, { method: 'PUT', body: JSON.stringify(body) })
}

export async function createAdminSecurityBackupFromApi(): Promise<void> {
  await request(`${V1}/backup`, { method: 'POST' })
}
