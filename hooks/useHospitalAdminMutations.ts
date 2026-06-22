'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { hospitalsAPI } from '@/lib/api/hospitals'
import { enqueueOfflineOp } from '@/lib/offline/db'
import type { HospitalCapacityStatus } from '@/schemas/hospitalApi'
import { isConnectivityError } from '@/lib/api/api'
import { isBrowserOffline } from '@/lib/offline/connectionState'

/** Ready-to-use mutations for ADMIN/VOLUNTEER flows with offline support. */
export function useHospitalAdminMutations() {
  const queryClient = useQueryClient()

  const invalidateLists = () => {
    queryClient.invalidateQueries({ queryKey: ['health-facilities'] })
  }

  // ── Create — يتطلب إنترنت (FormData + صور) ──────────────────────────────
  const createHospital = useMutation({
    mutationFn: (formData: FormData) => {
      if (isBrowserOffline()) {
        return Promise.reject(new Error('يتطلب إنشاء مرفق جديد اتصالاً بالإنترنت (يحتوي على صور)'))
      }
      return hospitalsAPI.create(formData)
    },
    onSuccess: () => {
      if (typeof window !== 'undefined' && navigator.onLine) {
        invalidateLists()
      }
    },
    onError: (err) => {
      toast.error(err.message ?? 'فشل إنشاء المرفق', { duration: 4000 })
    },
  })

  // ── Update — يتطلب إنترنت (FormData + صور) ──────────────────────────────
  const updateHospital = useMutation({
    mutationFn: ({
      id,
      body,
    }: {
      id: string
      body: Record<string, unknown> | FormData
    }) => {
      if (isBrowserOffline()) {
        return Promise.reject(new Error('يتطلب تعديل المرفق اتصالاً بالإنترنت (يحتوي على صور)'))
      }
      return hospitalsAPI.update(id, body)
    },
    onSuccess: () => {
      if (typeof window !== 'undefined' && navigator.onLine) {
        invalidateLists()
      }
    },
    onError: (err) => {
      toast.error(err.message ?? 'فشل تعديل المرفق', { duration: 4000 })
    },
  })

  // ── Delete — يعمل offline عبر الـ queue ─────────────────────────────────
  const deleteHospital = useMutation({
    mutationFn: async (id: string) => {
      const handleOffline = async () => {
        await enqueueOfflineOp({
          type: 'DELETE_FACILITY',
          payload: { id, updatedAt: Date.now() },
        })
        // Optimistic: أزل من cache
        queryClient.setQueryData<{ facilities: { id: string }[]; total: number }>(
          ['health-facilities', 'hospitals'],
          (old) => {
            if (!old) return old
            return {
              ...old,
              facilities: old.facilities.filter((f) => f.id !== id),
              total: Math.max(0, old.total - 1),
            }
          },
        )
        toast.info('سيتم حذف المرفق عند عودة الاتصال', { duration: 4000 })
        return null
      }

      const offline = isBrowserOffline()
      if (offline) {
        return handleOffline()
      }

      try {
        return await hospitalsAPI.softDelete(id)
      } catch (err) {
        if (isConnectivityError(err)) {
          return handleOffline()
        }
        throw err
      }
    },
    onSuccess: (result) => {
      if (result !== null && typeof window !== 'undefined' && navigator.onLine) {
        invalidateLists()
      }
    },
    onError: (err) => {
      toast.error(err.message ?? 'فشل حذف المرفق', { duration: 4000 })
    },
  })

  // ── Update Status — يعمل offline عبر الـ queue ──────────────────────────
  const updateHospitalStatus = useMutation({
    mutationFn: async ({
      id,
      status,
    }: {
      id: string
      status: HospitalCapacityStatus
    }) => {
      const handleOffline = async () => {
        await enqueueOfflineOp({
          type: 'UPDATE_FACILITY_STATUS',
          payload: { id, status, updatedAt: Date.now() },
        })
        // Optimistic update في الـ cache
        queryClient.setQueriesData<{ facilities: Array<{ id: string; status?: string }>; total: number }>(
          { queryKey: ['health-facilities'] },
          (old) => {
            if (!old) return old
            return {
              ...old,
              facilities: old.facilities.map((f) =>
                f.id === id ? { ...f, status } : f,
              ),
            }
          },
        )
        toast.info('سيتم تحديث حالة المرفق عند عودة الاتصال', { duration: 4000 })
        return null
      }

      const offline = isBrowserOffline()
      if (offline) {
        return handleOffline()
      }

      try {
        return await hospitalsAPI.updateStatus(id, { status })
      } catch (err) {
        if (isConnectivityError(err)) {
          return handleOffline()
        }
        throw err
      }
    },
    onSuccess: (result) => {
      if (result !== null && typeof window !== 'undefined' && navigator.onLine) {
        invalidateLists()
      }
    },
    onError: (err) => {
      toast.error(err.message ?? 'فشل تحديث حالة المرفق', { duration: 4000 })
    },
  })

  return {
    createHospital,
    updateHospital,
    deleteHospital,
    updateHospitalStatus,
  }
}
