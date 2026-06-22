'use client'

import { useState, useCallback, useMemo, useEffect } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { useRouter, usePathname } from 'next/navigation'
import { getToken } from '@/lib/api/auth'
import { useAuth } from '@/context/AuthContext'
import { isHealthFacilityPath } from '@/lib/health/healthFacilityRoutes'
import AdminMobileHeader from '@/components/admin/dashboard/AdminMobileHeader'
import DashboardSidebar from './sidebar/DashboardSidebar'
import { DashboardShellContext } from './DashboardShellContext'
import { OfflineSyncBanner } from '@/components/shared/OfflineSyncBanner'
import { initOfflineSync } from '@/lib/offline/sync'

function activeNavFromRoute(pathname: string): string {
  if (isHealthFacilityPath(pathname)) return 'health'
  if (pathname.startsWith('/humanitarian-aid')) return 'humanaid'
  if (pathname.startsWith('/health-guide')) return 'guide'
  if (pathname.startsWith('/profile')) return 'profile'
  if (pathname.startsWith('/emergency')) return 'emergency'
  if (pathname.startsWith('/maps')) return 'maps'
  if (pathname.startsWith('/admin')) return 'admin'
  if (pathname.startsWith('/volunteer')) return 'home'
  if (pathname === '/dashboard') return 'home'
  return 'home'
}

