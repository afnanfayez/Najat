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
}

const STORAGE_PREFIX = 'najat_profile_local_'
const MAX_AVATAR_BYTES = 800_000

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

function writeRaw(userId: string, data: LocalProfileData) {
  if (typeof window === 'undefined' || !userId) return
  localStorage.setItem(storageKey(userId), JSON.stringify(data))
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
    // ✅ Local image takes precedence (pending upload)
    avatarUrl: local.avatarDataUrl ?? profile.avatarUrl ?? null,
    // ✅ Local assistance settings
    assistancePreferences: local.assistancePreferences ?? profile.assistancePreferences ?? null,
    assistanceLocation: local.assistanceLocation ?? profile.assistanceLocation ?? null,
    assistanceRadius: local.assistanceRadius ?? profile.assistanceRadius ?? null,
  }
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
    throw new Error('حجم الصورة كبير جداً (الحد الأقصى 800KB)')
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
