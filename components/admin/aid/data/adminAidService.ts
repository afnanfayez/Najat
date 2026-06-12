import { USE_MOCK_ADMIN_AID } from '@/lib/mocks/mockConfig'
import {
  getAdminAidPoints,
  getAdminAidPointById,
  putAdminAidPoints,
} from '@/lib/offline/db'
import {
  createAdminAidPointFromApi,
  deleteAdminAidPointFromApi,
  fetchAdminAidPointByIdFromApi,
  fetchAdminAidPointsFromApi,
  fetchAdminAidStatsFromApi,
  updateAdminAidPointFromApi,
} from '@/lib/api/adminAid'
import {
  ADMIN_AID_AREA_COVERAGE,
  ADMIN_AID_DISTRIBUTION_POINTS,
  ADMIN_AID_DISTRIBUTION_STATS,
  ADMIN_AID_DONATIONS,
  ADMIN_AID_DONORS,
  ADMIN_AID_DONOR_DETAILS,
  ADMIN_AID_DONOR_STATS,
  ADMIN_AID_RESPONSE_DATA,
  ADMIN_AID_TYPE_OPTIONS,
  ADMIN_AID_TARGET_GROUPS,
  ADMIN_AID_DONOR_FOCUS_AREAS,
} from '@/lib/mocks/adminAidMockData'
import type {
  AdminAidAreaCoverage,
  AdminAidDistributionPoint,
  AdminAidDistributionStats,
  AdminAidDonationRecord,
  AdminAidDonor,
  AdminAidDonorDetail,
  AdminAidDonorStats,
  AdminAidResponsePoint,
} from '@/schemas/adminAid'

let mockPointsStore: AdminAidDistributionPoint[] | null = null
let mockDonorsStore: AdminAidDonorDetail[] | null = null

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
  return fetchAdminAidStatsFromApi()
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

  try {
    const result = await fetchAdminAidPointsFromApi()
    putAdminAidPoints(result).catch(() => {})
    return result
  } catch {
    return getAdminAidPoints()
  }
}

export async function fetchAdminAidDistributionPointById(
  id: string,
): Promise<AdminAidDistributionPoint | null> {
  if (!USE_MOCK_ADMIN_AID) {
    try {
      return await fetchAdminAidPointByIdFromApi(id)
    } catch {
      return getAdminAidPointById(id)
    }
  }
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
  if (!USE_MOCK_ADMIN_AID) {
    const isNew = point.id.startsWith('new-')
    return isNew
      ? createAdminAidPointFromApi(point)
      : updateAdminAidPointFromApi(point)
  }
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
  if (!USE_MOCK_ADMIN_AID) {
    await deleteAdminAidPointFromApi(id)
  }
}

export async function fetchAdminAidDonorStats(): Promise<AdminAidDonorStats> {
  if (USE_MOCK_ADMIN_AID) {
    return { ...ADMIN_AID_DONOR_STATS, distribution: [...ADMIN_AID_DONOR_STATS.distribution] }
  }
  return { ...ADMIN_AID_DONOR_STATS, distribution: [...ADMIN_AID_DONOR_STATS.distribution] }
}

export async function fetchAdminAidDonors(): Promise<AdminAidDonor[]> {
  return getMockDonors().map(donorToListItem)
}

function getMockDonors(): AdminAidDonorDetail[] {
  if (!mockDonorsStore) {
    mockDonorsStore = ADMIN_AID_DONOR_DETAILS.map((d) => ({
      ...d,
      focusAreas: [...d.focusAreas],
    }))
  }
  return mockDonorsStore
}

function donorToListItem(donor: AdminAidDonorDetail): AdminAidDonor {
  return {
    id: donor.id,
    name: donor.name,
    subtitle: donor.subtitle,
    totalAmount: donor.totalAmount,
    lastDonation: donor.lastDonation,
  }
}

export async function fetchAdminAidDonorById(
  id: string,
): Promise<AdminAidDonorDetail | null> {
  const found = getMockDonors().find((d) => d.id === id)
  if (!found) return null
  return { ...found, focusAreas: [...found.focusAreas] }
}

export async function saveAdminAidDonor(
  donor: AdminAidDonorDetail,
): Promise<AdminAidDonorDetail> {
  const donors = getMockDonors()
  const index = donors.findIndex((d) => d.id === donor.id)
  const saved = {
    ...donor,
    focusAreas: [...donor.focusAreas],
    subtitle: buildDonorSubtitle(donor),
  }
  if (index >= 0) {
    donors[index] = saved
  } else {
    donors.push(saved)
  }
  return saved
}

export async function deleteAdminAidDonor(id: string): Promise<void> {
  const donors = getMockDonors()
  const index = donors.findIndex((d) => d.id === id)
  if (index >= 0) donors.splice(index, 1)
}

function buildDonorSubtitle(donor: AdminAidDonorDetail): string {
  const typeLabel =
    donor.donorType === 'strategic'
      ? 'شريك استراتيجي'
      : donor.donorType === 'international'
        ? 'منظمة دولية'
        : donor.donorType === 'local'
          ? 'مانح محلي'
          : 'متبرع فردي'
  return `${typeLabel} - ${donor.sector || 'عام'}`
}

export function createEmptyDonor(): AdminAidDonorDetail {
  return {
    id: `donor-${Date.now()}`,
    name: '',
    subtitle: '',
    totalAmount: 0,
    lastDonation: '',
    donorType: 'local',
    sector: '',
    contactPerson: '',
    email: '',
    phone: '',
    website: '',
    country: 'فلسطين',
    partnershipStatus: 'active',
    agreementStart: '',
    agreementEnd: '',
    focusAreas: [],
    notes: '',
    active: true,
  }
}

export function mapDonorToForm(donor: AdminAidDonorDetail): AdminAidDonorDetail {
  return { ...donor, focusAreas: [...donor.focusAreas] }
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
    category: 'food',
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
