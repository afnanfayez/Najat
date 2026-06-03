import { removeToken } from '@/lib/api/auth'
import { removeUserRole } from '@/lib/auth/sessionRole'
import { LOGIN_REDIRECT_KEY } from '@/lib/auth/currentAuthRole'

const PROFILE_PREFIX = 'najat_profile_local_'
const ASSISTANCE_PREFIX = 'assistance_preferences'

/** Wipe cached session data so a new login does not inherit the previous account. */
export function resetBrowserSession(options?: { keepLoginEmail?: boolean }) {
  if (typeof window === 'undefined') return

  removeToken()
  removeUserRole()
  sessionStorage.removeItem(LOGIN_REDIRECT_KEY)

  const keysToRemove: string[] = []
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i)
    if (!key) continue
    if (key.startsWith(PROFILE_PREFIX) || key.startsWith(ASSISTANCE_PREFIX)) {
      keysToRemove.push(key)
    }
  }
  keysToRemove.forEach((key) => localStorage.removeItem(key))

  if (!options?.keepLoginEmail) {
    localStorage.removeItem('saved-articles')
  }
}