export default function DashboardLayoutClient({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const pathname = usePathname()
  const activeNav = useMemo(
    () => activeNavFromRoute(pathname),
    [pathname],
  )

  const [hoveredNav, setHoveredNav] = useState<string | null>(null)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const { user, role, isLoading, isHydrated, logout } = useAuth()
  const queryClient = useQueryClient()

  // Background sync (processSyncQueue) writes straight to the offline IndexedDB
  // cache, not to the React Query cache — without this, admins keep seeing
  // stale/optimistic rows (e.g. a synced volunteer's temp record) until they
  // navigate away and back.
  useEffect(() => {
    // invalidateQueries() already triggers a refetch for any actively-mounted
    // query on its own — a follow-up refetchQueries() call for the same key is
    // redundant and, combined with the per-page listeners this used to overlap
    // with, caused multiple in-flight requests for the same key to race each
    // other. Whichever response happened to land last won the cache, even when
    // it wasn't the freshest one — silently leaving stale data on screen.
    const handleSyncProcessed = () => {
      const keys = [
        'admin-users',
        'admin-health-facilities',
        'health-facilities',
        'admin-health-content',
        'health-guide',
        'aid',
        'safety',
        'admin-alerts',
      ]
      for (const key of keys) {
        queryClient.invalidateQueries({ queryKey: [key] }).catch(() => {})
      }
    }
    window.addEventListener('najat:sync-queue-processed', handleSyncProcessed)
    window.addEventListener('najat:session-refresh', handleSyncProcessed)
    return () => {
      window.removeEventListener('najat:sync-queue-processed', handleSyncProcessed)
      window.removeEventListener('najat:session-refresh', handleSyncProcessed)
    }
  }, [queryClient])

  // Initialize lightweight background data sync once per session. Deliberately
  // does NOT depend on isLoading — that flag flips on every refreshUser() call
  // (including the one triggered by SW background sync on reconnect), which
  // would otherwise tear down and restart initOfflineSync (and its idle-time
  // syncAllData call) on every profile refresh.
  useEffect(() => {
    if (!isHydrated) return
    if (!getToken()) return
    const cleanup = initOfflineSync()
    return cleanup
  }, [isHydrated])

  // Auth guard
  useEffect(() => {
    if (!isHydrated) return      // wait for client-side hydration
    if (isLoading) return        // wait for auth check to finish
    if (!getToken()) {
      router.replace('/login')
      return
    }
  }, [isHydrated, isLoading, pathname, router])

  const setNav = useCallback(
    (id: string) => {
      setIsMobileMenuOpen(false)
      if (id === 'home') {
        router.replace('/dashboard', { scroll: false })
        return
      }
      if (id === 'health') {
        router.push('/hospitals')
        return
      }
      if (id === 'humanaid') {
        router.push('/humanitarian-aid')
        return
      }
      if (id === 'guide') {
        router.push('/health-guide')
        return
      }
      if (id === 'profile') {
        router.push('/profile')
        return
      }
      if (id === 'emergency') {
        router.push('/emergency')
        return
      }
      if (id === 'maps') {
        router.push('/maps')
        return
      }
      if (id === 'admin') {
        router.push('/admin')
        return
      }
      router.replace(`/dashboard?tab=${encodeURIComponent(id)}`, {
        scroll: false,
      })
    },
    [router],
  )

  const handleLogout = useCallback(() => {
    logout()
  }, [logout])

  const shellValue = useMemo(
    () => ({ setIsMobileMenuOpen }),
    [setIsMobileMenuOpen],
  )

  const isAdminRoute = pathname.startsWith('/admin')

  return (
    <DashboardShellContext.Provider value={shellValue}>
      <div
        dir="rtl"
        style={{
          display: 'flex',
          height: '100vh',
          width: '100%',
          maxWidth: '100%',
          overflow: 'hidden',
          fontFamily: "'Cairo', 'Geist', 'Segoe UI', sans-serif",
          background: '#f4f7fb',
          direction: 'rtl',
          position: 'relative',
          boxSizing: 'border-box',
        }}
      >
        <style
          dangerouslySetInnerHTML={{
            __html: `
            * { box-sizing: border-box; }
            body { margin: 0; padding: 0; overflow: hidden; width: 100%; max-width: 100%; }

            .services-grid-scroll {
              flex: 1;
              min-height: 0;
              width: 100%;
              overflow-y: auto;
              overflow-x: hidden;
              -webkit-overflow-scrolling: touch;
            }

            .services-grid {
              display: grid;
              grid-template-columns: repeat(2, 1fr);
              gap: 16px;
              width: 100%;
              padding: 4px 2px 12px;
            }

            .services-grid > * {
              width: 100%;
            }

            @media (max-width: 639px) {
              .services-grid {
                grid-template-columns: 1fr;
                gap: 12px;
              }
            }

            @media (min-width: 1400px) {
              .services-grid {
                grid-template-columns: repeat(3, 1fr);
                gap: 24px;
                padding-bottom: 24px;
              }
            }

            @media (max-width: 1024px) {
              .desktop-sidebar { display: none !important; }
              .main-container  { width: 100% !important; padding-right: 0 !important; }
              .content-body    { padding: 15px !important; overflow-y: auto !important; }
            }

            @media (max-width: 768px) {
              .header-title     { font-size: 20px !important; }
              .header-desc      { font-size: 13px !important; margin-bottom: 12px !important; }
              .search-container { gap: 6px; padding: 2px 10px !important; margin-bottom: 8px !important; overflow: hidden; }
              .search-input     { font-size: 13px !important; flex: 1; min-width: 0; }
              .search-btn       { padding: 4px 10px !important; font-size: 12px !important; flex-shrink: 0; }
              .emergency-banner { height: 50px !important; margin-bottom: 16px !important; }
              .emergency-title  { font-size: 1.2rem !important; }
              .section-header   { text-align: right !important; margin-bottom: 12px !important; }
            }

            .mobile-sidebar {
              position: fixed;
              top: 0;
              width: 320px;
              height: 100vh;
              background: #2196F3;
              z-index: 1100;
              transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
              box-shadow: -10px 0 30px rgba(0,0,0,0.15);
              overflow-y: auto;
              overflow-x: hidden;
            }
            .desktop-sidebar::-webkit-scrollbar,
            .mobile-sidebar::-webkit-scrollbar { width: 6px; }
            .desktop-sidebar::-webkit-scrollbar-track,
            .mobile-sidebar::-webkit-scrollbar-track { background: rgba(255,255,255,0.1); }
            .desktop-sidebar::-webkit-scrollbar-thumb,
            .mobile-sidebar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.35); border-radius: 10px; }

            @media (min-width: 1025px) {
              .mobile-sidebar { display: none !important; }
              .overlay { display: none !important; }
            }

            .overlay {
              position: fixed;
              top: 0; left: 0; right: 0; bottom: 0;
              background: rgba(26, 45, 74, 0.6);
              backdrop-filter: blur(4px);
              z-index: 1050;
              opacity: ${isMobileMenuOpen ? '1' : '0'};
              pointer-events: ${isMobileMenuOpen ? 'auto' : 'none'};
              transition: opacity 0.3s ease;
            }

            .custom-scrollbar::-webkit-scrollbar       { width: 6px; }
            .custom-scrollbar::-webkit-scrollbar-track { background: #f1f1f1; }
            .custom-scrollbar::-webkit-scrollbar-thumb { background: #d0dcea; border-radius: 10px; }
          `,
          }}
        />

        {!isAdminRoute && (
          <DashboardSidebar
            activeNav={activeNav}
            setActiveNav={setNav}
            hoveredNav={hoveredNav}
            setHoveredNav={setHoveredNav}
            handleLogout={handleLogout}
            isMobileMenuOpen={isMobileMenuOpen}
            setIsMobileMenuOpen={setIsMobileMenuOpen}
            user={user}
            role={role}
          />
        )}

        <main
          className="main-container"
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            minWidth: 0,
            minHeight: 0,
            overflow: 'hidden',
            boxSizing: 'border-box',
            position: 'relative',
          }}
        >
          <OfflineSyncBanner />
          <div
            className="custom-scrollbar"
            style={{
              flex: 1,
              minHeight: 0,
              display: 'flex',
              flexDirection: 'column',
              width: '100%',
              overflowY: 'auto',
              overflowX: 'hidden',
            }}
          >
            {!isAdminRoute && (
              <AdminMobileHeader
                onMenuOpen={() => setIsMobileMenuOpen(true)}
                className="shrink-0 px-4 sm:px-6 lg:hidden"
              />
            )}
            {children}
          </div>
        </main>
      </div>
    </DashboardShellContext.Provider>
  )
}

