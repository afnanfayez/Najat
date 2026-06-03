import type { UserProfile } from '@/schemas/userProfile'
import { normalizeUserRole, type UserRole } from '@/lib/auth/roleUtils'

function pickUserRecord(raw: unknown): Record<string, unknown> | null {
  if (!raw || typeof raw !== 'object') return null
  const r = raw as Record<string, unknown>
  if (r.data && typeof r.data === 'object' && !Array.isArray(r.data)) {
    return r.data as Record<string, unknown>
  }
  if (r.user && typeof r.user === 'object') {
    return r.user as Record<string, unknown>
  }
  return r
}

export function getExplicitApiRole(raw: unknown): UserRole | null {
  const u = pickUserRecord(raw)
  if (!u) return null
  return normalizeUserRole(u.role)
}

export function mapUserProfile(raw: unknown): UserProfile | null {
  const u = pickUserRecord(raw)
  if (!u) return null

  const id =
    typeof u?.id === 'string'
      ? u.id
      : typeof u?.id === 'number'
        ? String(u.id)
        : ''
  if (!id) return null

  const role = normalizeUserRole(u.role) ?? 'resident' // finalized in profileAPI.me via JWT

  return {
    id,
    email: typeof u.email === 'string' ? u.email : '',
    fullName:
      (typeof u.fullName === 'string' && u.fullName) ||
      (typeof u.full_name === 'string' && u.full_name) ||
      (typeof u.name === 'string' && u.name) ||
      '',
    role,
    phoneNumber:
      (typeof u.phoneNumber === 'string' ? u.phoneNumber : null) ??
      (typeof u.phone_number === 'string' ? u.phone_number : null),
    gender: u.gender === 'male' || u.gender === 'female' ? u.gender : null,
    ageGroup:
      u.ageGroup === '18-40' || u.ageGroup === 'above 40'
        ? u.ageGroup
        : null,
    maritalStatus:
      u.maritalStatus === 'single' ||
      u.maritalStatus === 'married' ||
      u.maritalStatus === 'divorced' ||
      u.maritalStatus === 'widowed'
        ? u.maritalStatus
        : null,
    healthStatus:
      u.healthStatus === 'Healthy' ||
      u.healthStatus === 'Chronically Ill' ||
      u.healthStatus === 'Injured' ||
      u.healthStatus === 'Amputee'
        ? u.healthStatus
        : null,
    nationalId:
      (typeof u.nationalId === 'string' ? u.nationalId : null) ??
      (typeof u.national_id === 'string' ? u.national_id : null),
    housingStatus:
      typeof u.housingStatus === 'string' ? u.housingStatus : null,
    familyMembersCount:
      typeof u.familyMembersCount === 'number' ? u.familyMembersCount : null,
    femalesCount: typeof u.femalesCount === 'number' ? u.femalesCount : null,
    malesCount: typeof u.malesCount === 'number' ? u.malesCount : null,
    region: typeof u.region === 'string' ? u.region : null,
    isVerified: typeof u.isVerified === 'boolean' ? u.isVerified : undefined,
    isActive: typeof u.isActive === 'boolean' ? u.isActive : undefined,
    avatarUrl:
      (typeof u.avatarUrl === 'string' ? u.avatarUrl : null) ??
      (typeof u.avatar === 'string' ? u.avatar : null) ??
      (typeof u.profileImage === 'string' ? u.profileImage : null),
  }
}

export type AuthUserProfile = UserProfile & { role: UserRole }

export function toAuthUser(profile: UserProfile): AuthUserProfile {
  return profile as AuthUserProfile
}
