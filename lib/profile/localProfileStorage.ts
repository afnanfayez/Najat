import type { UpdateUserProfileBody, UserProfile } from '@/schemas/userProfile'

export type EmergencyContact = {
  id: string
  name: string
  phone: string
}

export type LocalProfileData = {
  avatarDataUrl?: string
  overrides?: UpdateUserProfileBody
  emergencyContacts?: EmergencyContact[]
  sosMessage?: string
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

export function mergeProfileWithLocal(profile: UserProfile): UserProfile {
  const local = readRaw(profile.id)
  const overrides = local.overrides ?? {}

  return {
    ...profile,
    fullName: overrides.fullName ?? profile.fullName,
    nationalId: overrides.nationalId ?? profile.nationalId,
    phoneNumber: overrides.phoneNumber ?? profile.phoneNumber,
    region: overrides.region ?? profile.region,
    avatarUrl: local.avatarDataUrl ?? profile.avatarUrl ?? null,
  }
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
