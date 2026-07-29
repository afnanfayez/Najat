'use client'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { profileAPI } from '@/lib/api/profile'
import { getProfileQueryKey } from '@/lib/auth/tokenIdentity'
import { validateProfileUpdate } from '@/schemas/userProfile'
import type { UpdateUserProfileBody } from '@/schemas/userProfile'
import { useAuth } from '@/context/AuthContext'
import { enqueueOfflineOp } from '@/lib/offline/db'
import { getOfflineCachedProfile, cacheProfileForOffline } from '@/lib/auth/offlineLogin'

export type ProfileSavePayload = UpdateUserProfileBody

async function loadProfileOffline() {
  const cached = await getOfflineCachedProfile()
  if (!cached) {
    throw { status: 0, message: 'الملف الشخصي غير متوفر دون اتصال' }
  }
  return cached
}

export function useProfile() {
  const { isHydrated, user, refreshUser } = useAuth()
  const queryClient = useQueryClient()
  const queryKey = getProfileQueryKey()
  const query = useQuery({
    queryKey,
    queryFn: async () => {
      const offline = typeof navigator !== 'undefined' && !navigator.onLine
      if (offline) {
        return loadProfileOffline()
      }

      try {
        const profile = await profileAPI.me()
        await cacheProfileForOffline(profile)
        return profile
      } catch (err) {
        try {
          return await loadProfileOffline()
        } catch {
          throw err
        }
      }
    },
    enabled: isHydrated && Boolean(user),
    staleTime: 60_000,
    retry: (count) => {
      if (typeof navigator !== 'undefined' && !navigator.onLine) return false
      return count < 1
    },
    gcTime: 5 * 60_000,
  })

  const mutation = useMutation({
    mutationFn: async (payload: ProfileSavePayload) => {
      const current = query.data ?? (await loadProfileOffline().catch(() => null))
      if (!current) throw { status: 400, message: 'لم يتم تحميل الملف الشخصي بعد' }

      // Every field is server-persisted now (see docs/BACKEND_API_SPEC.md
      // migration plan Phase 1 §1 & Phase 4) — validate the whole payload up
      // front so invalid input is rejected the same way whether online or
      // offline (prevents permanently-stuck optimistic edits).
      const validationError = validateProfileUpdate(payload)
      if (validationError) throw { status: 422, message: validationError }

      // Optimistic local view while offline/queued — never permanently
      // shadows the server; overwritten by the real response once synced.
      const optimistic = { ...current, ...payload }

      const offline = typeof navigator !== 'undefined' && !navigator.onLine
      if (offline) {
        await cacheProfileForOffline(optimistic)
        await enqueueOfflineOp({
          type: 'PROFILE_SYNC',
          payload: payload as Record<string, unknown>,
        })
        toast.success('تم حفظ التعديلات محلياً وسيتم رفعها عند عودة الاتصال')
        return { profile: optimistic, syncedWithServer: false }
      }

      try {
        const result = await profileAPI.update(payload)
        await cacheProfileForOffline(result.profile)
        return result
      } catch (err) {
        // Distinguish a real backend rejection (validation) from a connectivity
        // failure. Connectivity failures are queued exactly like an offline edit;
        // validation errors are surfaced so the user can correct the input.
        const status = (err as { status?: number })?.status
        const isConnectivity =
          status === 0 || status === 504 || status === 502 || status === undefined
        if (!isConnectivity) throw err

        await cacheProfileForOffline(optimistic)
        await enqueueOfflineOp({
          type: 'PROFILE_SYNC',
          payload: payload as Record<string, unknown>,
        })
        toast.success('تم حفظ التعديلات محلياً وسيتم رفعها عند عودة الاتصال')
        return { profile: optimistic, syncedWithServer: false }
      }
    },
    onSuccess: async ({ profile, syncedWithServer }) => {
      queryClient.setQueryData(getProfileQueryKey(), profile)
      if (syncedWithServer !== false) {
        await refreshUser()
      }
    },
  })

  const isLoading = !isHydrated || (query.isLoading && !query.data)

  return {
    profile: query.data,
    isLoading,
    isError: query.isError && !query.data,
    error: query.error,
    refetch: query.refetch,
    saveProfile: mutation.mutateAsync,
    isSaving: mutation.isPending,
    saveError: mutation.error,
  }
}
