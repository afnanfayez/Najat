import { request } from '@/lib/api/api'
import { getToken } from '@/lib/api/auth'

const V1 = '/v1/admin/reports'
const BASE_URL =
  process.env.NEXT_PUBLIC_BASE_URL ||
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  ''

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

/**
 * Exports the system report as a PDF.
 * Uses a raw fetch (bypassing request()) because the endpoint streams a binary
 * application/pdf response — the request() wrapper would read it as text and
 * lose the binary content.
 */
export async function exportAdminReportsPdfFromApi(): Promise<Blob> {
  const token = typeof window !== 'undefined' ? getToken() : null
  const res = await fetch(`${BASE_URL}${V1}/export/pdf`, {
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      Accept: 'application/pdf',
      'Cache-Control': 'no-cache',
    },
  })
  if (!res.ok) {
    const errText = await res.text().catch(() => res.statusText)
    throw { status: res.status, message: errText || 'تعذّر تصدير التقرير' }
  }
  return res.blob()
}
