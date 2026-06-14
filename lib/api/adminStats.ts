import { request } from '@/lib/api/api'

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
  const response = await request('/v1/admin/stats', { method: 'GET' })
  if (response && typeof response === 'object' && 'data' in response) {
    return (response as { data: AdminSystemStatsDto }).data ?? response
  }
  return response as AdminSystemStatsDto
}
