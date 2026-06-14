'use client'

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  useRef,
  type ReactNode,
} from 'react'
import { useRouter } from 'next/navigation'
import { useQueryClient } from '@tanstack/react-query'
import { getToken } from '@/lib/api/auth'
import { AUTH_SESSION_CHANGED } from '@/lib/auth/authEvents'
import { saveUserRole } from '@/lib/auth/sessionRole'
import { profileAPI } from '@/lib/api/profile'
import { clearUserSessionCache } from '@/lib/auth/clearSessionCache'
import { getCurrentAuthRole } from '@/lib/auth/currentAuthRole'
import {
  getOfflineCachedProfile,
  updateOfflineLoginProfile,
} from '@/lib/auth/offlineLogin'
import { resetBrowserSession } from '@/lib/auth/resetBrowserSession'
import type { UserRole } from '@/lib/auth/roleUtils'
import { mergeProfileAvatarOnly } from '@/lib/profile/localProfileStorage'

export type AuthUser = Awaited<ReturnType<typeof profileAPI.me>>

type AuthContextValue = {
  user: AuthUser | null
  role: UserRole | null
  isLoading: boolean
  isHydrated: boolean
  logout: () => void
  performSessionCleanup: () => void
  refreshUser: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue>({
  user: null,
  role: null,
  isLoading: true,
  isHydrated: false,
  logout: () => {},
  performSessionCleanup: () => {},
  refreshUser: async () => {},
})

export function AuthProvider({ children }: { children: ReactNode }) {
  const router = useRouter()
  const queryClient = useQueryClient()
  const [user, setUser] = useState<AuthUser | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isHydrated, setIsHydrated] = useState(false)
  const refreshSeqRef = useRef(0)

  const performSessionCleanup = useCallback(() => {
    refreshSeqRef.current += 1
    resetBrowserSession()
    setUser(null)
    setIsLoading(false)
    clearUserSessionCache(queryClient)
  }, [queryClient])

  const logout = useCallback(() => {
    refreshSeqRef.current += 1
    resetBrowserSession()
    setUser(null)
    setIsLoading(false)
    clearUserSessionCache(queryClient)
    router.replace('/login')
  }, [queryClient, router])

  const refreshUser = useCallback(async () => {
    const token = getToken()
    if (!token) {
      setUser(null)
      clearUserSessionCache(queryClient)
      return
    }

    const seq = ++refreshSeqRef.current
    const tokenAtStart = token

    setIsLoading(true)

    if (typeof navigator !== 'undefined' && !navigator.onLine) {
      const cachedProfile = await getOfflineCachedProfile()
      if (cachedProfile) {
        setUser(mergeProfileAvatarOnly(cachedProfile))
        saveUserRole(cachedProfile.role)
        setIsLoading(false)
        return
      }
    }

    clearUserSessionCache(queryClient)

    try {
      const profile = await profileAPI.me()

      if (seq !== refreshSeqRef.current) return
      if (getToken() !== tokenAtStart) return

      setUser(mergeProfileAvatarOnly(profile))
      saveUserRole(profile.role)
      await updateOfflineLoginProfile(profile)
    } catch (err: unknown) {
      if (seq !== refreshSeqRef.current) return
      if (getToken() !== tokenAtStart) return

      const status =
        err && typeof err === 'object' && 'status' in err
          ? (err as { status?: number }).status
          : undefined
      if (status === 401) {
        logout()
      } else {
        const cachedProfile = await getOfflineCachedProfile()
        if (cachedProfile) {
          setUser(mergeProfileAvatarOnly(cachedProfile))
          saveUserRole(cachedProfile.role)
        } else {
          setUser(null)
        }
      }
    } finally {
      if (seq === refreshSeqRef.current) {
        setIsLoading(false)
      }
    }
  }, [logout, queryClient])

  useEffect(() => {
    setIsHydrated(true)
  }, [])

  useEffect(() => {
    if (!isHydrated) return

    const token = getToken()
    if (!token) {
      setIsLoading(false)
      return
    }

    refreshUser().catch(() => {
      /* refreshUser handles 401 */
    })
  }, [isHydrated, refreshUser])

  useEffect(() => {
    const onSessionChanged = () => {
      setUser(null)
      setIsLoading(true)
      clearUserSessionCache(queryClient)
      refreshUser().catch(() => {})
    }

    // Cross-tab auth sync via BroadcastChannel (cookies don't fire storage events)
    const bc = typeof BroadcastChannel !== 'undefined' ? new BroadcastChannel('najat-auth') : null
    if (bc) {
      bc.onmessage = () => {
        setUser(null)
        clearUserSessionCache(queryClient)
        refreshUser().catch(() => {})
      }
    }

    // Background Sync: يُطلَق من PWARegister عندما يُبلّغ SW بعودة الإنترنت
    const onBackgroundSync = () => {
      const token = getToken()
      if (!token) return // لا جلسة نشطة — لا حاجة للمزامنة
      refreshUser().catch(() => {})
    }

    window.addEventListener(AUTH_SESSION_CHANGED, onSessionChanged)
    window.addEventListener('najat:session-refresh', onBackgroundSync)
    return () => {
      window.removeEventListener(AUTH_SESSION_CHANGED, onSessionChanged)
      window.removeEventListener('najat:session-refresh', onBackgroundSync)
      bc?.close()
    }
  }, [queryClient, refreshUser])

  const role: UserRole | null = isHydrated ? getCurrentAuthRole() : null
  const visibleUser = isHydrated ? user : null
  const visibleRole = role

  return (
    <AuthContext.Provider
      value={{
        user: visibleUser,
        role: visibleRole,
        isLoading: !isHydrated || isLoading,
        isHydrated,
        logout,
        performSessionCleanup,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth(): AuthContextValue {
  return useContext(AuthContext)
}
