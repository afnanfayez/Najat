import { request } from '@/lib/api/api'
import {
  getMockAdminUsersList,
  updateMockAdminUser,
  USE_MOCK_ADMIN_USERS,
} from '@/lib/mocks/adminUsersMockData'
import type { AdminUserDto, AdminUsersListResponse } from '@/schemas/adminUser'

function normalizeUsersResponse(raw: unknown): AdminUsersListResponse {
  if (raw && typeof raw === 'object') {
    const obj = raw as Record<string, unknown>

    if (Array.isArray(obj.users) && obj.stats && typeof obj.stats === 'object') {
      return {
        users: obj.users as AdminUsersListResponse['users'],
        stats: obj.stats as AdminUsersListResponse['stats'],
        total: typeof obj.total === 'number' ? obj.total : obj.users.length,
        page: typeof obj.page === 'number' ? obj.page : 1,
        pageSize: typeof obj.pageSize === 'number' ? obj.pageSize : 10,
      }
    }

    if (obj.data && typeof obj.data === 'object') {
      return normalizeUsersResponse(obj.data)
    }
  }

  return {
    users: [],
    stats: { totalUsers: 0, admins: 0, pendingApproval: 0 },
    total: 0,
    page: 1,
    pageSize: 10,
  }
}

export async function fetchAdminUsersFromApi(
  params: Record<string, string | number | undefined> = {},
): Promise<AdminUsersListResponse> {
  const searchParams = new URLSearchParams()
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== '') {
      searchParams.set(key, String(value))
    }
  })

  const query = searchParams.toString()
  const path = query ? `/v1/admin/users?${query}` : '/v1/admin/users'
  const response = await request(path, { method: 'GET' })
  return normalizeUsersResponse(response)
}

export type UpdateAdminUserBody = Partial<
  Pick<AdminUserDto, 'name' | 'email' | 'role' | 'region' | 'status' | 'enabled'>
>

export async function updateAdminUser(
  id: string,
  body: UpdateAdminUserBody,
): Promise<AdminUserDto> {
  if (USE_MOCK_ADMIN_USERS) {
    const updated = updateMockAdminUser(id, body)
    if (!updated) throw { status: 404, message: 'المستخدم غير موجود' }
    return updated
  }

  const response = await request(`/v1/admin/users/${encodeURIComponent(id)}`, {
    method: 'PATCH',
    body: JSON.stringify(body),
  })
  return response as AdminUserDto
}

// Re-export for convenience so callers don't need to import from mock directly
export { getMockAdminUsersList }
