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
import { authAPI } from '@/lib/api/api'
import type { UserRole } from '@/lib/auth/roleUtils'

export type AuthUser = {
  id: string
  email: string
  fullName: string
  role: UserRole
  nationalId?: string
  region?: string
  phoneNumber?: string
  gender?: string
}

type AuthContextValue = {
  user: AuthUser | null
  role: UserRole | null
  isLoading: boolean
  /** False until the client has mounted — avoids SSR/client auth text mismatches. */
  isHydrated: boolean
  logout: () => void
}

const AuthContext = createContext<AuthContextValue>({
  user: null,
  role: null,
  isLoading: true,
  isHydrated: false,
  logout: () => {},
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

    authAPI
      .me()
      .then((res: any) => {
        // Handle multiple response shapes: flat, { data: {...} }, { user: {...} }, { data: { user: {...} } }
        const raw = res?.data?.user ?? res?.data ?? res?.user ?? res
        if (raw?.id) {
          setUser({
            id: raw.id,
            email: raw.email ?? '',
            fullName: raw.fullName ?? raw.full_name ?? raw.name ?? '',
            role: (raw.role as UserRole) ?? (getUserRole() as UserRole) ?? 'resident',
            nationalId: raw.nationalId ?? raw.national_id,
            region: raw.region,
            phoneNumber: raw.phoneNumber ?? raw.phone_number,
            gender: raw.gender,
          })
        } else {
          // Response came back but no user id — token is likely invalid
          logout()
        }
      })
      .catch((err: any) => {
        // Only force logout on 401 (token rejected by server).
        // Network errors or 5xx keep the token so the user can retry.
        if (err?.status === 401) {
          logout()
        }
      })
      .finally(() => {
        setIsLoading(false)
      })
  }, [isHydrated, logout])

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
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth(): AuthContextValue {
  return useContext(AuthContext)
}
