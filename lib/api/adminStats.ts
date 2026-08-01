import { request } from '@/lib/api/api'

const V1_ROOT = process.env.NEXT_PUBLIC_API_V1_ROOT?.replace(/\/$/, '') ?? '/v1'

export interface AdminSystemStatsDto {
  responseTime?: string | number
  informationAccuracy?: number
  activeActivitiesCount?: number
  urgentAlertsCount?: number
  userStats?: {
    totalUsers?: number
    activeUsers?: number
    verifiedUsers?: number
    roleBreakdown?: Partial<Record<string, number>>
  }
  hospitalCount?: number
  aidRequestCount?: number
}

export async function fetchAdminSystemStatsFromApi(): Promise<AdminSystemStatsDto> {
  const response = await request(`${V1_ROOT}/admin/stats`, { method: 'GET' })
  if (response && typeof response === 'object' && 'data' in response) {
    return (response as { data: AdminSystemStatsDto }).data ?? response
  }
  return response as AdminSystemStatsDto
}
