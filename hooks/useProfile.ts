'use client'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { getToken } from '@/lib/api/auth'
import { profileAPI } from '@/lib/api/profile'
import {
  saveLocalAvatar,
  saveLocalOverrides,
} from '@/lib/profile/localProfileStorage'
import type { UpdateUserProfileBody } from '@/schemas/userProfile'
import { useAuth } from '@/context/AuthContext'

export type ProfileSavePayload = UpdateUserProfileBody & {
  avatarDataUrl?: string
}

export function useProfile() {
  const { isHydrated, refreshUser } = useAuth()
  const queryClient = useQueryClient()

  const query = useQuery({
    queryKey: ['profile', 'me'],
    queryFn: () => profileAPI.me(),
    enabled: isHydrated && Boolean(getToken()),
    staleTime: 1000 * 60,
    retry: 1,
  })

  const mutation = useMutation({
    mutationFn: async (payload: ProfileSavePayload) => {
      const id = query.data?.id
      if (!id) throw { status: 400, message: 'لم يتم تحميل الملف الشخصي بعد' }

      const { avatarDataUrl, ...body } = payload
      if (avatarDataUrl) saveLocalAvatar(id, avatarDataUrl)
      if (Object.keys(body).length > 0) saveLocalOverrides(id, body)

      return profileAPI.update(id, body)
    },
    onSuccess: async ({ profile }) => {
      queryClient.setQueryData(['profile', 'me'], profile)
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
