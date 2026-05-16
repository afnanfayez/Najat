'use client'

import { useState, useCallback, useMemo } from 'react'
import { useRouter, usePathname, useSearchParams } from 'next/navigation'
import { removeToken } from '@/lib/api/auth'
import { useLoginStore } from '@/store/useLoginStore'
import { useRegisterStore } from '@/store/useRegisterStore'
import { isHealthFacilityPath } from '@/lib/health/healthFacilityRoutes'
import DashboardSidebar from './sidebar/DashboardSidebar'
import { DashboardShellContext } from './DashboardShellContext'

function activeNavFromRoute(pathname: string, tab: string | null): string {
  if (isHealthFacilityPath(pathname)) return 'health'
  if (pathname.startsWith('/humanitarian-aid')) return 'humanaid'
  if (pathname.startsWith('/health-guide')) return 'guide'
  if (pathname === '/dashboard') {
    if (tab === 'maps' || tab === 'profile' || tab === 'emergency') return tab
    return 'home'
  }
  return 'home'
}

export default function DashboardLayoutClient({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const tab = searchParams.get('tab')
  const activeNav = useMemo(
    () => activeNavFromRoute(pathname, tab),
    [pathname, tab],
  )

  const [hoveredNav, setHoveredNav] = useState<string | null>(null)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const { resetLogin } = useLoginStore()
  const { resetRegister } = useRegisterStore()

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
      router.replace(`/dashboard?tab=${encodeURIComponent(id)}`, {
        scroll: false,
      })
    },
    [router],
  )

  const handleLogout = useCallback(() => {
    removeToken()
    resetLogin()
    resetRegister()
    router.push('/login')
  }, [router, resetLogin, resetRegister])

  const shellValue = useMemo(
    () => ({ setIsMobileMenuOpen }),
    [setIsMobileMenuOpen],
  )

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

            @media (max-width: 1024px) {
              .desktop-sidebar { display: none !important; }
              .main-container  { width: 100% !important; padding-right: 0 !important; }
              .services-grid   { grid-template-columns: repeat(2, 1fr) !important; padding: 10px !important; padding-bottom: 60px !important; }
              .content-body    { padding: 15px !important; overflow-y: auto !important; }
            }

            @media (max-width: 768px) {
              .services-grid    { grid-template-columns: 1fr !important; gap: 12px !important; padding-bottom: 20px !important; }
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
              right: ${isMobileMenuOpen ? '0' : '-320px'};
              width: 320px;
              height: 100vh;
              background: #2196F3;
              z-index: 1100;
              transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
              box-shadow: -10px 0 30px rgba(0,0,0,0.15);
              overflow-y: auto;
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

        <DashboardSidebar
          activeNav={activeNav}
          setActiveNav={setNav}
          hoveredNav={hoveredNav}
          setHoveredNav={setHoveredNav}
          handleLogout={handleLogout}
          isMobileMenuOpen={isMobileMenuOpen}
          setIsMobileMenuOpen={setIsMobileMenuOpen}
        />

        <main
          className="main-container"
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            minWidth: 0,
            overflow: 'hidden',
            boxSizing: 'border-box',
            position: 'relative',
          }}
        >
          {children}
        </main>
      </div>
    </DashboardShellContext.Provider>
  )
}
