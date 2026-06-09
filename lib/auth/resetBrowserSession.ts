import { removeToken, getToken } from '@/lib/api/auth'
import { removeUserRole } from '@/lib/auth/sessionRole'
// NOTE: clearOfflineLoginSnapshot is intentionally NOT imported here.
// The offline snapshot MUST survive logout so the user can log in offline.
// Only clear it on a confirmed 401 (expired token).
import { LOGIN_REDIRECT_KEY } from '@/lib/auth/currentAuthRole'
import { getUserIdFromToken } from '@/lib/auth/tokenIdentity'
import { getAllStoredUserIds, clearUserProfileData } from '@/lib/profile/localProfileStorage'

const PROFILE_PREFIX = 'najat_profile_local_'
const ASSISTANCE_PREFIX = 'assistance_preferences'
const PREFERENCES_PREFIX = 'assistance_preferences_'

/** 
 * Wipe cached session data so a new login does not inherit the previous account.
 * ✅ NEW: Only clears data from OTHER users, not the current user
 * This preserves locally saved profile images and data for the current user
 */
export function resetBrowserSession(options?: { keepLoginEmail?: boolean }) {
  if (typeof window === 'undefined') return

  // Get current user ID before removing token
  const currentToken = getToken()
  const currentUserId = getUserIdFromToken(currentToken)

  removeToken()
  removeUserRole()
  // ✅ We deliberately do NOT clear the offline login snapshot here.
  //    The snapshot (JWT + password hash + profile) must survive logout
  //    so the user can re-authenticate while offline.
  sessionStorage.removeItem(LOGIN_REDIRECT_KEY)

  // Get all stored user IDs
  const allStoredIds = getAllStoredUserIds()

  // Clear profile data only for OTHER users (not current user)
  // This way, if user logs out and logs back in with same account,
  // their profile images and data are preserved
  for (const userId of allStoredIds) {
    if (currentUserId && userId === currentUserId) {
      // ✅ Keep current user's data (avatar, phone, etc.)
      continue
    }
    // ❌ Clear data from other users
    clearUserProfileData(userId)
  }

  if (!options?.keepLoginEmail) {
    localStorage.removeItem('saved-articles')
  }
}
