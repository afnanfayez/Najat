'use client'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { getToken } from '@/lib/api/auth'
import { profileAPI } from '@/lib/api/profile'
import { getProfileQueryKey } from '@/lib/auth/tokenIdentity'
import { saveLocalAvatar, saveLocalProfileData } from '@/lib/profile/localProfileStorage'
import type { UpdateUserProfileBody } from '@/schemas/userProfile'
import { useAuth } from '@/context/AuthContext'

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

      const { avatarDataUrl, ...body } = payload
      
      // ✅ Save ONLY local data (avatar before upload)
      // ✅ API data (fullName, nationalId, etc.) goes to Backend only
      if (avatarDataUrl) {
        saveLocalProfileData(id, { avatarDataUrl })
      }

      return profileAPI.update(body)
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
