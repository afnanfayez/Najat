'use client'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  fetchAdminUsers,
  mapAdminUsersList,
  type AdminUsersQueryParams,
} from '@/components/admin/data/adminUsersService'
import {
  setAdminUserActive,
  updateAdminUser,
  type UpdateAdminUserBody,
} from '@/lib/api/adminUsers'

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

export function useUpdateAdminUser() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, body }: { id: string; body: UpdateAdminUserBody }) =>
      updateAdminUser(id, body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] })
    },
  })
}

export function useSetAdminUserActive() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, isActive }: { id: string; isActive: boolean }) =>
      setAdminUserActive(id, isActive),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] })
    },
  })
}
