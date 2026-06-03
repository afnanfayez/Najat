'use client'

import Image from 'next/image'
import { LogOut } from 'lucide-react'
import { adminNavItems } from './adminNavItems'
import type { AuthUser } from '@/context/AuthContext'

export interface AdminSidebarContentProps {
  activeNav: string
  onNavChange: (id: string) => void
  hoveredNav: string | null
  onHoverNav: (id: string | null) => void
  handleLogout: () => void
  user?: AuthUser | null
}

export default function AdminSidebarContent({
  activeNav,
  onNavChange,
  hoveredNav,
  onHoverNav,
  handleLogout,
  user,
}: AdminSidebarContentProps) {
  return (
    <div
      style={{
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '0 30px',
        boxSizing: 'border-box',
      }}
    >
      <div style={{ marginBottom: '32px', display: 'flex', justifyContent: 'center' }}>
        <Image
          src="/assets/Logo2.png"
          alt="شعار نجاة"
          width={100}
          height={100}
          style={{ objectFit: 'contain', width: 'auto', height: 'auto', maxWidth: 100, maxHeight: 100 }}
          priority
        />
      </div>

      <nav
        style={{
          width: '100%',
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '16px',
        }}
      >
        {adminNavItems.map((item) => {
          const isActive = activeNav === item.id
          const isHovered = hoveredNav === item.id
          const Icon = item.icon

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onNavChange(item.id)}
              onMouseEnter={() => onHoverNav(item.id)}
              onMouseLeave={() => onHoverNav(null)}
              style={{
                width: '260px',
                maxWidth: '100%',
                height: '51px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'flex-start',
                gap: '12px',
                paddingTop: '2px',
                paddingRight: '12px',
                paddingBottom: '2px',
                paddingLeft: '8px',
                background: isActive
                  ? '#FFFFFF80'
                  : isHovered
                    ? 'rgba(255,255,255,0.15)'
                    : 'transparent',
                border: 'none',
                borderRadius: '10px',
                cursor: 'pointer',
                color: '#fff',
                fontFamily: "'Cairo', sans-serif",
                fontSize: '20px',
                fontWeight: isActive ? '600' : '500',
                lineHeight: '100%',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                outline: 'none',
                textAlign: 'right',
                opacity: isActive || isHovered ? 1 : 0.85,
                boxSizing: 'border-box',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '32px',
                  flexShrink: 0,
                }}
              >
                <Icon size={24} strokeWidth={2} />
              </div>
              <span style={{ flex: 1 }}>{item.label}</span>
            </button>
          )
        })}
      </nav>

      <div
        style={{
          width: '260px',
          maxWidth: '100%',
          height: '51px',
          background: 'rgba(255,255,255,0.12)',
          borderRadius: '10px',
          paddingTop: '2px',
          paddingRight: '12px',
          paddingBottom: '2px',
          paddingLeft: '8px',
          marginTop: '24px',
          marginBottom: '12px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-start',
          gap: '12px',
          boxSizing: 'border-box',
        }}
      >
        <div
          style={{
            position: 'relative',
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            overflow: 'hidden',
            flexShrink: 0,
            border: '2px solid rgba(255,255,255,0.3)',
          }}
        >
          <Image
            src="/assets/profile_avatar.png"
            alt={user?.fullName ?? 'مدير النظام'}
            fill
            sizes="32px"
            style={{ objectFit: 'cover' }}
          />
        </div>
        <div style={{ minWidth: 0, flex: 1, textAlign: 'right' }}>
          <p
            style={{
              margin: 0,
              color: '#fff',
              fontSize: '14px',
              fontWeight: 700,
              fontFamily: "'Cairo', sans-serif",
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              lineHeight: '1.2',
            }}
          >
            {user?.fullName ?? 'مدير النظام'}
          </p>
          <p
            style={{
              margin: '2px 0 0',
              color: 'rgba(255,255,255,0.85)',
              fontSize: '12px',
              fontFamily: "'Cairo', sans-serif",
              fontWeight: 500,
              lineHeight: '1.2',
            }}
          >
            مدير النظام
          </p>
        </div>
      </div>

      <div
        style={{
          paddingBottom: '20px',
          width: '100%',
          display: 'flex',
          justifyContent: 'center',
        }}
      >
        <button
          type="button"
          onClick={handleLogout}
          style={{
            width: '260px',
            maxWidth: '100%',
            marginTop: '4px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            background: 'rgba(244,67,54,0.15)',
            border: '1px solid rgba(244,67,54,0.35)',
            borderRadius: '10px',
            color: '#ff8a80',
            padding: '8px 20px',
            cursor: 'pointer',
            fontSize: '0.9rem',
            fontWeight: '600',
            fontFamily: "'Cairo', sans-serif",
            transition: 'background 0.2s',
            boxSizing: 'border-box',
          }}
          onMouseEnter={(e) =>
            ((e.currentTarget as HTMLButtonElement).style.background =
              'rgba(244,67,54,0.28)')
          }
          onMouseLeave={(e) =>
            ((e.currentTarget as HTMLButtonElement).style.background =
              'rgba(244,67,54,0.15)')
          }
        >
          <LogOut size={16} />
          تسجيل الخروج
        </button>
      </div>
    </div>
  )
}
