import { fetchAdminUsersFromApi } from '@/lib/api/adminUsers'
import { putAdminUsers, getAdminUsers } from '@/lib/offline/db'
import { ADMIN_USER_ROLE_OPTIONS } from '@/lib/mocks/adminUsersMockData'
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
    roleLabel: ROLE_LABELS[user.role] ?? user.role,
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

function normalizeRegion(value?: string) {
  return value?.trim().toLowerCase() ?? ''
}

function matchesRegionFilter(user: AdminUserDto, region?: AdminUserRegionFilter): boolean {
  if (!region || region === 'all') return true

  const normalizedUserRegion = normalizeRegion(user.region)
  const normalizedFilter = normalizeRegion(region)
  if (!normalizedUserRegion || !normalizedFilter) return false

  if (normalizedUserRegion.includes(normalizedFilter)) return true

  const broadRegionAliases: Record<string, string[]> = {
    'شمال القطاع': ['شمال', 'north', 'جباليا', 'بيت لاهيا'],
    الوسطى: ['الوسطى', 'دير البلح', 'البريج', 'alburij', 'burij'],
    غزة: ['غزة', 'gaza', 'مدينة غزة'],
    خانيونس: ['خانيونس', 'خان يونس', 'khanyounes', 'khan'],
    رفح: ['رفح', 'rafah'],
  }

  return (broadRegionAliases[region] ?? []).some((alias) =>
    normalizedUserRegion.includes(normalizeRegion(alias)),
  )
}

function paginateUsers(
  users: AdminUserDto[],
  page: number,
  pageSize: number,
): AdminUserDto[] {
  const start = (page - 1) * pageSize
  return users.slice(start, start + pageSize)
}

const EMPTY_STATS = {
  totalUsers: 0,
  admins: 0,
  pendingApproval: 0,
  activeUsers: 0,
  verifiedUsers: 0,
  roleBreakdown: {},
  genderBreakdown: {},
  healthStatusBreakdown: {},
  regionBreakdown: {},
}

export async function fetchAdminUsers(
  params: AdminUsersQueryParams = {},
): Promise<AdminUsersListResponse> {
  try {
    let apiResult: AdminUsersListResponse

    if ((params.region && params.region !== 'all') || params.withDeleted) {
      apiResult = await fetchAdminUsersFromApi({
        search: params.search,
        role: params.role,
        withDeleted: true,
        page: 1,
        pageSize: 100,
      })
      const page = params.page ?? 1
      const pageSize = params.pageSize ?? 4
      
      let filtered = apiResult.users
      if (params.region && params.region !== 'all') {
        filtered = filtered.filter((user) =>
          matchesRegionFilter(user, params.region),
        )
      }
      if (params.withDeleted) {
        filtered = filtered.filter((user) => !!user.deletedAt)
      } else {
        filtered = filtered.filter((user) => !user.deletedAt)
      }
      
      putAdminUsers(apiResult.users).catch(() => {})
      return {
        ...apiResult,
        users: paginateUsers(filtered, page, pageSize),
        total: filtered.length,
        page,
        pageSize,
      }
    }

    apiResult = await fetchAdminUsersFromApi({
      search: params.search,
      role: params.role,
      isActive: params.isActive,
      isVerified: params.isVerified,
      withDeleted: params.withDeleted,
      page: params.page,
      pageSize: params.pageSize,
    })
    putAdminUsers(apiResult.users).catch(() => {})
    return apiResult
  } catch {
    const cached = await getAdminUsers()
    const page = params.page ?? 1
    const pageSize = params.pageSize ?? 4
    let filtered = filterMockUsers(cached, params)
    if (params.withDeleted) {
      filtered = filtered.filter((user) => !!user.deletedAt)
    } else {
      filtered = filtered.filter((user) => !user.deletedAt)
    }
    return {
      users: paginateUsers(filtered, page, pageSize),
      stats: EMPTY_STATS,
      total: filtered.length,
      page,
      pageSize,
    }
  }
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
