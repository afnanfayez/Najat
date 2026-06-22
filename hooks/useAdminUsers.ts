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
import { isConnectivityError } from '@/lib/api/api'
import { isBrowserOffline } from '@/lib/offline/connectionState'

function isOffline() {
  return isBrowserOffline()
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
      console.log(`[CONN-DEBUG] useUpdateAdminUser mutationFn START @ ${Date.now()} isOffline()=${isOffline()} navigator.onLine=${navigator.onLine}`)
      const handleOffline = async () => {
        console.log(`[CONN-DEBUG] useUpdateAdminUser handleOffline() START @ ${Date.now()}`)
        const cached = await getAdminUserById(id)
        console.log(`[CONN-DEBUG] useUpdateAdminUser handleOffline() got cached @ ${Date.now()} found=${!!cached}`)
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
          console.log(`[CONN-DEBUG] useUpdateAdminUser handleOffline() putAdminUsers done @ ${Date.now()}`)
        }
        await enqueueOfflineOp({ type: 'UPDATE_ADMIN_USER', payload: { id, body } })
        console.log(`[CONN-DEBUG] useUpdateAdminUser handleOffline() enqueueOfflineOp done @ ${Date.now()}`)
        return cached
      }

      if (isOffline()) {
        console.log(`[CONN-DEBUG] useUpdateAdminUser taking OFFLINE branch @ ${Date.now()}`)
        return handleOffline()
      }

      console.log(`[CONN-DEBUG] useUpdateAdminUser taking ONLINE branch (calling real API) @ ${Date.now()}`)
      try {
        const result = await updateAdminUser(id, body)
        console.log(`[CONN-DEBUG] useUpdateAdminUser ONLINE branch SUCCEEDED @ ${Date.now()}`)
        return result
      } catch (err) {
        console.log(`[CONN-DEBUG] useUpdateAdminUser ONLINE branch FAILED @ ${Date.now()} isConnectivityError=${isConnectivityError(err)} err=`, err)
        if (isConnectivityError(err)) {
          return handleOffline()
        }
        throw err
      }
    },
    onSuccess: () => {
      if (typeof window !== 'undefined') {
        queryClient.invalidateQueries({ queryKey: ['admin-users'] }).catch(() => {})
      }
    },
  })
}

export function useSetAdminUserActive() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, isActive }: { id: string; isActive: boolean }) => {
      const handleOffline = async () => {
        const cached = await getAdminUserById(id)
        if (cached) {
          await putAdminUsers([{ ...cached, isActive, enabled: isActive }])
        }
        await enqueueOfflineOp({ type: 'SET_ADMIN_USER_ACTIVE', payload: { id, isActive } })
        return cached
      }

      if (isOffline()) {
        return handleOffline()
      }

      try {
        return await setAdminUserActive(id, isActive)
      } catch (err) {
        if (isConnectivityError(err)) {
          return handleOffline()
        }
        throw err
      }
    },
    onSuccess: () => {
      if (typeof window !== 'undefined') {
        queryClient.invalidateQueries({ queryKey: ['admin-users'] }).catch(() => {})
      }
    },
  })
}

export function useRestoreAdminUser() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: string) => {
      const handleOffline = async () => {
        const cached = await getAdminUserById(id)
        if (cached) {
          await putAdminUsers([{ ...cached, deletedAt: null }])
        }
        await enqueueOfflineOp({ type: 'RESTORE_ADMIN_USER', payload: { id } })
        return cached
      }

      if (isOffline()) {
        return handleOffline()
      }

      try {
        return await restoreAdminUser(id)
      } catch (err) {
        if (isConnectivityError(err)) {
          return handleOffline()
        }
        throw err
      }
    },
    onSuccess: () => {
      if (typeof window !== 'undefined') {
        queryClient.invalidateQueries({ queryKey: ['admin-users'] }).catch(() => {})
      }
    },
  })
}

export function useDeleteAdminUser() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: string) => {
      const handleOffline = async () => {
        const cached = await getAdminUserById(id)
        if (cached) {
          await putAdminUsers([{ ...cached, deletedAt: new Date().toISOString() }])
        }
        await enqueueOfflineOp({ type: 'DELETE_ADMIN_USER', payload: { id } })
        return cached
      }

      if (isOffline()) {
        return handleOffline()
      }

      try {
        return await deleteAdminUser(id)
      } catch (err) {
        if (isConnectivityError(err)) {
          return handleOffline()
        }
        throw err
      }
    },
    onSuccess: () => {
      if (typeof window !== 'undefined') {
        queryClient.invalidateQueries({ queryKey: ['admin-users'] }).catch(() => {})
      }
    },
  })
}
