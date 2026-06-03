import { ADMIN_MAPS_DASHBOARD } from '@/lib/mocks/adminMapsMockData'
import { USE_MOCK_ADMIN_MAPS } from '@/lib/mocks/mockConfig'
import type { AdminMapsDashboard } from '@/schemas/adminMaps'

function delay(ms = 280): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export async function fetchAdminMapsDashboard(): Promise<AdminMapsDashboard> {
  await delay()
  if (USE_MOCK_ADMIN_MAPS) {
    return structuredClone(ADMIN_MAPS_DASHBOARD)
  }
  throw new Error('Admin maps API not configured')
}
