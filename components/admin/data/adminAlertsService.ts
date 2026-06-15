import { fetchAdminAlertsFromApi } from '@/lib/api/adminAlerts'
import type {
  AdminAlertDto,
  AdminAlertsListResponse,
  AdminAlertsTab,
  AdminManagedAlert,
} from '@/schemas/adminAlert'

export type { AdminAlertsTab, AdminManagedAlert, AdminAlertDto }

const SEVERITY_COLORS: Record<string, string> = {
  critical: '#F44336',
  warning: '#FF9800',
}

const SEVERITY_LABELS: Record<string, string> = {
  critical: 'عاجل جداً',
  warning: 'تحذير',
}

const SOURCE_LABELS: Record<string, string> = {
  system: 'النظام',
  sync: 'مزامنة البيانات',
  user_report: 'تقرير مستخدم',
}

const DEFAULT_MAP_CENTER = { lat: 31.5, lng: 34.46 }

export function mapAdminAlertDto(alert: AdminAlertDto): AdminManagedAlert {
  const time = alert.createdAt
    ? new Date(alert.createdAt).toLocaleString('ar-EG', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
    : '—'

  return {
    ...alert,
    time,
    accentColor: SEVERITY_COLORS[alert.severity] ?? '#64748B',
    badgeLabel: SEVERITY_LABELS[alert.severity] ?? alert.severity,
    sourceLabel: SOURCE_LABELS[alert.source] ?? alert.source,
  }
}

export function mapAdminAlertsList(alerts: AdminAlertDto[]): AdminManagedAlert[] {
  return alerts.map(mapAdminAlertDto)
}

export function filterAdminAlerts(
  alerts: AdminManagedAlert[],
  tab: AdminAlertsTab
): AdminManagedAlert[] {
  if (tab === 'all') return alerts
  if (tab === 'very_urgent') return alerts.filter((a) => a.severity === 'critical')
  if (tab === 'help_request') return alerts.filter((a) => a.source === 'user_report')
  return alerts
}

export async function fetchAdminAlerts(): Promise<AdminAlertsListResponse> {
  return fetchAdminAlertsFromApi()
}

export function getAdminAlertsMapCenter(
  response?: AdminAlertsListResponse
): { lat: number; lng: number } {
  return response?.mapCenter ?? DEFAULT_MAP_CENTER
}
