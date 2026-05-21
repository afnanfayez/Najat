import { request } from '@/lib/api/api'
import type { AdminAlertDto, AdminAlertsListResponse } from '@/schemas/adminAlert'

function normalizeAlertsResponse(raw: unknown): AdminAlertsListResponse {
  if (Array.isArray(raw)) {
    return { alerts: raw as AdminAlertDto[] }
  }

  if (raw && typeof raw === 'object') {
    const obj = raw as Record<string, unknown>

    if (Array.isArray(obj.alerts)) {
      return {
        alerts: obj.alerts as AdminAlertDto[],
        mapCenter: obj.mapCenter as AdminAlertsListResponse['mapCenter'],
      }
    }

    if (obj.data && typeof obj.data === 'object') {
      return normalizeAlertsResponse(obj.data)
    }
  }

  return { alerts: [] }
}

/**
 * جلب تنبيهات المدير من الباك اند.
 * فعّل عبر NEXT_PUBLIC_ADMIN_ALERTS_API=1 ثم عدّل المسار حسب عقد API الفعلي.
 */
export async function fetchAdminAlertsFromApi(): Promise<AdminAlertsListResponse> {
  const response = await request('/v1/admin/alerts', { method: 'GET' })
  return normalizeAlertsResponse(response)
}
