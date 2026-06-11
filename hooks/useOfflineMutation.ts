'use client'

import { useState, useCallback } from 'react'
import { useMutation, useQueryClient, type QueryKey } from '@tanstack/react-query'
import { toast } from 'sonner'
import { idbEnqueueSync, type SyncQueueItem } from '@/lib/pwa/offlineDB'
import { enqueueOfflineOp, type OfflineSyncType } from '@/lib/offline/db'

type SyncType = SyncQueueItem['type'] | OfflineSyncType

export interface UseOfflineMutationOptions<TInput, TOutput> {
  /** الدالة الأصلية التي تتصل بالـ API */
  mutationFn: (input: TInput) => Promise<TOutput>
  /** نوع العملية في الـ sync queue */
  syncType: SyncType
  /** تحويل الـ input إلى payload يُخزن في الـ queue */
  serializePayload: (input: TInput) => Record<string, unknown>
  /** Optimistic update: يُعدّل React Query cache مباشرة عند offline */
  optimisticUpdater?: (queryClient: ReturnType<typeof useQueryClient>, input: TInput) => void
  /** مفاتيح الـ queries التي تُعاد بعد نجاح العملية online */
  queryKeysToInvalidate?: QueryKey[]
  /** إذا true يرفض العملية offline ويطلب اتصالاً */
  requiresOnline?: boolean
  /** رسالة نجاح online */
  successMessage?: string
  /** رسالة نجاح offline (وضع الانتظار) */
  queuedMessage?: string
  /** رسالة الخطأ عند الحاجة لإنترنت */
  requiresOnlineMessage?: string
}

export interface UseOfflineMutationResult<TInput, TOutput> {
  mutate: (input: TInput) => void
  mutateAsync: (input: TInput) => Promise<TOutput | null>
  isPending: boolean
  isQueued: boolean
  error: Error | null
}

/**
 * Hook عام لـ offline-first mutations.
 * - Online: يُنفّذ mutationFn مباشرة
 * - Offline + requiresOnline=true: يعرض رسالة خطأ
 * - Offline + requiresOnline=false: يحفظ في syncQueue + Optimistic Update
 */
export function useOfflineMutation<TInput, TOutput = unknown>(
  options: UseOfflineMutationOptions<TInput, TOutput>,
): UseOfflineMutationResult<TInput, TOutput> {
  const {
    mutationFn,
    syncType,
    serializePayload,
    optimisticUpdater,
    queryKeysToInvalidate = [],
    requiresOnline = false,
    successMessage,
    queuedMessage = 'سيتم تنفيذ العملية عند عودة الاتصال بالإنترنت',
    requiresOnlineMessage = 'يتطلب هذا الإجراء اتصالاً بالإنترنت',
  } = options

  const queryClient = useQueryClient()
  const [isQueued, setIsQueued] = useState(false)

  const isOfflineSyncType = (t: SyncType): t is OfflineSyncType =>
    ['UPDATE_FACILITY_STATUS', 'DELETE_FACILITY', 'CREATE_AID_POINT',
      'UPDATE_AID_POINT', 'DELETE_AID_POINT', 'UPDATE_AID_STATUS'].includes(t)

  const enqueueOperation = useCallback(
    async (input: TInput): Promise<void> => {
      const payload = serializePayload(input)
      if (isOfflineSyncType(syncType)) {
        await enqueueOfflineOp({ type: syncType, payload })
      } else {
        await idbEnqueueSync({
          type: syncType as SyncQueueItem['type'],
          status: 'pending',
          payload,
          createdAt: Date.now(),
        })
      }
    },
    [syncType, serializePayload],
  )

  const mutation = useMutation<TOutput, Error, TInput>({
    mutationFn: async (input: TInput): Promise<TOutput> => {
      const offline = typeof navigator !== 'undefined' && !navigator.onLine

      if (offline) {
        if (requiresOnline) {
          throw new Error(requiresOnlineMessage)
        }

        await enqueueOperation(input)
        optimisticUpdater?.(queryClient, input)
        setIsQueued(true)

        toast.info(queuedMessage, { duration: 4000 })
        // إرجاع null كـ TOutput عند الـ offline (optimistic)
        return null as unknown as TOutput
      }

      // Online: تنفيذ مباشر
      const result = await mutationFn(input)

      if (successMessage) {
        toast.success(successMessage, { duration: 3000 })
      }

      return result
    },

    onSuccess: () => {
      const offline = typeof navigator !== 'undefined' && !navigator.onLine
      if (offline) return // لا تُعيد تحميل البيانات عند الـ offline

      for (const key of queryKeysToInvalidate) {
        queryClient.invalidateQueries({ queryKey: key })
      }
    },

    onError: (err) => {
      if (err.message === requiresOnlineMessage) {
        toast.error(requiresOnlineMessage, {
          description: 'تأكد من الاتصال بالإنترنت وأعد المحاولة',
          duration: 4000,
        })
        return
      }
      toast.error('حدث خطأ أثناء تنفيذ العملية', {
        description: err.message,
        duration: 4000,
      })
    },
  })

  return {
    mutate: mutation.mutate,
    mutateAsync: mutation.mutateAsync as (input: TInput) => Promise<TOutput | null>,
    isPending: mutation.isPending,
    isQueued,
    error: mutation.error,
  }
}
