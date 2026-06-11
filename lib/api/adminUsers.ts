import { request } from '@/lib/api/api'
import {
  getMockAdminUsersList,
  updateMockAdminUser,
  USE_MOCK_ADMIN_USERS,
} from '@/lib/mocks/adminUsersMockData'
import type {
  AdminBackendUserDto,
  AdminUserDto,
  AdminUserRole,
  AdminUserStatus,
  AdminUsersListResponse,
  AdminUsersStatsDto,
} from '@/schemas/adminUser'

const V1_ROOT =
  process.env.NEXT_PUBLIC_API_V1_ROOT?.replace(/\/$/, '') ?? '/v1'

type ApiEnvelope<T> = {
  data?: T
  message?: unknown
  meta?: unknown
}

type BackendUsersPayload = {
  data?: AdminBackendUserDto[]
  meta?: {
    totalItems?: number
    itemCount?: number
    itemsPerPage?: number
    totalPages?: number
    currentPage?: number
    syncTimestamp?: string
  }
}

type BackendStatsPayload = {
  totalUsers?: number
  activeUsers?: number
  verifiedUsers?: number
  roleBreakdown?: Partial<Record<AdminUserRole, number>>
  genderBreakdown?: Record<string, number>
  healthStatusBreakdown?: Record<string, number>
  regionBreakdown?: Record<string, number>
}

export type UpdateAdminUserBody = Partial<{
  name: string
  fullName: string
  email: string
  role: AdminUserRole
  region: string
  status: AdminUserStatus
  enabled: boolean
  isActive: boolean
  isVerified: boolean
  phoneNumber: string
}>

export type CreateAdminVolunteerBody = {
  email: string
  password: string
  fullName: string
  phoneNumber?: string
  gender?: AdminBackendUserDto['gender']
  ageGroup?: '18-40' | 'above 40'
  healthStatus?: AdminBackendUserDto['healthStatus']
  nationalId?: string
  housingStatus?: string
  region?: string
}

function getEnvelopeData<T>(raw: unknown): T | undefined {
  if (!raw || typeof raw !== 'object') return undefined
  return (raw as ApiEnvelope<T>).data
}

function deriveUserStatus(user: Pick<AdminBackendUserDto, 'isActive' | 'isVerified'>): AdminUserStatus {
  if (!user.isActive) return 'disabled'
  if (!user.isVerified) return 'pending_review'
  return 'active'
}

function formatRelativeActivity(value?: string): string {
  if (!value) return 'غير متوفر'

  const timestamp = new Date(value).getTime()
  if (Number.isNaN(timestamp)) return 'غير متوفر'

  const diffMinutes = Math.max(0, Math.floor((Date.now() - timestamp) / 60000))
  if (diffMinutes < 5) return 'نشط الآن'
  if (diffMinutes < 60) return `منذ ${diffMinutes} دقيقة`

  const diffHours = Math.floor(diffMinutes / 60)
  if (diffHours < 24) return `منذ ${diffHours} ساعة`

  const diffDays = Math.floor(diffHours / 24)
  if (diffDays < 7) return `منذ ${diffDays} يوم`

  return new Intl.DateTimeFormat('ar', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(new Date(timestamp))
}

export function mapBackendAdminUser(user: AdminBackendUserDto): AdminUserDto {
  const fullName = user.fullName || user.email
  return {
    id: user.id,
    name: fullName,
    fullName,
    email: user.email,
    role: user.role,
    region: user.region?.trim() || 'غير محدد',
    status: deriveUserStatus(user),
    lastActivity: formatRelativeActivity(user.updatedAt ?? user.createdAt),
    enabled: user.isActive,
    isActive: user.isActive,
    isVerified: user.isVerified,
    phoneNumber: user.phoneNumber,
    gender: user.gender,
    ageGroup: user.ageGroup,
    maritalStatus: user.maritalStatus,
    healthStatus: user.healthStatus,
    nationalId: user.nationalId,
    housingStatus: user.housingStatus,
    familyMembersCount: user.familyMembersCount,
    femalesCount: user.femalesCount,
    malesCount: user.malesCount,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  }
}

function normalizeStats(rawStats?: BackendStatsPayload): AdminUsersStatsDto {
  const totalUsers = rawStats?.totalUsers ?? 0
  const verifiedUsers = rawStats?.verifiedUsers ?? 0
  return {
    totalUsers,
    admins: rawStats?.roleBreakdown?.admin ?? 0,
    pendingApproval: Math.max(0, totalUsers - verifiedUsers),
    activeUsers: rawStats?.activeUsers ?? 0,
    verifiedUsers,
    roleBreakdown: rawStats?.roleBreakdown ?? {},
    genderBreakdown: rawStats?.genderBreakdown ?? {},
    healthStatusBreakdown: rawStats?.healthStatusBreakdown ?? {},
    regionBreakdown: rawStats?.regionBreakdown ?? {},
  }
}

function normalizeUsersResponse(
  rawList: unknown,
  rawStats?: unknown,
  fallbackPage = 1,
  fallbackPageSize = 10,
): AdminUsersListResponse {
  const payload = getEnvelopeData<BackendUsersPayload>(rawList)
  const users = Array.isArray(payload?.data)
    ? payload.data.map(mapBackendAdminUser)
    : []

  const meta = payload?.meta
  const stats = normalizeStats(getEnvelopeData<BackendStatsPayload>(rawStats))

  return {
    users,
    stats,
    total: meta?.totalItems ?? users.length,
    page: meta?.currentPage ?? fallbackPage,
    pageSize: meta?.itemsPerPage ?? fallbackPageSize,
  }
}

function buildBackendUpdateBody(body: UpdateAdminUserBody): Record<string, unknown> {
  const next: Record<string, unknown> = {}

  if (body.fullName !== undefined || body.name !== undefined) {
    next.fullName = body.fullName ?? body.name
  }
  if (body.email !== undefined) next.email = body.email
  if (body.role !== undefined) next.role = body.role
  if (body.region !== undefined) next.region = body.region
  if (body.phoneNumber !== undefined) next.phoneNumber = body.phoneNumber
  if (body.isActive !== undefined) next.isActive = body.isActive
  if (body.isVerified !== undefined) next.isVerified = body.isVerified

  if (body.enabled !== undefined) {
    next.isActive = body.enabled
  }

  if (body.status !== undefined) {
    next.isActive = body.status !== 'disabled'
    if (body.status === 'active') next.isVerified = true
    if (body.status === 'pending_review') next.isVerified = false
  }

  return next
}

async function fetchAdminUserByIdFromApi(id: string): Promise<AdminUserDto> {
  const response = await request(`${V1_ROOT}/admin/users/${encodeURIComponent(id)}`, {
    method: 'GET',
  })
  const user = getEnvelopeData<AdminBackendUserDto>(response)
  if (!user) throw { status: 500, message: 'تعذّر قراءة بيانات المستخدم' }
  return mapBackendAdminUser(user)
}

export async function fetchAdminUsersStatsFromApi(): Promise<AdminUsersStatsDto> {
  const response = await request(`${V1_ROOT}/admin/users/stats`, { method: 'GET' })
  return normalizeStats(getEnvelopeData<BackendStatsPayload>(response))
}

export async function fetchAdminUsersFromApi(
  params: Record<string, string | number | boolean | undefined> = {},
): Promise<AdminUsersListResponse> {
  const page = typeof params.page === 'number' ? params.page : 1
  const pageSize = typeof params.pageSize === 'number' ? params.pageSize : 10
  const searchParams = new URLSearchParams()

  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === '' || value === 'all') return
    if (key === 'pageSize') {
      searchParams.set('limit', String(value))
      return
    }
    if (key === 'region') return
    searchParams.set(key, String(value))
  })

  const query = searchParams.toString()
  const path = query ? `${V1_ROOT}/admin/users?${query}` : `${V1_ROOT}/admin/users`
  const [listResponse, statsResponse] = await Promise.all([
    request(path, { method: 'GET' }),
    request(`${V1_ROOT}/admin/users/stats`, { method: 'GET' }),
  ])

  return normalizeUsersResponse(listResponse, statsResponse, page, pageSize)
}

