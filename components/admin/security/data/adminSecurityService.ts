import {
  createAdminSecurityBackupFromApi,
  fetchAdminSecurityDashboardFromApi,
  updateAdminSecurityScheduleFromApi,
} from '@/lib/api/adminSecurity'
import { ADMIN_SECURITY_DASHBOARD } from '@/lib/mocks/adminSecurityMockData'
import { USE_MOCK_ADMIN_SECURITY } from '@/lib/mocks/mockConfig'
import type {
  AdminSecurityDashboard,
  AdminSecurityUpdateScheduleBody,
} from '@/schemas/adminSecurity'

function delay(ms = 280): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

let mockDashboard = structuredClone(ADMIN_SECURITY_DASHBOARD)

export async function fetchAdminSecurityDashboard(): Promise<AdminSecurityDashboard> {
  if (!USE_MOCK_ADMIN_SECURITY) {
    return fetchAdminSecurityDashboardFromApi()
  }
  await delay()
  return structuredClone(mockDashboard)
}

export async function updateAdminSecuritySchedule(
  body: AdminSecurityUpdateScheduleBody
): Promise<void> {
  if (!USE_MOCK_ADMIN_SECURITY) {
    await updateAdminSecurityScheduleFromApi(body)
    return
  }
  await delay(300)
  mockDashboard = {
    ...mockDashboard,
    backup: {
      ...mockDashboard.backup,
      selectedScheduleId: body.scheduleId,
      storageTargets: mockDashboard.backup.storageTargets.map((target) => ({
        ...target,
        active: body.storageTargetIds.includes(target.id),
      })),
    },
  }
}

export async function publishAdminSecurityBackup(backupId: string): Promise<void> {
  if (!USE_MOCK_ADMIN_SECURITY) {
    await delay(300)
    return
  }
  await delay(300)
  void backupId
}

function formatBackupTimestamp(date: Date): string {
  const months = [
    'يناير',
    'فبراير',
    'مارس',
    'أبريل',
    'مايو',
    'يونيو',
    'يوليو',
    'أغسطس',
    'سبتمبر',
    'أكتوبر',
    'نوفمبر',
    'ديسمبر',
  ]
  const day = date.getDate()
  const month = months[date.getMonth()]
  const year = date.getFullYear()
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')
  return `${day} ${month} ${year} • ${hours}:${minutes}`
}

export async function createAdminSecurityBackup(): Promise<void> {
  if (!USE_MOCK_ADMIN_SECURITY) {
    await createAdminSecurityBackupFromApi()
    return
  }
  await delay(400)
  const now = new Date()
  const nextIndex = mockDashboard.backup.backups.length + 1
  const newBackup = {
    id: `b${Date.now()}`,
    version: `v2.4.${14 + nextIndex}`,
    filename: `backup_${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`,
    timestamp: formatBackupTimestamp(now),
    size: '1.2 GB',
    integrityOk: true,
  }
  mockDashboard = {
    ...mockDashboard,
    backup: {
      ...mockDashboard.backup,
      kpis: mockDashboard.backup.kpis.map((kpi) =>
        kpi.id === 'k2' ? { ...kpi, value: 'الآن' } : kpi
      ),
      backups: [newBackup, ...mockDashboard.backup.backups],
    },
  }
}

export async function saveAdminSecurityPermissions(roleId: string): Promise<void> {
  if (!USE_MOCK_ADMIN_SECURITY) {
    await delay(300)
    return
  }
  await delay(300)
  mockDashboard = {
    ...mockDashboard,
    security: {
      ...mockDashboard.security,
      selectedRoleId: roleId,
    },
  }
}
