'use client'

import { X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import SidebarContent, { type SidebarContentProps } from './SidebarContent'
import type { AuthUser } from '@/context/AuthContext'
import type { UserRole } from '@/lib/auth/roleUtils'

interface DashboardSidebarProps extends SidebarContentProps {
  isMobileMenuOpen: boolean
  setIsMobileMenuOpen: (open: boolean) => void
  user?: AuthUser | null
  role?: UserRole | null
}

export default function DashboardSidebar({
  isMobileMenuOpen,
  setIsMobileMenuOpen,
  user,
  role,
  ...sidebarContentProps
}: DashboardSidebarProps) {
  return (
    <>
      <div className="overlay" onClick={() => setIsMobileMenuOpen(false)} aria-hidden={!isMobileMenuOpen} />

      <div
        className="mobile-sidebar"
        style={{
          right: isMobileMenuOpen ? '0' : '-320px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          boxSizing: 'border-box',
        }}
      >
        <div
          style={{
            width: '100%',
            padding: '25px 25px 10px',
            display: 'flex',
            justifyContent: 'flex-start',
            direction: 'rtl',
            boxSizing: 'border-box',
            flexShrink: 0,
          }}
        >
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsMobileMenuOpen(false)}
            style={{
              background: 'rgba(255,255,255,0.2)',
              color: '#fff',
              borderRadius: '50%',
            }}
            aria-label="إغلاق القائمة"
          >
            <X size={24} />
          </Button>
        </div>
        <SidebarContent {...sidebarContentProps} user={user} role={role} />
      </div>

      <aside
        className="desktop-sidebar"
        style={{
          width: '320px',
          minWidth: '320px',
          height: '100vh',
          background: '#2196F3',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          padding: '30px 0 16px',
          position: 'relative',
          zIndex: 10,
          boxSizing: 'border-box',
          overflowY: 'auto',
          overflowX: 'hidden',
        }}
      >
        <SidebarContent {...sidebarContentProps} user={user} role={role} />
      </aside>
    </>
  )
}
