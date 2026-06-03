import { request } from '@/lib/api/api'
import { mergeProfileWithLocal } from '@/lib/profile/localProfileStorage'
import { mapUserProfile } from '@/lib/profile/mapUserProfile'
import type { UpdateUserProfileBody, UserProfile } from '@/schemas/userProfile'

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
      return mergeProfileWithLocal(profile)
    })
  },

  /** Tries server PATCH; on 403 merges local overrides so the UI still saves. */
  async update(
    id: string,
    body: UpdateUserProfileBody,
  ): Promise<ProfileUpdateResult> {
    try {
      await request(`${V1_ROOT}/users/${encodeURIComponent(id)}`, {
        method: 'PATCH',
        body: JSON.stringify(body),
      })
      const profile = await profileAPI.me()
      return { profile, syncedWithServer: true }
    } catch (err: unknown) {
      const status =
        err && typeof err === 'object' && 'status' in err
          ? (err as { status?: number }).status
          : undefined
      if (status === 403) {
        const base = mapUserProfile(await request(`${V1_ROOT}/auth/me`))
        if (!base) {
          throw { status: 500, message: 'تعذّر قراءة بيانات الملف الشخصي' }
        }
        return {
          profile: mergeProfileWithLocal(base),
          syncedWithServer: false,
        }
      }
      throw err
    }
  },
}
