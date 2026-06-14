import type {
  AdminAlertDto,
  AdminAlertsListResponse,
  AdminAlertsTab,
  AdminManagedAlert,
} from '@/schemas/adminAlert'

export type { AdminAlertsTab, AdminManagedAlert, AdminAlertDto }

const ALERT_PRIORITY_COLORS: Record<string, string> = {
  very_urgent: '#F44336',
  help_request: '#FF9800',
}

const ALERT_PRIORITY_LABELS: Record<string, string> = {
  very_urgent: 'عاجل جداً',
  help_request: 'طلب مساعدة',
}

const DEFAULT_MAP_CENTER = { lat: 31.5, lng: 34.46 }

export function mapAdminAlertDto(alert: AdminAlertDto): AdminManagedAlert {
  return {
    ...alert,
    time: alert.reportedAt,
    accentColor: ALERT_PRIORITY_COLORS[alert.priority] ?? '#64748B',
    badgeLabel: ALERT_PRIORITY_LABELS[alert.priority] ?? alert.priority,
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
  return alerts.filter((alert) => alert.priority === tab)
}

export async function fetchAdminAlerts(): Promise<AdminAlertsListResponse> {
  return { alerts: [], mapCenter: DEFAULT_MAP_CENTER }
}

export function getAdminAlertsMapCenter(
  response?: AdminAlertsListResponse
): { lat: number; lng: number } {
  return response?.mapCenter ?? DEFAULT_MAP_CENTER
}
