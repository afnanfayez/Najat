'use client'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { getToken } from '@/lib/api/auth'
import { profileAPI } from '@/lib/api/profile'
import { getProfileQueryKey } from '@/lib/auth/tokenIdentity'
import { saveLocalAvatar, saveLocalProfileData, type LocalProfileData } from '@/lib/profile/localProfileStorage'
import type { UpdateUserProfileBody } from '@/schemas/userProfile'
import { useAuth } from '@/context/AuthContext'
import { idbEnqueueSync } from '@/lib/pwa/offlineDB'

export type ProfileSavePayload = UpdateUserProfileBody & {
  avatarDataUrl?: string
}

export function useProfile() {
  const { isHydrated, refreshUser } = useAuth()
  const queryClient = useQueryClient()
  const token = getToken()
  const queryKey = getProfileQueryKey(token)

  const query = useQuery({
    queryKey,
    queryFn: () => profileAPI.me(),
    enabled: isHydrated && Boolean(token),
    staleTime: 0,
    retry: 1,
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
        ...backendBody
      } = payload

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

      if (Object.keys(localDataToSave).length > 0) {
        saveLocalProfileData(id, localDataToSave)
      }

      if (Object.keys(backendBody).length === 0) {
        const profile = await profileAPI.me()
        return { profile, syncedWithServer: false }
      }

      if (typeof navigator !== 'undefined' && !navigator.onLine) {
        await idbEnqueueSync({
          type: 'PROFILE_SYNC',
          status: 'pending',
          payload: backendBody as Record<string, unknown>,
          createdAt: Date.now(),
        })
        toast.success('تم حفظ التعديلات وسيتم مزامنتها عند عودة الاتصال')
        const current = query.data
        if (!current) throw { status: 400, message: 'لم يتم تحميل الملف الشخصي بعد' }
        return {
          profile: { ...current, ...backendBody },
          syncedWithServer: false,
        }
      }

      return profileAPI.update(backendBody)
    },
    onSuccess: async ({ profile }) => {
      queryClient.setQueryData(getProfileQueryKey(token), profile)
      await refreshUser()
    },
  })

  const isLoading = !isHydrated || query.isLoading

  return {
    profile: query.data,
    isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
    saveProfile: mutation.mutateAsync,
    isSaving: mutation.isPending,
    saveError: mutation.error,
  }
}
