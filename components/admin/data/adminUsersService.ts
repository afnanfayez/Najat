import { fetchAdminUsersFromApi } from '@/lib/api/adminUsers'
import {
  ADMIN_USER_ROLE_OPTIONS,
  ADMIN_USERS_STATS_MOCK,
  ADMIN_USERS_TOTAL_MOCK,
  getMockAdminUsersList,
  USE_MOCK_ADMIN_USERS,
} from '@/lib/mocks/adminUsersMockData'
import type {
  AdminManagedUser,
  AdminUserDto,
  AdminUserRoleFilter,
  AdminUserRegionFilter,
  AdminUsersListResponse,
  AdminUsersQueryParams,
  AdminUsersStatsDto,
} from '@/schemas/adminUser'

export type {
  AdminManagedUser,
  AdminUserDto,
  AdminUserRoleFilter,
  AdminUserRegionFilter,
  AdminUsersQueryParams,
  AdminUsersStatsDto,
}

const ADMIN_USER_STATUS_META = {
  active: { label: 'نشط', color: '#22C55E' },
  disabled: { label: 'معطل', color: '#94A3B8' },
  pending_review: { label: 'قيد المراجعة', color: '#F44336' },
} as const

const ROLE_LABELS = Object.fromEntries(
  ADMIN_USER_ROLE_OPTIONS.map((r) => [r.value, r.label]),
) as Record<AdminUserDto['role'], string>

export function mapAdminUserDto(user: AdminUserDto): AdminManagedUser {
  const statusMeta = ADMIN_USER_STATUS_META[user.status]
  return {
    ...user,
    roleLabel: ROLE_LABELS[user.role],
    statusLabel: statusMeta.label,
    statusColor: statusMeta.color,
  }
}

export function mapAdminUsersList(users: AdminUserDto[]): AdminManagedUser[] {
  return users.map(mapAdminUserDto)
}

function normalizeSearch(value?: string) {
  return value?.trim().toLowerCase() ?? ''
}

function filterMockUsers(
  users: AdminUserDto[],
  params: AdminUsersQueryParams,
): AdminUserDto[] {
  const q = normalizeSearch(params.search)

  return users.filter((user) => {
    if (params.role && params.role !== 'all' && user.role !== params.role) {
      return false
    }
    if (params.region && params.region !== 'all' && user.region !== params.region) {
      return false
    }
    if (q) {
      const haystack = `${user.name} ${user.email}`.toLowerCase()
      if (!haystack.includes(q)) return false
    }
    return true
  })
}

function paginateUsers(
  users: AdminUserDto[],
  page: number,
  pageSize: number,
  total: number,
): AdminUserDto[] {
  if (users.length === 0) return []

  const start = (page - 1) * pageSize
  const result: AdminUserDto[] = []

  for (let i = 0; i < pageSize && start + i < total; i += 1) {
    const globalIndex = start + i
    const source = users[globalIndex % users.length]
    result.push({
      ...source,
      id: `${source.id}-${globalIndex}`,
    })
  }

  return result
}

function getMockAdminUsersResult(params: AdminUsersQueryParams): AdminUsersListResponse {
  const page = params.page ?? 1
  const pageSize = params.pageSize ?? 4
  const filtered = filterMockUsers(getMockAdminUsersList(), params)

  return {
    users: paginateUsers(filtered, page, pageSize, ADMIN_USERS_TOTAL_MOCK),
    stats: ADMIN_USERS_STATS_MOCK,
    total: ADMIN_USERS_TOTAL_MOCK,
    page,
    pageSize,
  }
}

export async function fetchAdminUsers(
  params: AdminUsersQueryParams = {},
): Promise<AdminUsersListResponse> {
  if (USE_MOCK_ADMIN_USERS) {
    return getMockAdminUsersResult(params)
  }

  return fetchAdminUsersFromApi({
    search: params.search,
    role: params.role,
    region: params.region,
    page: params.page,
    pageSize: params.pageSize,
  })
}

export function formatAdminUsersRange(
  page: number,
  pageSize: number,
  total: number,
): string {
  if (total === 0) return 'لا يوجد مستخدمون'
  const start = (page - 1) * pageSize + 1
  const end = Math.min(page * pageSize, total)
  return `عرض ${start} - ${end} من إجمالي ${total.toLocaleString('en-US')} مستخدم`
}

export function getAdminUsersTotalPages(total: number, pageSize: number): number {
  return Math.max(1, Math.ceil(total / pageSize))
}

export function formatStatNumber(value: number, pad = false): string {
  if (pad && value < 10) return value.toString().padStart(2, '0')
  return value.toLocaleString('en-US')
}
