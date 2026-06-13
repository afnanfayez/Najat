import { aidAPI, type AidStatus } from '@/lib/api/aid'
import type { AidDto, AidRequestDto } from '@/schemas/aidApi'
import type {
  AdminAidDistributionPoint,
  AdminAidDistributionStats,
  DistributionPointStatus,
} from '@/schemas/adminAid'

const AID_STATUS_TO_DISTRIBUTION: Record<string, DistributionPointStatus> = {
  active: 'open',
  suspended: 'closed',
  limited: 'crowded',
}

const DISTRIBUTION_TO_AID_STATUS: Record<string, AidStatus> = {
  open: 'active',
  closed: 'suspended',
  crowded: 'limited',
}

function mapAidDtoToDistributionPoint(dto: AidDto): AdminAidDistributionPoint {
  return {
    id: dto.id,
    name: dto.name,
    region: 'غزة', // TODO: region not in AidDto — add when backend exposes it
    address: dto.label ?? '',
    manager: '',   // TODO: not in AidDto
    phone: '',     // TODO: not in AidDto
    status: AID_STATUS_TO_DISTRIBUTION[dto.status ?? 'active'] ?? 'open',
    category: dto.type ?? '',
    remaining: 0,   // TODO: not in AidDto
    total: 100,     // TODO: not in AidDto
    lastUpdated: dto.updatedAt
      ? new Date(dto.updatedAt).toLocaleDateString('ar-EG', {
          day: 'numeric',
          month: 'long',
          year: 'numeric',
        })
      : 'غير محدد',
    aidTypes: dto.availableSupplies ?? [],
    inventory: [],          // TODO: not in AidDto
    workingDays: [0, 1, 2, 3, 4], // TODO: not in AidDto — default weekdays
    startTime: '08:00',     // TODO: not in AidDto
    endTime: '16:00',       // TODO: not in AidDto
    targetGroups: [],       // TODO: not in AidDto
    latitude: dto.latitude,
    longitude: dto.longitude,
  }
}

export async function fetchAdminAidPointsFromApi(): Promise<AdminAidDistributionPoint[]> {
  const response = await aidAPI.list({ limit: 100 })
  return response.data.map(mapAidDtoToDistributionPoint)
}

export async function fetchAdminAidStatsFromApi(): Promise<AdminAidDistributionStats> {
  // AidDto does not expose beneficiary/quantity stats — return zero defaults.
  // TODO: wire when backend adds a /v1/aid/stats endpoint
  const response = await aidAPI.list({ limit: 100 })
  const points = response.data
  return {
    totalBeneficiaries: points.length, // approximate count
    distributedQuantities: 0,          // TODO: not available in API
    availableInventory: 0,             // TODO: not available in API
    avgDailyDelivery: 0,               // TODO: not available in API
  }
}

export async function updateAdminAidPointStatusFromApi(
  id: string,
  status: DistributionPointStatus,
): Promise<void> {
  await aidAPI.updateStatus(id, {
    status: DISTRIBUTION_TO_AID_STATUS[status] ?? 'active',
  })
}

export async function fetchAdminAidPointByIdFromApi(
  id: string,
): Promise<AdminAidDistributionPoint> {
  const dto = await aidAPI.getById(id)
  return mapAidDtoToDistributionPoint(dto)
}

export async function createAdminAidPointFromApi(
  point: AdminAidDistributionPoint,
): Promise<AdminAidDistributionPoint> {
  const dto = await aidAPI.create({
    name: point.name,
    label: point.address || undefined,
    status: DISTRIBUTION_TO_AID_STATUS[point.status] ?? 'active',
    type: point.category || 'all',
    availableSupplies: point.aidTypes.length > 0 ? point.aidTypes : undefined,
    latitude: point.latitude,
    longitude: point.longitude,
  })
  return mapAidDtoToDistributionPoint(dto)
}

export async function updateAdminAidPointFromApi(
  point: AdminAidDistributionPoint,
): Promise<AdminAidDistributionPoint> {
  const dto = await aidAPI.update(point.id, {
    name: point.name,
    label: point.address || undefined,
    status: DISTRIBUTION_TO_AID_STATUS[point.status] ?? 'active',
    type: point.category || 'all',
    availableSupplies: point.aidTypes.length > 0 ? point.aidTypes : undefined,
    latitude: point.latitude,
    longitude: point.longitude,
  })
  return mapAidDtoToDistributionPoint(dto)
}

export async function deleteAdminAidPointFromApi(id: string): Promise<void> {
  await aidAPI.softDelete(id)
}

export async function fetchAdminAidRequestsFromApi(
  params?: { page?: number; limit?: number },
): Promise<AidRequestDto[]> {
  const response = await aidAPI.listRequests(params)
  return response.data
}

export async function createAidRequestFromAdminApi(
  aidPointId: string,
  body: { notes?: string; requestedSupplies?: string[] },
): Promise<AidRequestDto> {
  return aidAPI.createRequest(aidPointId, body)
}
