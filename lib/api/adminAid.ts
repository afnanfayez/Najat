import { aidAPI, type AidStatus } from '@/lib/api/aid'
import { aidDonorsAPI } from '@/lib/api/aidDonors'
import type { AidDto, AidRequestDto } from '@/schemas/aidApi'
import type { AidDonorDto } from '@/schemas/aidDonorsApi'
import type {
  AdminAidDistributionPoint,
  AdminAidDistributionStats,
  AdminAidDonorDetail,
  AdminAidInventoryItem,
  DistributionPointStatus,
} from '@/schemas/adminAid'

/** `aid_points`' extended admin columns, only present via aidDtoSchema's `.passthrough()`. */
type AidDtoWithAdminFields = AidDto & {
  region?: string | null
  manager?: string | null
  phone?: string | null
  remaining?: number | null
  total?: number | null
  inventory?: AdminAidInventoryItem[] | null
  workingDays?: number[] | null
  startTime?: string | null
  endTime?: string | null
  targetGroups?: string[] | null
}

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

function mapAidDtoToDistributionPoint(dto: AidDtoWithAdminFields): AdminAidDistributionPoint {
  return {
    id: dto.id,
    name: dto.name,
    region: dto.region ?? 'غزة',
    address: dto.label ?? '',
    manager: dto.manager ?? '',
    phone: dto.phone ?? '',
    status: AID_STATUS_TO_DISTRIBUTION[dto.status ?? 'active'] ?? 'open',
    category: dto.type ?? '',
    remaining: dto.remaining ?? 0,
    total: dto.total ?? 100,
    lastUpdated: dto.updatedAt
      ? new Date(dto.updatedAt).toLocaleDateString('ar-EG', {
          day: 'numeric',
          month: 'long',
          year: 'numeric',
        })
      : 'غير محدد',
    aidTypes: dto.availableSupplies ?? [],
    inventory: dto.inventory ?? [],
    workingDays: dto.workingDays ?? [0, 1, 2, 3, 4],
    startTime: dto.startTime ?? '08:00',
    endTime: dto.endTime ?? '16:00',
    targetGroups: dto.targetGroups ?? [],
    latitude: dto.latitude,
    longitude: dto.longitude,
  }
}

export async function fetchAdminAidPointsFromApi(): Promise<AdminAidDistributionPoint[]> {
  const response = await aidAPI.list({ limit: 100 })
  return response.data.map(mapAidDtoToDistributionPoint)
}

export async function fetchAdminAidStatsFromApi(): Promise<AdminAidDistributionStats> {
  const response = await aidAPI.list({ limit: 100 })
  const points = response.data.map(mapAidDtoToDistributionPoint)
  return {
    totalBeneficiaries: points.reduce((sum, p) => sum + p.total, 0),
    distributedQuantities: points.reduce((sum, p) => sum + (p.total - p.remaining), 0),
    availableInventory: points.reduce((sum, p) => sum + p.remaining, 0),
    avgDailyDelivery: 0, // no time-series source in the API to derive this from
  }
}

function buildAidPointBody(point: AdminAidDistributionPoint): Record<string, unknown> {
  return {
    name: point.name,
    label: point.address || undefined,
    status: DISTRIBUTION_TO_AID_STATUS[point.status] ?? 'active',
    type: point.category || 'all',
    availableSupplies: point.aidTypes.length > 0 ? point.aidTypes : undefined,
    latitude: point.latitude,
    longitude: point.longitude,
    region: point.region || undefined,
    manager: point.manager || undefined,
    phone: point.phone || undefined,
    remaining: point.remaining,
    total: point.total,
    inventory: point.inventory,
    workingDays: point.workingDays,
    startTime: point.startTime || undefined,
    endTime: point.endTime || undefined,
    targetGroups: point.targetGroups,
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
  const dto = await aidAPI.create(buildAidPointBody(point))
  return mapAidDtoToDistributionPoint(dto)
}

export async function updateAdminAidPointFromApi(
  point: AdminAidDistributionPoint,
): Promise<AdminAidDistributionPoint> {
  const dto = await aidAPI.update(point.id, buildAidPointBody(point))
  return mapAidDtoToDistributionPoint(dto)
}

export async function deleteAdminAidPointFromApi(id: string): Promise<void> {
  await aidAPI.softDelete(id)
}

export async function fetchAdminAidRequestsFromApi(
  params?: { aidPointId?: string },
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

export async function updateAdminAidRequestStatusFromApi(
  requestId: string,
  status: AidRequestDto['status'],
): Promise<AidRequestDto> {
  return aidAPI.updateRequestStatus(requestId, status)
}

// `aid_donors` columns map 1:1 onto AdminAidDonorDetail's fields (see
// schemas/aidDonorsApi.ts), so these are thin nullable->required normalizers
// rather than a real shape translation.
function mapDonorDtoToDetail(dto: AidDonorDto): AdminAidDonorDetail {
  return {
    id: dto.id,
    name: dto.name,
    subtitle: dto.subtitle ?? '',
    totalAmount: dto.totalAmount ?? 0,
    lastDonation: dto.lastDonation ?? '',
    donorType: dto.donorType,
    sector: dto.sector ?? '',
    contactPerson: dto.contactPerson ?? '',
    email: dto.email ?? '',
    phone: dto.phone ?? '',
    website: dto.website ?? '',
    country: dto.country ?? '',
    partnershipStatus: dto.partnershipStatus,
    agreementStart: dto.agreementStart ?? '',
    agreementEnd: dto.agreementEnd ?? '',
    focusAreas: dto.focusAreas ?? [],
    notes: dto.notes ?? '',
    active: dto.active,
  }
}

export async function fetchAdminAidDonorsFromApi(): Promise<AdminAidDonorDetail[]> {
  const response = await aidDonorsAPI.list()
  return response.data.map(mapDonorDtoToDetail)
}

export async function fetchAdminAidDonorByIdFromApi(
  id: string,
): Promise<AdminAidDonorDetail> {
  const dto = await aidDonorsAPI.getById(id)
  return mapDonorDtoToDetail(dto)
}

function buildAidDonorBody(donor: AdminAidDonorDetail): Record<string, unknown> {
  return {
    name: donor.name,
    subtitle: donor.subtitle || undefined,
    totalAmount: donor.totalAmount,
    lastDonation: donor.lastDonation || undefined,
    donorType: donor.donorType,
    sector: donor.sector || undefined,
    contactPerson: donor.contactPerson || undefined,
    email: donor.email || undefined,
    phone: donor.phone || undefined,
    website: donor.website || undefined,
    country: donor.country || undefined,
    partnershipStatus: donor.partnershipStatus,
    agreementStart: donor.agreementStart || undefined,
    agreementEnd: donor.agreementEnd || undefined,
    focusAreas: donor.focusAreas,
    notes: donor.notes || undefined,
    active: donor.active,
  }
}

export async function createAdminAidDonorFromApi(
  donor: AdminAidDonorDetail,
): Promise<AdminAidDonorDetail> {
  const dto = await aidDonorsAPI.create(buildAidDonorBody(donor))
  return mapDonorDtoToDetail(dto)
}

export async function updateAdminAidDonorFromApi(
  donor: AdminAidDonorDetail,
): Promise<AdminAidDonorDetail> {
  const dto = await aidDonorsAPI.update(donor.id, buildAidDonorBody(donor))
  return mapDonorDtoToDetail(dto)
}

export async function deleteAdminAidDonorFromApi(id: string): Promise<void> {
  await aidDonorsAPI.remove(id)
}
