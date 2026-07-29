import { request } from '@/lib/api/api'
import { mapUserProfile } from '@/lib/profile/mapUserProfile'
import type { UserProfile } from '@/schemas/userProfile'

const V1_ROOT =
  process.env.NEXT_PUBLIC_API_V1_ROOT?.replace(/\/$/, '') ?? '/v1'

export type ProfileUpdateResult = {
  profile: UserProfile
  syncedWithServer: boolean
}

export const profileAPI = {
  me(): Promise<UserProfile> {
    return request(`${V1_ROOT}/auth/me`).then((raw) => {
      const profile = mapUserProfile(raw)
      if (!profile) {
        throw { status: 500, message: 'تعذّر قراءة بيانات الملف الشخصي' }
      }
      return profile
    })
  },

  /** Updates the authenticated user's profile via PATCH /auth/me. */
  async update(body: any): Promise<ProfileUpdateResult> {
    const res = await request(`${V1_ROOT}/auth/me`, {
      method: 'PATCH',
      body: JSON.stringify(body),
    })
    const profile = res?.data ?? (await profileAPI.me())
    return { profile, syncedWithServer: true }
  },
}
