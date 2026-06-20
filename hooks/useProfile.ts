'use client'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { getToken } from '@/lib/api/auth'
import { profileAPI } from '@/lib/api/profile'
import { getProfileQueryKey } from '@/lib/auth/tokenIdentity'
import {
  mergeProfileAvatarOnly,
  saveLocalProfileData,
  saveLocalOverrides,
  type LocalProfileData,
} from '@/lib/profile/localProfileStorage'
import { validateProfileUpdate } from '@/schemas/userProfile'
import type { UpdateUserProfileBody } from '@/schemas/userProfile'
import { useAuth } from '@/context/AuthContext'
import { enqueueOfflineOp } from '@/lib/offline/db'
import {
  getOfflineCachedProfile,
  updateOfflineLoginProfile,
} from '@/lib/auth/offlineLogin'

export type ProfileSavePayload = UpdateUserProfileBody & {
  avatarDataUrl?: string
  emergencyContacts?: LocalProfileData['emergencyContacts']
  sosMessage?: string
  bloodType?: string
}

async function loadProfileOffline() {
  const cached = await getOfflineCachedProfile()
  if (!cached) {
    throw { status: 0, message: 'الملف الشخصي غير متوفر دون اتصال' }
  }
  return mergeProfileAvatarOnly(cached)
}

export function useProfile() {
  const { isHydrated, refreshUser } = useAuth()
  const queryClient = useQueryClient()
  const token = getToken()
  const queryKey = getProfileQueryKey(token)
  const query = useQuery({
    queryKey,
    queryFn: async () => {
      const offline = typeof navigator !== 'undefined' && !navigator.onLine
      if (offline) {
        return loadProfileOffline()
      }

      try {
        const profile = await profileAPI.me()
        await updateOfflineLoginProfile(profile)
        return mergeProfileAvatarOnly(profile)
      } catch (err) {
        try {
          return await loadProfileOffline()
        } catch {
          throw err
        }
      }
    },
    enabled: isHydrated && Boolean(token),
    staleTime: 60_000,
    retry: (count) => {
      if (typeof navigator !== 'undefined' && !navigator.onLine) return false
      return count < 1
    },
    gcTime: 5 * 60_000,
  })

  const mutation = useMutation({
    mutationFn: async (payload: ProfileSavePayload) => {
      const id = query.data?.id
      if (!id) throw { status: 400, message: 'لم يتم تحميل الملف الشخصي بعد' }

      const {
        avatarDataUrl,
        assistancePreferences,
        assistanceLocation,
        assistanceRadius,
        emergencyContacts,
        sosMessage,
        bloodType,
        ...backendBody
      } = payload

      // Validate backend-bound fields up front so invalid input is rejected the
      // same way whether online or offline (prevents permanently-stuck overrides).
      if (Object.keys(backendBody).length > 0) {
        const validationError = validateProfileUpdate(backendBody)
        if (validationError) throw { status: 422, message: validationError }
      }

      const localDataToSave: Partial<LocalProfileData> = {}
      if (avatarDataUrl !== undefined) {
        localDataToSave.avatarDataUrl = avatarDataUrl
      }
      if (assistancePreferences !== undefined) {
        localDataToSave.assistancePreferences = assistancePreferences
      }
      if (assistanceLocation !== undefined) {
        localDataToSave.assistanceLocation = assistanceLocation
      }
      if (assistanceRadius !== undefined) {
        localDataToSave.assistanceRadius = assistanceRadius
      }
      if (emergencyContacts !== undefined) {
        localDataToSave.emergencyContacts = emergencyContacts
      }
      if (sosMessage !== undefined) {
        localDataToSave.sosMessage = sosMessage
      }
      if (bloodType !== undefined) {
        localDataToSave.bloodType = bloodType
      }

      if (Object.keys(localDataToSave).length > 0) {
        saveLocalProfileData(id, localDataToSave)
      }

      const current = query.data ?? (await loadProfileOffline().catch(() => null))
      if (!current) throw { status: 400, message: 'لم يتم تحميل الملف الشخصي بعد' }

      const merged = mergeProfileAvatarOnly({
        ...current,
        ...payload,
      })

      const offline = typeof navigator !== 'undefined' && !navigator.onLine
      if (offline) {
        saveLocalOverrides(id, backendBody)
        await updateOfflineLoginProfile(merged)
        await enqueueOfflineOp({
          type: 'PROFILE_SYNC',
          payload: payload as Record<string, unknown>,
        })
        toast.success('تم حفظ التعديلات محلياً وسيتم رفعها عند عودة الاتصال')
        return { profile: merged, syncedWithServer: false }
      }

      try {
        const result = await profileAPI.update(payload)
        await updateOfflineLoginProfile(result.profile)
        return result
      } catch (err) {
        // Distinguish a real backend rejection (validation) from a connectivity
        // failure. Connectivity failures are queued exactly like an offline edit;
        // validation errors are surfaced so the user can correct the input.
        const status = (err as { status?: number })?.status
        const isConnectivity =
          status === 0 || status === 504 || status === 502 || status === undefined
        if (!isConnectivity) throw err

        saveLocalOverrides(id, backendBody)
        await updateOfflineLoginProfile(merged)
        await enqueueOfflineOp({
          type: 'PROFILE_SYNC',
          payload: payload as Record<string, unknown>,
        })
        toast.success('تم حفظ التعديلات محلياً وسيتم رفعها عند عودة الاتصال')
        return { profile: merged, syncedWithServer: false }
      }
    },
    onSuccess: async ({ profile, syncedWithServer }) => {
      queryClient.setQueryData(getProfileQueryKey(token), profile)
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