export async function updateAdminUser(
  id: string,
  body: UpdateAdminUserBody,
): Promise<AdminUserDto> {
  if (USE_MOCK_ADMIN_USERS) {
    const updated = updateMockAdminUser(id, body)
    if (!updated) throw { status: 404, message: 'المستخدم غير موجود' }
    return updated
  }

  const response = await request(`${V1_ROOT}/admin/users/${encodeURIComponent(id)}`, {
    method: 'PUT',
    body: JSON.stringify(buildBackendUpdateBody(body)),
  })
  const updated = getEnvelopeData<AdminBackendUserDto>(response)
  return updated ? mapBackendAdminUser(updated) : fetchAdminUserByIdFromApi(id)
}

export async function setAdminUserActive(
  id: string,
  isActive: boolean,
): Promise<AdminUserDto | null> {
  if (USE_MOCK_ADMIN_USERS) {
    const updated = updateMockAdminUser(id, {
      enabled: isActive,
      isActive,
      status: isActive ? 'active' : 'disabled',
    })
    if (!updated) throw { status: 404, message: 'المستخدم غير موجود' }
    return updated
  }

  const response = await request(
    `${V1_ROOT}/admin/users/${encodeURIComponent(id)}/status`,
    {
      method: 'PATCH',
      body: JSON.stringify({ isActive }),
    },
  )
  const updated = getEnvelopeData<AdminBackendUserDto>(response)
  return updated ? mapBackendAdminUser(updated) : fetchAdminUserByIdFromApi(id)
}

export async function setAdminUserVerified(
  id: string,
  isVerified: boolean,
): Promise<AdminUserDto | null> {
  const response = await request(
    `${V1_ROOT}/admin/users/${encodeURIComponent(id)}/verify`,
    {
      method: 'PATCH',
      body: JSON.stringify({ isVerified }),
    },
  )
  const updated = getEnvelopeData<AdminBackendUserDto>(response)
  return updated ? mapBackendAdminUser(updated) : fetchAdminUserByIdFromApi(id)
}

export async function deleteAdminUser(id: string): Promise<void> {
  await request(`${V1_ROOT}/admin/users/${encodeURIComponent(id)}`, {
    method: 'DELETE',
  })
}

export async function createAdminVolunteer(
  body: CreateAdminVolunteerBody,
): Promise<AdminUserDto | null> {
  const response = await request(`${V1_ROOT}/users/volunteers`, {
    method: 'POST',
    body: JSON.stringify(body),
  })
  const created = getEnvelopeData<AdminBackendUserDto>(response)
  return created ? mapBackendAdminUser(created) : null
}

export { getMockAdminUsersList }
