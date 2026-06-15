import type {
  AdminSecurityDashboard,
  AdminSecurityUpdateScheduleBody,
} from '@/schemas/adminSecurity'
import {
  createAdminSecurityBackupFromApi,
  fetchAdminSecurityDashboardFromApi,
  updateAdminSecurityScheduleFromApi,
} from '@/lib/api/adminSecurity'
import { ADMIN_SECURITY_DASHBOARD } from '@/lib/mocks/adminSecurityMockData'

function cronToScheduleId(cron?: string): string {
  if (!cron) return 'daily'
  const parts = cron.split(' ')
  if (parts[4] && parts[4] !== '*') return 'weekly'
  if (parts[2] && parts[2] !== '*') return 'monthly'
  return 'daily'
}

export async function fetchAdminSecurityDashboard(): Promise<AdminSecurityDashboard> {
  try {
    const raw = await fetchAdminSecurityDashboardFromApi()
    const stats = raw.backupStats ?? {}
    const status = raw.securityStatus ?? {}
    const schedule = raw.backupSchedule ?? {}
    const mock = ADMIN_SECURITY_DASHBOARD

    const lastBackupLabel = stats.lastBackupDate
      ? new Date(stats.lastBackupDate).toLocaleDateString('ar-EG')
      : (mock.backup.kpis[1]?.value ?? '—')

    const latestBackupEntry = stats.lastBackupFile
      ? [
          {
            id: 'api-latest',
            version: 'v1.0',
            filename: stats.lastBackupFile.replace('.sql', ''),
            timestamp: lastBackupLabel,
            size: stats.lastBackupSize ?? '—',
            integrityOk: true,
          },
        ]
      : []

    return {
      backup: {
        ...mock.backup,
        kpis: [
          { id: 'k1', label: 'إجمالي النسخ الاحتياطية', value: String(stats.totalBackups ?? mock.backup.kpis[0]?.value ?? '—') },
          { id: 'k2', label: 'آخر نسخة ناجحة', value: lastBackupLabel },
          { id: 'k3', label: 'حجم آخر نسخة', value: stats.lastBackupSize ?? (mock.backup.kpis[2]?.value ?? '—') },
        ],
        backups: [...latestBackupEntry, ...mock.backup.backups],
        selectedScheduleId: cronToScheduleId(schedule.cronExpression),
      },
      security: {
        ...mock.security,
        encryptionProtocols: mock.security.encryptionProtocols.map((p) => ({
          ...p,
          status: status.firewallStatus === 'active' ? ('active' as const) : p.status,
        })),
        activeAlertsCount: mock.security.alerts.length,
      },
    }
  } catch {
    return ADMIN_SECURITY_DASHBOARD
  }
}

/** Maps UI schedule option IDs to standard cron expressions */
const SCHEDULE_ID_TO_CRON: Record<string, string> = {
  daily: '0 2 * * *',
  weekly: '0 2 * * 0',
  monthly: '0 2 1 * *',
}

/**
 * Converts the UI schedule picker selection into the API contract
 * (cronExpression + isEnabled) before forwarding to the API client.
 */
export async function updateAdminSecuritySchedule(
  scheduleId: string,
  storageTargetIds: string[]
): Promise<void> {
  const cronExpression = SCHEDULE_ID_TO_CRON[scheduleId] ?? '0 2 * * *'
  const isEnabled = storageTargetIds.length > 0
  await updateAdminSecurityScheduleFromApi({ cronExpression, isEnabled })
}

export async function publishAdminSecurityBackup(_backupId: string): Promise<void> {
  throw { status: 501, message: 'نشر النسخ الاحتياطية غير متاح حالياً' }
}

export interface BackupResult {
  filename: string
  sizeBytes: number | string
  status: string
}

export async function createAdminSecurityBackup(): Promise<BackupResult | null> {
  return createAdminSecurityBackupFromApi()
}

export async function saveAdminSecurityPermissions(_roleId: string): Promise<void> {
  throw { status: 501, message: 'حفظ الصلاحيات غير متاح حالياً' }
}
