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
import { getToken, TOKEN_KEY } from '@/lib/api/auth'
import { AUTH_SESSION_CHANGED } from '@/lib/auth/authEvents'
import { saveUserRole, SESSION_ROLE_KEY } from '@/lib/auth/sessionRole'
import { profileAPI } from '@/lib/api/profile'
import { clearUserSessionCache } from '@/lib/auth/clearSessionCache'
import { getCurrentAuthRole } from '@/lib/auth/currentAuthRole'
import {
  getOfflineCachedProfile,
  updateOfflineLoginProfile,
} from '@/lib/auth/offlineLogin'
import { resetBrowserSession } from '@/lib/auth/resetBrowserSession'
import type { UserRole } from '@/lib/auth/roleUtils'

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
    resetBrowserSession()
    setUser(null)
    clearUserSessionCache(queryClient)
  }, [queryClient])

  const logout = useCallback(() => {
    router.replace('/logout')
  }, [router])

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
      const cachedProfile = getOfflineCachedProfile()
      if (cachedProfile) {
        setUser(cachedProfile)
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

      setUser(profile)
      saveUserRole(profile.role)
      updateOfflineLoginProfile(profile)
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
        const cachedProfile = getOfflineCachedProfile()
        if (cachedProfile) {
          setUser(cachedProfile)
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

    const onStorage = (event: StorageEvent) => {
      if (event.key !== TOKEN_KEY && event.key !== SESSION_ROLE_KEY) return
      setUser(null)
      clearUserSessionCache(queryClient)
      refreshUser().catch(() => {})
    }

    window.addEventListener(AUTH_SESSION_CHANGED, onSessionChanged)
    window.addEventListener('storage', onStorage)
    return () => {
      window.removeEventListener(AUTH_SESSION_CHANGED, onSessionChanged)
      window.removeEventListener('storage', onStorage)
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
