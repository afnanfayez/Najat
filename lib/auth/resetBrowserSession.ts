import { removeUserRole } from '@/lib/auth/sessionRole'
import { LOGIN_REDIRECT_KEY } from '@/lib/auth/currentAuthRole'
import { getCurrentUserId, saveCurrentUserId } from '@/lib/auth/tokenIdentity'
import { getAllStoredUserIds, clearUserProfileData } from '@/lib/profile/localProfileStorage'

/**
 * Wipe cached app-local session data so a new login does not inherit the
 * previous account. Does NOT touch the real Supabase session — call
 * `supabase.auth.signOut()` separately (AuthContext does this before calling
 * this function). Only clears data from OTHER users, preserving locally
 * cached profile data (e.g. avatar) for the current user if they log back in.
 */
export function resetBrowserSession(options?: { keepLoginEmail?: boolean }) {
  if (typeof window === 'undefined') return

  const currentUserId = getCurrentUserId()

  saveCurrentUserId(null)
  removeUserRole()
  sessionStorage.removeItem(LOGIN_REDIRECT_KEY)

  const allStoredIds = getAllStoredUserIds()
  for (const userId of allStoredIds) {
    if (currentUserId && userId === currentUserId) {
      // Keep current user's data (avatar, phone, etc.)
      continue
    }
    clearUserProfileData(userId)
  }

  if (!options?.keepLoginEmail) {
    localStorage.removeItem('saved-articles')
  }
}
