import { request } from '@/lib/api/api'
import { getToken } from '@/lib/api/auth'
import { getUserRole } from '@/lib/auth/sessionRole'
import { getRoleFromJwt, normalizeUserRole } from '@/lib/auth/roleUtils'
import { mergeProfileWithLocal } from '@/lib/profile/localProfileStorage'
import {
  getExplicitApiRole,
  mapUserProfile,
} from '@/lib/profile/mapUserProfile'
import type { UpdateUserProfileBody, UserProfile } from '@/schemas/userProfile'

const V1_ROOT =
  process.env.NEXT_PUBLIC_API_V1_ROOT?.replace(/\/$/, '') ?? '/v1'

export type ProfileUpdateResult = {
  profile: UserProfile
  syncedWithServer: boolean
}

function resolveProfileRole(raw: unknown, profile: UserProfile): UserProfile['role'] {
  const token = getToken()
  const explicitApiRole = getExplicitApiRole(raw)
  const jwtRole = getRoleFromJwt(token)
  const storedRole = normalizeUserRole(getUserRole())

  return (
    explicitApiRole ??
    jwtRole ??
    storedRole ??
    profile.role ??
    'resident'
  )
}

function finalizeProfile(raw: unknown, profile: UserProfile): UserProfile {
  const role = resolveProfileRole(raw, profile)
  return mergeProfileWithLocal({ ...profile, role })
}

export const profileAPI = {
  me(): Promise<UserProfile> {
    return request(`${V1_ROOT}/auth/me`).then((raw) => {
      const profile = mapUserProfile(raw)
      if (!profile) {
        throw { status: 500, message: 'تعذّر قراءة بيانات الملف الشخصي' }
      }
      return finalizeProfile(raw, profile)
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
        const raw = await request(`${V1_ROOT}/auth/me`)
        const base = mapUserProfile(raw)
        if (!base) {
          throw { status: 500, message: 'تعذّر قراءة بيانات الملف الشخصي' }
        }
        return {
          profile: finalizeProfile(raw, base),
          syncedWithServer: false,
        }
      }
      throw err
    }
  },
}
