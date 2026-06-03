import { USE_MOCK_ADMIN_AID } from '@/lib/mocks/mockConfig'
import {
  ADMIN_AID_AREA_COVERAGE,
  ADMIN_AID_DISTRIBUTION_POINTS,
  ADMIN_AID_DISTRIBUTION_STATS,
  ADMIN_AID_DONATIONS,
  ADMIN_AID_DONORS,
  ADMIN_AID_DONOR_STATS,
  ADMIN_AID_RESPONSE_DATA,
  ADMIN_AID_TYPE_OPTIONS,
  ADMIN_AID_TARGET_GROUPS,
} from '@/lib/mocks/adminAidMockData'
import type {
  AdminAidAreaCoverage,
  AdminAidDistributionPoint,
  AdminAidDistributionStats,
  AdminAidDonationRecord,
  AdminAidDonor,
  AdminAidDonorStats,
  AdminAidResponsePoint,
} from '@/schemas/adminAid'

let mockPointsStore: AdminAidDistributionPoint[] | null = null

function getMockPoints(): AdminAidDistributionPoint[] {
  if (!mockPointsStore) {
    mockPointsStore = ADMIN_AID_DISTRIBUTION_POINTS.map((p) => ({
      ...p,
      inventory: p.inventory.map((item) => ({ ...item })),
      aidTypes: [...p.aidTypes],
      workingDays: [...p.workingDays],
      targetGroups: [...p.targetGroups],
    }))
  }
  return mockPointsStore
}

export async function fetchAdminAidDistributionStats(): Promise<AdminAidDistributionStats> {
  if (USE_MOCK_ADMIN_AID) {
    return { ...ADMIN_AID_DISTRIBUTION_STATS }
  }
  return { ...ADMIN_AID_DISTRIBUTION_STATS }
}

export async function fetchAdminAidAreaCoverage(): Promise<AdminAidAreaCoverage[]> {
  if (USE_MOCK_ADMIN_AID) {
    return [...ADMIN_AID_AREA_COVERAGE]
  }
  return [...ADMIN_AID_AREA_COVERAGE]
}

export async function fetchAdminAidResponseData(): Promise<AdminAidResponsePoint[]> {
  if (USE_MOCK_ADMIN_AID) {
    return [...ADMIN_AID_RESPONSE_DATA]
  }
  return [...ADMIN_AID_RESPONSE_DATA]
}

export async function fetchAdminAidDistributionPoints(): Promise<AdminAidDistributionPoint[]> {
  if (USE_MOCK_ADMIN_AID) {
    return getMockPoints().map((p) => ({
      ...p,
      inventory: p.inventory.map((item) => ({ ...item })),
      aidTypes: [...p.aidTypes],
      workingDays: [...p.workingDays],
      targetGroups: [...p.targetGroups],
    }))
  }
  return getMockPoints()
}

export async function fetchAdminAidDistributionPointById(
  id: string,
): Promise<AdminAidDistributionPoint | null> {
  const points = getMockPoints()
  const found = points.find((p) => p.id === id)
  if (!found) return null
  return {
    ...found,
    inventory: found.inventory.map((item) => ({ ...item })),
    aidTypes: [...found.aidTypes],
    workingDays: [...found.workingDays],
    targetGroups: [...found.targetGroups],
  }
}

export async function saveAdminAidDistributionPoint(
  point: AdminAidDistributionPoint,
): Promise<AdminAidDistributionPoint> {
  const points = getMockPoints()
  const index = points.findIndex((p) => p.id === point.id)
  const saved = {
    ...point,
    inventory: point.inventory.map((item) => ({ ...item })),
    aidTypes: [...point.aidTypes],
    workingDays: [...point.workingDays],
    targetGroups: [...point.targetGroups],
  }
  if (index >= 0) {
    points[index] = saved
  } else {
    points.push(saved)
  }
  return saved
}

export async function deleteAdminAidDistributionPoint(id: string): Promise<void> {
  const points = getMockPoints()
  const index = points.findIndex((p) => p.id === id)
  if (index >= 0) points.splice(index, 1)
}

export async function fetchAdminAidDonorStats(): Promise<AdminAidDonorStats> {
  if (USE_MOCK_ADMIN_AID) {
    return { ...ADMIN_AID_DONOR_STATS, distribution: [...ADMIN_AID_DONOR_STATS.distribution] }
  }
  return { ...ADMIN_AID_DONOR_STATS, distribution: [...ADMIN_AID_DONOR_STATS.distribution] }
}

export async function fetchAdminAidDonors(): Promise<AdminAidDonor[]> {
  if (USE_MOCK_ADMIN_AID) {
    return [...ADMIN_AID_DONORS]
  }
  return [...ADMIN_AID_DONORS]
}

export async function fetchAdminAidDonations(): Promise<AdminAidDonationRecord[]> {
  if (USE_MOCK_ADMIN_AID) {
    return [...ADMIN_AID_DONATIONS]
  }
  return [...ADMIN_AID_DONATIONS]
}

export function createEmptyDistributionPoint(): AdminAidDistributionPoint {
  return {
    id: `new-${Date.now()}`,
    name: '',
    region: 'gaza',
    address: '',
    manager: '',
    phone: '',
    status: 'open',
    category: '',
    remaining: 0,
    total: 100,
    lastUpdated: 'الآن',
    aidTypes: [...ADMIN_AID_TYPE_OPTIONS],
    inventory: [
      {
        id: '1',
        name: 'سلة غذائية متكاملة',
        quantity: 1240,
        unit: 'وحدة',
        expiryDate: '2024/12/20',
        status: 'available',
        active: true,
      },
      {
        id: '2',
        name: 'حقن الإنسولين (Lantus)',
        quantity: 45,
        unit: 'عبوة',
        expiryDate: '2024/08/15',
        status: 'limited',
        active: true,
      },
      {
        id: '3',
        name: 'لقاح شلل الأطفال',
        quantity: 0,
        unit: 'جرعة',
        expiryDate: '---',
        status: 'out',
        active: false,
      },
    ],
    workingDays: [0, 1, 2, 3, 4],
    startTime: '08:00',
    endTime: '16:00',
    targetGroups: [...ADMIN_AID_TARGET_GROUPS],
    latitude: 31.5218,
    longitude: 34.4467,
  }
}

export function mapPointToForm(point: AdminAidDistributionPoint): AdminAidDistributionPoint {
  return {
    ...point,
    inventory: point.inventory.map((item) => ({ ...item })),
    aidTypes: [...point.aidTypes],
    workingDays: [...point.workingDays],
    targetGroups: [...point.targetGroups],
  }
}

export type { AdminAidDistributionPoint }
