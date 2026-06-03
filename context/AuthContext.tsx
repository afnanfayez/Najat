'use client'

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  type ReactNode,
} from 'react'
import { useRouter } from 'next/navigation'
import { getToken, removeToken } from '@/lib/api/auth'
import { removeUserRole, getUserRole } from '@/lib/auth/sessionRole'
import { profileAPI } from '@/lib/api/profile'
import type { UserRole } from '@/lib/auth/roleUtils'

export type AuthUser = Awaited<ReturnType<typeof profileAPI.me>>

type AuthContextValue = {
  user: AuthUser | null
  role: UserRole | null
  isLoading: boolean
  isHydrated: boolean
  logout: () => void
  refreshUser: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue>({
  user: null,
  role: null,
  isLoading: true,
  isHydrated: false,
  logout: () => {},
  refreshUser: async () => {},
})

export function AuthProvider({ children }: { children: ReactNode }) {
  const router = useRouter()
  const [user, setUser] = useState<AuthUser | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isHydrated, setIsHydrated] = useState(false)

  const logout = useCallback(() => {
    removeToken()
    removeUserRole()
    setUser(null)
    router.replace('/logout')
  }, [router])

  const refreshUser = useCallback(async () => {
    const token = getToken()
    if (!token) {
      setUser(null)
      return
    }

    try {
      const profile = await profileAPI.me()
      setUser(profile)
    } catch (err: unknown) {
      const status =
        err && typeof err === 'object' && 'status' in err
          ? (err as { status?: number }).status
          : undefined
      if (status === 401) {
        logout()
      }
    }
  }, [logout])

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

    refreshUser()
      .catch(() => {
        /* refreshUser handles 401 */
      })
      .finally(() => {
        setIsLoading(false)
      })
  }, [isHydrated, refreshUser])

  const role = user?.role ?? null
  const visibleUser = isHydrated ? user : null
  const visibleRole = isHydrated ? role : null

  return (
    <AuthContext.Provider
      value={{
        user: visibleUser,
        role: visibleRole,
        isLoading: !isHydrated || isLoading,
        isHydrated,
        logout,
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
