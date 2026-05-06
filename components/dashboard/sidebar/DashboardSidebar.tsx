'use client'

import { X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import SidebarContent, { type SidebarContentProps } from './SidebarContent'

interface DashboardSidebarProps extends SidebarContentProps {
  isMobileMenuOpen: boolean
  setIsMobileMenuOpen: (open: boolean) => void
}

export default function DashboardSidebar({
  isMobileMenuOpen,
  setIsMobileMenuOpen,
  ...sidebarContentProps
}: DashboardSidebarProps) {
  return (
    <>
      {/* Mobile overlay */}
      <div className="overlay" onClick={() => setIsMobileMenuOpen(false)} />

      {/* Mobile sidebar drawer */}
      <div className="mobile-sidebar">
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
        <SidebarContent {...sidebarContentProps} />
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
        }}
      >
        <SidebarContent {...sidebarContentProps} />
      </aside>
    </>
  )
}
