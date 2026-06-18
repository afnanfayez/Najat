import type { UpdateUserProfileBody, UserProfile, AssistancePreferences } from '@/schemas/userProfile'

export type EmergencyContact = {
  id: string
  name: string
  phone: string
}

/**
 * Local-only data that should NOT come from Backend API.
 * API data (fullName, nationalId, etc.) is managed by Backend only.
 */
export type LocalProfileData = {
  avatarDataUrl?: string        // Local image before upload
  emergencyContacts?: EmergencyContact[]
  sosMessage?: string
  assistancePreferences?: AssistancePreferences
  assistanceLocation?: string
  assistanceRadius?: number
  overrides?: UpdateUserProfileBody
  bloodType?: string
}

const STORAGE_PREFIX = 'najat_profile_local_'
const MAX_AVATAR_BYTES = 5_000_000

function storageKey(userId: string) {
  return `${STORAGE_PREFIX}${userId}`
}

function readRaw(userId: string): LocalProfileData {
  if (typeof window === 'undefined' || !userId) return {}
  try {
    const raw = localStorage.getItem(storageKey(userId))
    if (!raw) return {}
    return JSON.parse(raw) as LocalProfileData
  } catch {
    return {}
  }
}

function isQuotaError(error: unknown): boolean {
  return (
    error instanceof DOMException &&
    (error.name === 'QuotaExceededError' ||
      error.name === 'NS_ERROR_DOM_QUOTA_REACHED' ||
      error.code === 22)
  )
}

/** Free localStorage by dropping OTHER users' avatar blobs (the heaviest items). */
function evictOtherUsersAvatars(currentUserId: string) {
  if (typeof window === 'undefined') return
  const currentKey = storageKey(currentUserId)
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i)
    if (!key || !key.startsWith(STORAGE_PREFIX) || key === currentKey) continue
    try {
      const raw = localStorage.getItem(key)
      if (!raw) continue
      const parsed = JSON.parse(raw) as LocalProfileData
      if (parsed.avatarDataUrl) {
        delete parsed.avatarDataUrl
        localStorage.setItem(key, JSON.stringify(parsed))
      }
    } catch {
      // ignore individual entries
    }
  }
}

function writeRaw(userId: string, data: LocalProfileData) {
  if (typeof window === 'undefined' || !userId) return
  const key = storageKey(userId)
  const serialized = JSON.stringify(data)

  try {
    localStorage.setItem(key, serialized)
    return
  } catch (error) {
    if (!isQuotaError(error)) {
      console.warn('[profile] Failed to persist local profile data:', error)
      return
    }
  }

  // Quota exceeded — reclaim space from other users' avatars, then retry.
  try {
    evictOtherUsersAvatars(userId)
    localStorage.setItem(key, serialized)
    return
  } catch {
    // still failing — fall through
  }

  // Last resort: persist everything EXCEPT the heavy avatar so emergency
  // contacts / settings are never lost to a storage limit.
  try {
    const withoutAvatar = { ...data }
    delete withoutAvatar.avatarDataUrl
    localStorage.setItem(key, JSON.stringify(withoutAvatar))
    console.warn('[profile] Stored profile without avatar due to storage limits')
  } catch (error) {
    console.warn('[profile] Unable to persist local profile data:', error)
  }
}

export function getLocalProfileData(userId: string): LocalProfileData {
  return readRaw(userId)
}

export function saveLocalAvatar(userId: string, avatarDataUrl: string) {
  const current = readRaw(userId)
  writeRaw(userId, { ...current, avatarDataUrl })
}

/**
 * Save all personal data locally for use as offline cache or when switching users.
 * Called automatically after profile save.
 */
/**
 * Save LOCAL-ONLY data (not from Backend).
 * Do NOT use this for API data like fullName, nationalId, etc.
 */
export function saveLocalProfileData(
  userId: string,
  data: Partial<LocalProfileData>,
) {
  const current = readRaw(userId)
  writeRaw(userId, { ...current, ...data })
}

