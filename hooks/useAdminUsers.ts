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
  restoreAdminUser,
  deleteAdminUser,
  type UpdateAdminUserBody,
} from '@/lib/api/adminUsers'
import { enqueueOfflineOp, getAdminUserById, putAdminUsers } from '@/lib/offline/db'

function isOffline() {
  return typeof navigator !== 'undefined' && !navigator.onLine
}

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
    mutationFn: async ({ id, body }: { id: string; body: UpdateAdminUserBody }) => {
      if (isOffline()) {
        const cached = await getAdminUserById(id)
        if (cached) {
          await putAdminUsers([{
            ...cached,
            name: body.fullName ?? body.name ?? cached.name,
            fullName: body.fullName ?? body.name ?? cached.fullName,
            email: body.email ?? cached.email,
            role: body.role ?? cached.role,
            region: body.region ?? cached.region,
            phoneNumber: body.phoneNumber ?? cached.phoneNumber,
          }])
        }
        await enqueueOfflineOp({ type: 'UPDATE_ADMIN_USER', payload: { id, body } })
        return cached
      }
      return updateAdminUser(id, body)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] })
    },
  })
}

export function useSetAdminUserActive() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, isActive }: { id: string; isActive: boolean }) => {
      if (isOffline()) {
        const cached = await getAdminUserById(id)
        if (cached) {
          await putAdminUsers([{ ...cached, isActive, enabled: isActive }])
        }
        await enqueueOfflineOp({ type: 'SET_ADMIN_USER_ACTIVE', payload: { id, isActive } })
        return cached
      }
      return setAdminUserActive(id, isActive)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] })
    },
  })
}

export function useRestoreAdminUser() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: string) => {
      if (isOffline()) {
        const cached = await getAdminUserById(id)
        if (cached) {
          await putAdminUsers([{ ...cached, deletedAt: null }])
        }
        await enqueueOfflineOp({ type: 'RESTORE_ADMIN_USER', payload: { id } })
        return cached
      }
      return restoreAdminUser(id)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] })
    },
  })
}

export function useDeleteAdminUser() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: string) => {
      if (isOffline()) {
        const cached = await getAdminUserById(id)
        if (cached) {
          await putAdminUsers([{ ...cached, deletedAt: new Date().toISOString() }])
        }
        await enqueueOfflineOp({ type: 'DELETE_ADMIN_USER', payload: { id } })
        return
      }
      return deleteAdminUser(id)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] })
    },
  })
}
