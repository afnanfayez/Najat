import { createSingletonStore } from '@/lib/mocks/store/localStore'
import { bodyToRecord, type MockRequestBody } from '@/lib/mocks/formDataUtils'
import { nowIso } from '@/lib/mocks/crud/paginationHelpers'
import type { AdminSecurityApiRaw } from '@/lib/api/adminSecurity'

const store = createSingletonStore<AdminSecurityApiRaw>('adminSecurityDashboard', 1, () => ({
  backupSchedule: { cronExpression: '0 3 * * *', isEnabled: true },
  backupStats: {
    totalBackups: 12,
    lastBackupFile: 'najat-backup-2026-07-14.tar.gz',
    lastBackupSize: '48 MB',
    lastBackupDate: nowIso(),
  },
  securityStatus: {
    firewallStatus: 'active',
    ddosProtection: 'active',
    sslStatus: 'valid',
    activeSessions: 7,
  },
}))

export function getDashboard() {
  return { success: true as const, statusCode: 200, data: store.get(), timestamp: nowIso() }
}

export async function updateBackupSchedule(body: MockRequestBody) {
  const record = await bodyToRecord(body)
  const current = store.get()
  store.set({
    ...current,
    backupSchedule: {
      cronExpression: String(record.cronExpression ?? current.backupSchedule?.cronExpression ?? ''),
      isEnabled: Boolean(record.isEnabled ?? current.backupSchedule?.isEnabled ?? true),
    },
  })
  return { success: true as const, statusCode: 200, timestamp: nowIso() }
}

export function runBackup() {
  const current = store.get()
  const result = {
    id: `backup-${Date.now()}`,
    filename: `najat-backup-${new Date().toISOString().slice(0, 10)}.tar.gz`,
    sizeBytes: 52428800,
    status: 'completed',
    scheduledCron: current.backupSchedule?.cronExpression ?? null,
    createdAt: nowIso(),
  }
  store.set({
    ...current,
    backupStats: {
      totalBackups: (current.backupStats?.totalBackups ?? 0) + 1,
      lastBackupFile: result.filename,
      lastBackupSize: '50 MB',
      lastBackupDate: result.createdAt,
    },
  })
  return { success: true as const, statusCode: 201, data: result, timestamp: nowIso() }
}
