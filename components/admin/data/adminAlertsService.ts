import { fetchAdminAlertsFromApi } from '@/lib/api/adminAlerts'
import {
  ADMIN_ALERT_PRIORITY_COLORS,
  ADMIN_ALERT_PRIORITY_LABELS,
  ADMIN_ALERTS_MAP_CENTER,
  getMockAdminAlertsList,
  USE_MOCK_ADMIN_ALERTS,
} from '@/lib/mocks/adminAlertsMockData'
import type {
  AdminAlertDto,
  AdminAlertsListResponse,
  AdminAlertsTab,
  AdminManagedAlert,
} from '@/schemas/adminAlert'

export type { AdminAlertsTab, AdminManagedAlert, AdminAlertDto }

export function mapAdminAlertDto(alert: AdminAlertDto): AdminManagedAlert {
  return {
    ...alert,
    time: alert.reportedAt,
    accentColor: ADMIN_ALERT_PRIORITY_COLORS[alert.priority],
    badgeLabel: ADMIN_ALERT_PRIORITY_LABELS[alert.priority],
  }
}

export function mapAdminAlertsList(alerts: AdminAlertDto[]): AdminManagedAlert[] {
  return alerts.map(mapAdminAlertDto)
}

export function filterAdminAlerts(
  alerts: AdminManagedAlert[],
  tab: AdminAlertsTab,
): AdminManagedAlert[] {
  if (tab === 'all') return alerts
  return alerts.filter((alert) => alert.priority === tab)
}

export async function fetchAdminAlerts(): Promise<AdminAlertsListResponse> {
  if (USE_MOCK_ADMIN_ALERTS) {
    // TODO: Wire real API when backend adds /v1/admin/alerts endpoint.
    // Real API layer is ready in lib/api/adminAlerts.ts (fetchAdminAlertsFromApi).
    // Remove NEXT_PUBLIC_ADMIN_ALERTS_MOCK=1 from .env when the endpoint is live.
    return {
      alerts: getMockAdminAlertsList(),
      mapCenter: ADMIN_ALERTS_MAP_CENTER,
    }
  }

  return fetchAdminAlertsFromApi()
}

export function getAdminAlertsMapCenter(
  response?: AdminAlertsListResponse,
): { lat: number; lng: number } {
  return response?.mapCenter ?? ADMIN_ALERTS_MAP_CENTER
}
