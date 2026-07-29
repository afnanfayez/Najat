'use client'

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  useRef,
  useMemo,
  type ReactNode,
} from 'react'
import { useRouter } from 'next/navigation'
import { useQueryClient } from '@tanstack/react-query'
import type { Session, User } from '@supabase/supabase-js'
import { createClient } from '@/lib/supabase/client'
import { saveUserRole } from '@/lib/auth/sessionRole'
import { saveCurrentUserId } from '@/lib/auth/tokenIdentity'
import { clearUserSessionCache } from '@/lib/auth/clearSessionCache'
import { getCurrentAuthRole } from '@/lib/auth/currentAuthRole'
import { getOfflineCachedProfile, cacheProfileForOffline } from '@/lib/auth/offlineLogin'
import { resetBrowserSession } from '@/lib/auth/resetBrowserSession'
import { normalizeUserRole, type UserRole } from '@/lib/auth/roleUtils'
import { mapProfileRow } from '@/lib/supabase/mapProfileRow'
import { decodeRoleClaim } from '@/lib/supabase/decodeRoleClaim'
import type { UserProfile } from '@/schemas/userProfile'

export type AuthUser = UserProfile

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
  const supabase = useMemo(() => createClient(), [])
  const [user, setUser] = useState<AuthUser | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isHydrated, setIsHydrated] = useState(false)
  const refreshSeqRef = useRef(0)

  const loadProfile = useCallback(
    async (authUser: User): Promise<UserProfile | null> => {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', authUser.id)
        .single()
      if (error || !data) return null
      return mapProfileRow(data, authUser.email ?? '')
    },
    [supabase],
  )

  /** Reconciles local state with a Supabase session (or its absence). */
  const applySession = useCallback(
    async (session: Session | null) => {
      const seq = ++refreshSeqRef.current
      setIsLoading(true)

      const offline = typeof navigator !== 'undefined' && !navigator.onLine

      if (!session) {
        if (offline) {
          const cachedProfile = await getOfflineCachedProfile()
          if (cachedProfile && seq === refreshSeqRef.current) {
            setUser(cachedProfile)
            saveUserRole(cachedProfile.role)
            setIsLoading(false)
            return
          }
        }
        if (seq !== refreshSeqRef.current) return
        setUser(null)
        saveCurrentUserId(null)
        clearUserSessionCache(queryClient)
        setIsLoading(false)
        return
      }

      saveCurrentUserId(session.user.id)

      if (offline) {
        const cachedProfile = await getOfflineCachedProfile()
        if (cachedProfile) {
          if (seq !== refreshSeqRef.current) return
          setUser(cachedProfile)
          saveUserRole(cachedProfile.role)
          setIsLoading(false)
          return
        }
      }

      try {
        const profile = await loadProfile(session.user)
        if (seq !== refreshSeqRef.current) return
        if (!profile) throw new Error('profile not found')

        // role is written into the JWT's claims by the Custom Access Token
        // Hook (supabase/migrations/0014_auth_hook.sql) — decode it from the
        // access token rather than session.user.app_metadata, which does NOT
        // reflect the hook's injected claim (see lib/supabase/decodeRoleClaim.ts).
        // Prefer it over the profiles-table read in case a role change hasn't
        // reached the row yet.
        const role = normalizeUserRole(decodeRoleClaim(session.access_token)) ?? profile.role
        const finalProfile = { ...profile, role: role as UserProfile['role'] }

        setUser(finalProfile)
        saveUserRole(finalProfile.role)
        await cacheProfileForOffline(finalProfile)
      } catch {
        if (seq !== refreshSeqRef.current) return
        const cachedProfile = await getOfflineCachedProfile()
        if (cachedProfile) {
          setUser(cachedProfile)
          saveUserRole(cachedProfile.role)
        } else {
          setUser(null)
        }
      } finally {
        if (seq === refreshSeqRef.current) setIsLoading(false)
      }
    },
    [loadProfile, queryClient],
  )

  const refreshUser = useCallback(async () => {
    const {
      data: { session },
    } = await supabase.auth.getSession()
    await applySession(session)
  }, [supabase, applySession])

  const performSessionCleanup = useCallback(() => {
    refreshSeqRef.current += 1
    void supabase.auth.signOut()
    resetBrowserSession()
    setUser(null)
    setIsLoading(false)
    clearUserSessionCache(queryClient)
  }, [queryClient, supabase])

  const logout = useCallback(() => {
    performSessionCleanup()
    router.replace('/login')
  }, [performSessionCleanup, router])

  useEffect(() => {
    setIsHydrated(true)
  }, [])

  useEffect(() => {
    if (!isHydrated) return

    // Fires immediately with the current session (event: INITIAL_SESSION),
    // then again on SIGNED_IN / SIGNED_OUT / TOKEN_REFRESHED / USER_UPDATED —
    // this single subscription replaces the old cookie-read-on-mount effect
    // and the custom BroadcastChannel('najat-auth') cross-tab sync (Supabase's
    // browser client already syncs sessions across tabs on its own).
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      void applySession(session)
    })

    // Fired by PWARegister.tsx once the offline sync queue has been
    // replayed after connectivity returns (e.g. a queued PROFILE_SYNC) —
    // re-fetch the profile so any change made while offline shows up.
    const onBackgroundSync = () => {
      refreshUser().catch(() => {})
    }
    window.addEventListener('najat:session-refresh', onBackgroundSync)

    return () => {
      subscription.unsubscribe()
      window.removeEventListener('najat:session-refresh', onBackgroundSync)
    }
  }, [isHydrated, supabase, applySession, refreshUser])

  const role: UserRole | null = isHydrated ? getCurrentAuthRole(user?.role) : null
  const visibleUser = isHydrated ? user : null

  return (
    <AuthContext.Provider
      value={{
        user: visibleUser,
        role,
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
