'use client'

import { X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import AdminSidebarContent, { type AdminSidebarContentProps } from './AdminSidebarContent'

interface AdminSidebarProps extends AdminSidebarContentProps {
  isMobileOpen: boolean
  onMobileClose: () => void
}

export default function AdminSidebar({
  isMobileOpen,
  onMobileClose,
  ...contentProps
}: AdminSidebarProps) {
  return (
    <>
      <div className="overlay" onClick={onMobileClose} aria-hidden={!isMobileOpen} />

      <div
        className="mobile-sidebar admin-mobile-sidebar"
        style={{
          right: isMobileOpen ? '0' : '-320px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          boxSizing: 'border-box',
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
            onClick={onMobileClose}
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
        <AdminSidebarContent {...contentProps} />
      </div>

      <aside
        className="desktop-sidebar admin-desktop-sidebar"
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
          zIndex: 10,
          boxSizing: 'border-box',
          overflowY: 'auto',
          overflowX: 'hidden',
        }}
      >
        <AdminSidebarContent {...contentProps} />
      </aside>
    </>
  )
}
