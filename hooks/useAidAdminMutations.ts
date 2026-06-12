'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { aidAPI, type AidStatus } from '@/lib/api/aid'
import { enqueueOfflineOp } from '@/lib/offline/db'

/** Mutations for ADMIN aid management with offline support. */
export function useAidAdminMutations() {
  const queryClient = useQueryClient()

  const invalidateAid = () => {
    queryClient.invalidateQueries({ queryKey: ['aid'] })
  }

  // ── Create Aid Point — يتطلب إنترنت (قد يحتوي صور) ──────────────────────
  const createAidPoint = useMutation({
    mutationFn: (body: Record<string, unknown>) => {
      if (typeof navigator !== 'undefined' && !navigator.onLine) {
        return Promise.reject(new Error('يتطلب إنشاء نقطة مساعدة اتصالاً بالإنترنت'))
      }
      return aidAPI.create(body)
    },
    onSuccess: invalidateAid,
    onError: (err) => {
      toast.error(err.message ?? 'فشل إنشاء نقطة المساعدة', { duration: 4000 })
    },
  })

  // ── Update Aid Point — يتطلب إنترنت (قد يحتوي صور) ─────────────────────
  const updateAidPoint = useMutation({
    mutationFn: ({ id, body }: { id: string; body: Record<string, unknown> }) => {
      if (typeof navigator !== 'undefined' && !navigator.onLine) {
        return Promise.reject(new Error('يتطلب تعديل نقطة المساعدة اتصالاً بالإنترنت'))
      }
      return aidAPI.update(id, body)
    },
    onSuccess: invalidateAid,
    onError: (err) => {
      toast.error(err.message ?? 'فشل تعديل نقطة المساعدة', { duration: 4000 })
    },
  })

  // ── Delete Aid Point — يعمل offline عبر الـ queue ───────────────────────
  const deleteAidPoint = useMutation({
    mutationFn: async (id: string) => {
      const offline = typeof navigator !== 'undefined' && !navigator.onLine

      if (offline) {
        await enqueueOfflineOp({
          type: 'DELETE_AID_POINT',
          payload: { id, updatedAt: Date.now() },
        })
        // Optimistic: أزل من cache
        queryClient.setQueryData<{ id: string }[]>(
          ['aid', 'catalog'],
          (old) => {
            if (!Array.isArray(old)) return old
            return old.filter((a) => a.id !== id)
          },
        )
        toast.info('سيتم حذف نقطة المساعدة عند عودة الاتصال', { duration: 4000 })
        return null
      }

      return aidAPI.softDelete(id)
    },
    onSuccess: (result) => {
      if (result !== null) invalidateAid()
    },
    onError: (err) => {
      toast.error(err.message ?? 'فشل حذف نقطة المساعدة', { duration: 4000 })
    },
  })

  // ── Update Aid Status — يعمل offline عبر الـ queue ──────────────────────
  const updateAidStatus = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: AidStatus }) => {
      const offline = typeof navigator !== 'undefined' && !navigator.onLine

      if (offline) {
        await enqueueOfflineOp({
          type: 'UPDATE_AID_STATUS',
          payload: { id, status, updatedAt: Date.now() },
        })
        // Optimistic update في الـ cache
        queryClient.setQueryData<Array<{ id: string; status?: string }>>(
          ['aid', 'catalog'],
          (old) => {
            if (!Array.isArray(old)) return old
            return old.map((a) => (a.id === id ? { ...a, status } : a))
          },
        )
        toast.info('سيتم تحديث حالة المساعدة عند عودة الاتصال', { duration: 4000 })
        return null
      }

      return aidAPI.updateStatus(id, { status })
    },
    onSuccess: (result) => {
      if (result !== null) invalidateAid()
    },
    onError: (err) => {
      toast.error(err.message ?? 'فشل تحديث حالة المساعدة', { duration: 4000 })
    },
  })

  return {
    createAidPoint,
    updateAidPoint,
    deleteAidPoint,
    updateAidStatus,
  }
}
