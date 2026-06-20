import { USE_MOCK_ADMIN_AID } from '@/lib/mocks/mockConfig'
import {
  getAdminAidPoints,
  getAdminAidPointById,
  putAdminAidPoints,
  enqueueOfflineOp,
  getOfflineDB,
  getAidRequests,
  putAidRequests,
  updateCachedAidRequestStatus,
} from '@/lib/offline/db'
import {
  createAdminAidPointFromApi,
  deleteAdminAidPointFromApi,
  fetchAdminAidPointByIdFromApi,
  fetchAdminAidPointsFromApi,
  fetchAdminAidRequestsFromApi,
  fetchAdminAidStatsFromApi,
  updateAdminAidPointFromApi,
  updateAdminAidRequestStatusFromApi,
} from '@/lib/api/adminAid'
import type { AidRequestDto } from '@/schemas/aidApi'
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

export async function fetchAdminAidDistributionStats(): Promise<AdminAidDistributionStats> {
  if (USE_MOCK_ADMIN_AID) {
    return { ...ADMIN_AID_DISTRIBUTION_STATS }
  }
  try {
    return await fetchAdminAidStatsFromApi()
  } catch {
    return { ...ADMIN_AID_DISTRIBUTION_STATS }
  }
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
    try {
      const res = await fetch('/api/mock/aid-points')
      const points: AdminAidDistributionPoint[] = await res.json()
      await putAdminAidPoints(points).catch(() => {})
      return points
    } catch {
      const cached = await getAdminAidPoints().catch(() => [])
      return cached.length > 0 ? cached : [...ADMIN_AID_DISTRIBUTION_POINTS]
    }
  }

  try {
    const result = await fetchAdminAidPointsFromApi()
    putAdminAidPoints(result).catch(() => {})
    return result
  } catch {
    const cached = await getAdminAidPoints().catch(() => [])
    return cached.length > 0 ? cached : [...ADMIN_AID_DISTRIBUTION_POINTS]
  }
}

export async function fetchAdminAidDistributionPointById(
  id: string,
): Promise<AdminAidDistributionPoint | null> {
  if (USE_MOCK_ADMIN_AID) {
    try {
      const res = await fetch(`/api/mock/aid-points?id=${encodeURIComponent(id)}`)
      if (!res.ok) return null
      return res.json()
    } catch {
      return (
        (await getAdminAidPointById(id).catch(() => null)) ??
        ADMIN_AID_DISTRIBUTION_POINTS.find((point) => point.id === id) ??
        null
      )
    }
  }

  try {
    return await fetchAdminAidPointByIdFromApi(id)
  } catch {
    return (
      (await getAdminAidPointById(id).catch(() => null)) ??
      ADMIN_AID_DISTRIBUTION_POINTS.find((point) => point.id === id) ??
      null
    )
  }
}

export async function saveAdminAidDistributionPoint(
  point: AdminAidDistributionPoint,
): Promise<AdminAidDistributionPoint> {
  if (USE_MOCK_ADMIN_AID) {
    const isNew = point.id.startsWith('new-')
    const res = await fetch('/api/mock/aid-points', {
      method: isNew ? 'POST' : 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(point)
    })
    return res.json()
  }

  const isNew = point.id.startsWith('new-')

  // Offline: cache optimistically and queue for sync
  if (typeof window !== 'undefined' && !navigator.onLine) {
    const tempId = isNew ? `offline-aid-${Date.now()}` : point.id
    const optimistic = { ...point, id: tempId }
    await putAdminAidPoints([optimistic]).catch(() => {})
    await enqueueOfflineOp({
      type: isNew ? 'CREATE_AID_POINT' : 'UPDATE_AID_POINT',
      payload: isNew ? { body: point } : { id: point.id, body: point },
    })
    return optimistic
  }

  const result = isNew
    ? await createAdminAidPointFromApi(point)
    : await updateAdminAidPointFromApi(point)
  await putAdminAidPoints([result]).catch(() => {})
  return result
}