export function saveLocalOverrides(
  userId: string,
  overrides: UpdateUserProfileBody,
) {
  const current = readRaw(userId)
  writeRaw(userId, {
    ...current,
    overrides: { ...current.overrides, ...overrides },
  })
}

export function saveEmergencySettings(
  userId: string,
  data: { contacts: EmergencyContact[]; sosMessage: string },
) {
  const current = readRaw(userId)
  writeRaw(userId, {
    ...current,
    emergencyContacts: data.contacts,
    sosMessage: data.sosMessage,
  })
}

export function getDisplayAvatar(
  userId: string | undefined,
  apiAvatar?: string | null,
): string | undefined {
  if (!userId) return apiAvatar ?? undefined
  const local = readRaw(userId).avatarDataUrl
  return local ?? apiAvatar ?? undefined
}

/**
 * Merge profile with LOCAL-ONLY data.
 * ✅ Local avatar (user's local edits) overrides API avatar
 * ✅ Local assistance data (not supported by backend) is restored from localStorage
 * ❌ API data (fullName, nationalId, etc.) always comes from Backend only
 */
export function mergeProfileAvatarOnly(profile: UserProfile): UserProfile {
  const local = readRaw(profile.id)
  return {
    ...profile,
    ...(local.overrides ?? {}),
    avatarUrl: local.avatarDataUrl ?? profile.avatarUrl ?? null,
    assistancePreferences: local.assistancePreferences ?? profile.assistancePreferences ?? null,
    assistanceLocation: local.assistanceLocation ?? profile.assistanceLocation ?? null,
    assistanceRadius: local.assistanceRadius ?? profile.assistanceRadius ?? null,
    emergencyContacts: local.emergencyContacts ?? profile.emergencyContacts ?? null,
    sosMessage: local.sosMessage ?? profile.sosMessage ?? null,
    bloodType: local.bloodType ?? profile.bloodType ?? null,
  } as any
}

export function clearLocalOverrides(userId: string, keys: (keyof UpdateUserProfileBody)[]) {
  const current = readRaw(userId)
  if (!current.overrides) return
  const next = { ...current.overrides }
  for (const key of keys) {
    delete next[key]
  }
  writeRaw(userId, { ...current, overrides: next })
}

/** @deprecated Use mergeProfileAvatarOnly — kept for emergency contacts UI. */
export function mergeProfileWithLocal(profile: UserProfile): UserProfile {
  return mergeProfileAvatarOnly(profile)
}

/**
 * Clear profile data for a specific user (used when switching to another user).
 * Does NOT clear current user's data.
 */
export function clearUserProfileData(userId: string) {
  if (typeof window === 'undefined' || !userId) return
  localStorage.removeItem(storageKey(userId))
}

/**
 * Get all stored user IDs (for clearing old user data on logout).
 */
export function getAllStoredUserIds(): string[] {
  if (typeof window === 'undefined') return []
  const ids: string[] = []
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i)
    if (key?.startsWith(STORAGE_PREFIX)) {
      const userId = key.slice(STORAGE_PREFIX.length)
      if (userId) ids.push(userId)
    }
  }
  return ids
}

export function clearAllLocalProfileData() {
  if (typeof window === 'undefined') return
  const keysToRemove: string[] = []
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i)
    if (key?.startsWith(STORAGE_PREFIX)) keysToRemove.push(key)
  }
  keysToRemove.forEach((key) => localStorage.removeItem(key))
}

export async function readAvatarFile(file: File): Promise<string> {
  if (!file.type.startsWith('image/')) {
    throw new Error('يرجى اختيار ملف صورة')
  }
  if (file.size > MAX_AVATAR_BYTES) {
    throw new Error('حجم الصورة كبير جداً (الحد الأقصى 5MB)')
  }

  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => {
      if (typeof reader.result === 'string') resolve(reader.result)
      else reject(new Error('تعذّر قراءة الصورة'))
    }
    reader.onerror = () => reject(new Error('تعذّر قراءة الصورة'))
    reader.readAsDataURL(file)
  })
}
