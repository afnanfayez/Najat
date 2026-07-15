import { nowIso } from '@/lib/mocks/crud/paginationHelpers'
import type { AdminReportsApiRaw } from '@/lib/api/adminReports'

export function getDashboard() {
  const data: AdminReportsApiRaw = {
    overview: {
      totalVolunteers: 86,
      totalResidents: 4210,
      totalHospitals: 10,
      totalDangerZones: 3,
      totalAidPoints: 8,
    },
    safetyStats: {
      activeEscalations: 2,
      resolvedZones: 5,
      dangerousRoadsCount: 1,
    },
    activitySummary: {
      weeklySyncVolume: '312',
      avgResponseTime: '18 دقيقة',
      medicalDispatches: 47,
    },
  }
  return { success: true as const, statusCode: 200, data, timestamp: nowIso() }
}
