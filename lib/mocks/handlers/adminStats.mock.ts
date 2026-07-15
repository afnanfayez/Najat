import { nowIso } from '@/lib/mocks/crud/paginationHelpers'
import { usersStore } from '@/lib/mocks/handlers/usersStore'
import type { AdminSystemStatsDto } from '@/lib/api/adminStats'

export function getStats() {
  const users = usersStore.getAll()
  const data: AdminSystemStatsDto = {
    responseTime: '16 دقيقة',
    informationAccuracy: 94,
    activeActivitiesCount: 12,
    urgentAlertsCount: 3,
    userStats: {
      totalUsers: users.length,
      activeUsers: users.filter((u) => u.isActive).length,
      verifiedUsers: users.filter((u) => u.isVerified).length,
      roleBreakdown: {
        admin: users.filter((u) => u.role === 'admin').length,
        volunteer: users.filter((u) => u.role === 'volunteer').length,
        resident: users.filter((u) => u.role === 'resident').length,
      },
    },
    hospitalCount: 10,
    aidRequestCount: 0,
  }
  return { success: true as const, statusCode: 200, data, timestamp: nowIso() }
}
