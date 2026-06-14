import { request } from '@/lib/api/api'

const V1 = '/v1/admin/reports'

function unwrap<T>(raw: unknown): T {
  if (!raw || typeof raw !== 'object') return raw as T
  const obj = raw as Record<string, unknown>
  if (obj.data != null) return unwrap<T>(obj.data)
  return raw as T
}

export interface AdminReportsApiRaw {
  overview?: {
    totalVolunteers?: number
    totalResidents?: number
    totalHospitals?: number
    totalDangerZones?: number
    totalAidPoints?: number
  }
  safetyStats?: {
    activeEscalations?: number
    resolvedZones?: number
    dangerousRoadsCount?: number
  }
  activitySummary?: {
    weeklySyncVolume?: string
    avgResponseTime?: string
    medicalDispatches?: number
  }
}

export async function fetchAdminReportsDashboardFromApi(): Promise<AdminReportsApiRaw> {
  const response = await request(`${V1}/dashboard`, { method: 'GET' })
  return unwrap<AdminReportsApiRaw>(response)
}

export async function exportAdminReportsPdfFromApi(): Promise<Blob> {
  const response = await request(`${V1}/export/pdf`, { method: 'GET' })
  if (response instanceof Blob) return response
  return new Blob([JSON.stringify(response)], { type: 'application/pdf' })
}
