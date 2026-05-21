'use client'

import { useQuery } from '@tanstack/react-query'
import {
  fetchAdminUsers,
  mapAdminUsersList,
  type AdminUsersQueryParams,
} from '@/components/admin/data/adminUsersService'

export function useAdminUsers(params: AdminUsersQueryParams) {
  const query = useQuery({
    queryKey: ['admin-users', params],
    queryFn: () => fetchAdminUsers(params),
  })

  const users = mapAdminUsersList(query.data?.users ?? [])
  const stats = query.data?.stats
  const total = query.data?.total ?? 0
  const page = query.data?.page ?? params.page ?? 1
  const pageSize = query.data?.pageSize ?? params.pageSize ?? 4

  return {
    ...query,
    users,
    stats,
    total,
    page,
    pageSize,
  }
}
