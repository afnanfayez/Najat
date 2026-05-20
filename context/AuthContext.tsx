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
  logout: () => void
}

const AuthContext = createContext<AuthContextValue>({
  user: null,
  role: null,
  isLoading: true,
  logout: () => {},
})

export function AuthProvider({ children }: { children: ReactNode }) {
  const router = useRouter()
  const [user, setUser] = useState<AuthUser | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const logout = useCallback(() => {
    removeToken()
    removeUserRole()
    setUser(null)
    router.replace('/logout')
  }, [router])

  useEffect(() => {
    const token = getToken()
    if (!token) {
      setIsLoading(false)
      return
    }

    authAPI
      .me()
      .then((res: any) => {
        const raw = res?.data ?? res
        if (raw?.id) {
          setUser({
            id: raw.id,
            email: raw.email ?? '',
            fullName: raw.fullName ?? raw.name ?? '',
            role: (raw.role as UserRole) ?? (getUserRole() as UserRole) ?? 'resident',
            nationalId: raw.nationalId,
            region: raw.region,
            phoneNumber: raw.phoneNumber,
            gender: raw.gender,
          })
        } else {
          logout()
        }
      })
      .catch(() => {
        logout()
      })
      .finally(() => {
        setIsLoading(false)
      })
  }, [logout])

  const role = user?.role ?? null

  return (
    <AuthContext.Provider value={{ user, role, isLoading, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth(): AuthContextValue {
  return useContext(AuthContext)
}
