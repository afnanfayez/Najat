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
      {/* Mobile overlay */}
      <div className="overlay" onClick={() => setIsMobileMenuOpen(false)} />

      {/* Mobile sidebar drawer */}
      <div
        className="mobile-sidebar"
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          boxSizing: 'border-box',
          overflowY: 'auto',
          overflowX: 'hidden',
        }}
      >
        <div
          style={{
            padding: '25px 25px 10px',
            display: 'flex',
            justifyContent: 'flex-start',
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
          >
            <X size={24} />
          </Button>
        </div>
        <SidebarContent {...sidebarContentProps} user={user} role={role} />
      </div>

      {/* Desktop sidebar */}
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
          padding: '30px 0 20px',
          position: 'relative',
          top: '-0.58px',
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