export async function deleteAdminAidDistributionPoint(id: string): Promise<void> {
  if (USE_MOCK_ADMIN_AID) {
    const res = await fetch(`/api/mock/aid-points?id=${encodeURIComponent(id)}`, {
      method: 'DELETE'
    })
    if (!res.ok) throw new Error('Failed to delete point')
    return
  }

  // Offline: remove from local cache and queue for sync
  if (typeof window !== 'undefined' && !navigator.onLine) {
    const db = getOfflineDB()
    await db.adminAidPoints.delete(id).catch(() => {})
    await enqueueOfflineOp({ type: 'DELETE_AID_POINT', payload: { id } })
    return
  }
  await deleteAdminAidPointFromApi(id)
  const db = getOfflineDB()
  await db.adminAidPoints.delete(id).catch(() => {})
}

export async function fetchAdminAidDonorStats(): Promise<AdminAidDonorStats> {
  if (USE_MOCK_ADMIN_AID) {
    return { ...ADMIN_AID_DONOR_STATS, distribution: [...ADMIN_AID_DONOR_STATS.distribution] }
  }
  return { ...ADMIN_AID_DONOR_STATS, distribution: [...ADMIN_AID_DONOR_STATS.distribution] }
}

export async function fetchAdminAidDonors(): Promise<AdminAidDonor[]> {
  try {
    const res = await fetch('/api/mock/aid-donors')
    const donors: AdminAidDonorDetail[] = await res.json()
    return donors.map(donorToListItem)
  } catch {
    return [...ADMIN_AID_DONORS]
  }
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
  try {
    const res = await fetch(`/api/mock/aid-donors?id=${encodeURIComponent(id)}`)
    if (!res.ok) return null
    return res.json()
  } catch {
    return ADMIN_AID_DONOR_DETAILS.find((donor) => donor.id === id) ?? null
  }
}

export async function saveAdminAidDonor(
  donor: AdminAidDonorDetail,
): Promise<AdminAidDonorDetail> {
  const checkRes = await fetch(`/api/mock/aid-donors?id=${encodeURIComponent(donor.id)}`)
  const method = checkRes.ok ? 'PUT' : 'POST'
  const payload = {
    ...donor,
    subtitle: buildDonorSubtitle(donor),
  }
  const res = await fetch('/api/mock/aid-donors', {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  })
  return res.json()
}

export async function deleteAdminAidDonor(id: string): Promise<void> {
  const res = await fetch(`/api/mock/aid-donors?id=${encodeURIComponent(id)}`, {
    method: 'DELETE'
  })
  if (!res.ok) throw new Error('Failed to delete donor')
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

export async function fetchAdminAidRequests(): Promise<AidRequestDto[]> {
  if (USE_MOCK_ADMIN_AID) {
    try {
      const res = await fetch('/api/mock/aid-requests')
      const requests: AidRequestDto[] = await res.json()
      await putAidRequests(requests).catch(() => {})
      return requests
    } catch {
      return getAidRequests()
    }
  }
  try {
    const requests = await fetchAdminAidRequestsFromApi()
    await putAidRequests(requests).catch(() => {})
    return requests
  } catch {
    return getAidRequests()
  }
}

export async function updateAdminAidRequestStatus(
  requestId: string,
  status: AidRequestDto['status'],
): Promise<AidRequestDto> {
  const queueOfflineStatusUpdate = async () => {
    const cached =
      (await updateCachedAidRequestStatus(requestId, status)) ??
      ({ id: requestId, status, updatedAt: new Date().toISOString() } as AidRequestDto)
    await enqueueOfflineOp({
      type: 'UPDATE_AID_REQUEST_STATUS',
      payload: { requestId, status },
    })
    return cached
  }

  if (typeof window !== 'undefined' && !navigator.onLine) {
    return queueOfflineStatusUpdate()
  }

  if (USE_MOCK_ADMIN_AID) {
    try {
      const res = await fetch('/api/mock/aid-requests', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: requestId, status })
      })
      if (!res.ok) throw new Error('Failed to update status')
      const updated: AidRequestDto = await res.json()
      await putAidRequests([updated]).catch(() => {})
      return updated
    } catch {
      return queueOfflineStatusUpdate()
    }
  }

  try {
    const updated = await updateAdminAidRequestStatusFromApi(requestId, status)
    await putAidRequests([updated]).catch(() => {})
    return updated
  } catch (err) {
    const statusCode = (err as { status?: number })?.status
    const isConnectivity =
      statusCode === 0 || statusCode === 502 || statusCode === 504 || statusCode === undefined
    if (isConnectivity) return queueOfflineStatusUpdate()
    throw err
  }
}

export { type AidRequestDto }

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
