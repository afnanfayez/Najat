'use client'

import { useEffect, useState, useMemo, type ReactNode } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'
import { isAdmin } from '@/lib/auth/roleUtils'
import AdminSidebar from './sidebar/AdminSidebar'
import { AdminShellContext } from './AdminShellContext'
import { ADMIN_PAGE_PADDING } from './layout/adminLayoutStyles'

interface AdminShellProps {
  activeNav?: string
  children: ReactNode
}

export default function AdminShell({ activeNav = 'dashboard', children }: AdminShellProps) {
  const router = useRouter()
  const { user, role, isLoading, logout } = useAuth()
  const [nav, setNav] = useState(activeNav)
  const [hoveredNav, setHoveredNav] = useState<string | null>(null)
  const [isMobileOpen, setIsMobileOpen] = useState(false)

  useEffect(() => {
    setNav(activeNav)
  }, [activeNav])

  useEffect(() => {
    if (!isLoading && role && !isAdmin(role)) {
      router.replace('/dashboard')
    }
  }, [isLoading, role, router])

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
    }

    const path = routes[id]
    if (path) {
      router.push(path)
    }
  }

  if (isLoading) {
    return (
      <div
        dir="rtl"
        className="flex h-full w-full items-center justify-center overflow-x-hidden bg-[#F5F7FA]"
        style={{ fontFamily: "'Cairo', sans-serif" }}
      >
        <p className="text-sm font-medium text-[#64748B]">جاري التحميل...</p>
      </div>
    )
  }

  if (!isAdmin(role)) {
    return null
  }

  return (
    <AdminShellContext.Provider value={shellValue}>
      <div
        dir="rtl"
        className="admin-dashboard-root flex h-full min-h-0 w-full max-w-full overflow-hidden bg-[#F5F7FA]"
        style={{ fontFamily: "'Cairo', sans-serif" }}
      >
        <style
          dangerouslySetInnerHTML={{
            __html: `
            .admin-dashboard-root { overflow-x: hidden !important; }
            .admin-dashboard-main { overflow-x: hidden !important; }
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
