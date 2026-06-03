'use client'

import { useEffect, useState, useMemo, type ReactNode } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'
import AdminSidebar from './sidebar/AdminSidebar'
import { AdminShellContext } from './AdminShellContext'
import { ADMIN_PAGE_PADDING } from './layout/adminLayoutStyles'

interface AdminShellProps {
  activeNav?: string
  children: ReactNode
}

export default function AdminShell({ activeNav = 'dashboard', children }: AdminShellProps) {
  const router = useRouter()
  const { user, role, isLoading, isHydrated, logout } = useAuth()
  const [nav, setNav] = useState(activeNav)
  const [hoveredNav, setHoveredNav] = useState<string | null>(null)
  const [isMobileOpen, setIsMobileOpen] = useState(false)

  const adminAllowed = role === 'admin'

  useEffect(() => {
    setNav(activeNav)
  }, [activeNav])

  useEffect(() => {
    if (!isHydrated || isLoading) return
    if (!adminAllowed) {
      router.replace('/dashboard')
    }
  }, [isHydrated, isLoading, adminAllowed, router])

  const shellValue = useMemo(
    () => ({ openMobileMenu: () => setIsMobileOpen(true) }),
    [],
  )

  const handleNavChange = (id: string) => {
    setNav(id)
    setIsMobileOpen(false)

    const routes: Record<string, string> = {
      dashboard: '/admin',
      users: '/admin/users',
      health: '/admin/health',
      aid: '/admin/aid',
      maps: '/admin/maps',
      alerts: '/admin/alerts',
    }

    const path = routes[id]
    if (path) {
      router.push(path)
    }
  }

  if (!isHydrated || isLoading) {
    return (
      <div
        dir="rtl"
        className="flex flex-1 min-h-0 w-full items-center justify-center overflow-x-hidden bg-[#F5F7FA]"
        style={{ fontFamily: "'Cairo', sans-serif" }}
      >
        <p className="text-sm font-medium text-[#64748B]">جاري التحميل...</p>
      </div>
    )
  }

  if (!adminAllowed) {
    return (
      <div
        dir="rtl"
        className="flex flex-1 min-h-0 w-full items-center justify-center overflow-x-hidden bg-[#F5F7FA]"
        style={{ fontFamily: "'Cairo', sans-serif" }}
      >
        <p className="text-sm font-medium text-[#64748B]">
          لا تملك صلاحية الوصول — جاري التحويل...
        </p>
      </div>
    )
  }

  return (
    <AdminShellContext.Provider value={shellValue}>
      <div
        dir="rtl"
        className="admin-dashboard-root flex flex-1 min-h-0 h-full w-full max-w-full overflow-hidden bg-[#F5F7FA]"
        style={{ fontFamily: "'Cairo', sans-serif" }}
      >
        <style
          dangerouslySetInnerHTML={{
            __html: `
            .admin-dashboard-root { overflow-x: hidden !important; }
            .admin-dashboard-main { overflow-x: hidden !important; }
            .admin-shell-overlay {
              position: fixed;
              top: 0; left: 0; right: 0; bottom: 0;
              background: rgba(26, 45, 74, 0.6);
              backdrop-filter: blur(4px);
              z-index: 1050;
              opacity: ${isMobileOpen ? '1' : '0'};
              pointer-events: ${isMobileOpen ? 'auto' : 'none'};
              transition: opacity 0.3s ease;
            }
            .admin-mobile-sidebar {
              position: fixed;
              top: 0;
              width: 320px;
              height: 100vh;
              background: #2196F3;
              z-index: 1100;
              transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
              box-shadow: -10px 0 30px rgba(0,0,0,0.15);
              overflow-y: auto;
            }
            .admin-desktop-sidebar::-webkit-scrollbar { width: 6px; }
            .admin-desktop-sidebar::-webkit-scrollbar-track { background: rgba(255,255,255,0.1); }
            .admin-desktop-sidebar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.35); border-radius: 10px; }
            .admin-mobile-sidebar::-webkit-scrollbar { width: 6px; }
            .admin-mobile-sidebar::-webkit-scrollbar-track { background: rgba(255,255,255,0.1); }
            .admin-mobile-sidebar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.35); border-radius: 10px; }
            .no-scrollbar::-webkit-scrollbar { display: none; }
            .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }

            @media (min-width: 1025px) {
              .admin-mobile-sidebar { display: none !important; }
            }

            @media (max-width: 1024px) {
              .admin-desktop-sidebar { display: none !important; }
            }

            @media (max-width: 768px) {
              .admin-dashboard-main { padding: 15px !important; }
              .admin-tab { padding: 6px 12px 10px !important; font-size: 12px !important; }
            }
          `,
          }}
        />

        <AdminSidebar
          activeNav={nav}
          onNavChange={handleNavChange}
          hoveredNav={hoveredNav}
          onHoverNav={setHoveredNav}
          handleLogout={logout}
          user={user}
          isMobileOpen={isMobileOpen}
          onMobileClose={() => setIsMobileOpen(false)}
        />

        <main
          className="admin-dashboard-main custom-scrollbar min-h-0 flex-1 overflow-y-auto overflow-x-hidden"
          style={{ padding: ADMIN_PAGE_PADDING, boxSizing: 'border-box' }}
        >
          {children}
        </main>
      </div>
    </AdminShellContext.Provider>
  )
}
