'use client'

import Image from 'next/image'
import { LogOut, User } from 'lucide-react'
import ProfileAvatar from '@/components/profile/shared/ProfileAvatar'
import { navItems, adminNavItem } from '../data/dashboardConstants'
import { roleLabel, roleBadgeStyle, isAdmin } from '@/lib/auth/roleUtils'
import type { AuthUser } from '@/context/AuthContext'
import type { UserRole } from '@/lib/auth/roleUtils'

export interface SidebarContentProps {
  activeNav: string
  setActiveNav: (id: string) => void
  hoveredNav: string | null
  setHoveredNav: (id: string | null) => void
  handleLogout: () => void
  user?: AuthUser | null
  role?: UserRole | null
}

export default function SidebarContent({
  activeNav,
  setActiveNav,
  hoveredNav,
  setHoveredNav,
  handleLogout,
  user,
  role,
}: SidebarContentProps) {
  const visibleNavItems = isAdmin(role)
    ? [...navItems, adminNavItem]
    : navItems

  const badge = roleBadgeStyle(role)

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
      <div
        style={{
          marginBottom: '24px',
          display: 'flex',
          justifyContent: 'center',
        }}
      >
        <Image
          src="/assets/Logo2.png"
          alt="شعار نجاة"
          width={100}
          height={100}
          style={{ objectFit: 'contain' }}
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
          gap: '12px',
        }}
      >
        {visibleNavItems.map((item) => {
          const isActive = activeNav === item.id
          const isHovered = hoveredNav === item.id

          return (
            <button
              key={item.id}
              type="button"
              id={`nav-${item.id}`}
              onClick={() => setActiveNav(item.id)}
              onMouseEnter={() => setHoveredNav(item.id)}
              onMouseLeave={() => setHoveredNav(null)}
              style={{
                width: '260px',
                maxWidth: '100%',
                minHeight: '48px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'flex-start',
                gap: '10px',
                padding: '6px 10px 6px 8px',
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
                fontSize: '18px',
                fontWeight: isActive ? '600' : '500',
                lineHeight: '1.25',
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
                  width: '28px',
                  flexShrink: 0,
                }}
              >
                {item.sos ? (
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M7 12H9C9.55228 12 10 11.5523 10 11C10 10.4477 9.55228 10 9 10H8C7.44772 10 7 10.4477 7 11C7 11.5523 7.44772 12 8 12H9C9.55228 12 10 12.4477 10 13C10 13.5523 9.55228 14 9 14H7" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M12 10C11.4477 10 11 10.4477 11 11V13C11 13.5523 11.4477 14 12 14C12.5523 14 13 13.5523 13 13V11C13 10.4477 12.5523 10 12 10Z" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M15 12H17C17.5523 12 18 11.5523 18 11C18 10.4477 17.5523 10 17 10H16C15.4477 10 15 10.4477 15 11C15 11.5523 15.4477 12 16 12H17C17.5523 12 18 12.4477 18 13C18 13.5523 17.5523 14 17 14H15" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                ) : typeof item.icon === 'string' ? (
                  <img src={item.icon} alt="icon" style={{ width: '24px', height: '24px' }} />
                ) : (
                  <item.icon size={24} strokeWidth={2} />
                )}
              </div>
              <span style={{ flex: 1, lineHeight: '1.3' }}>{item.label}</span>
            </button>
          )
        })}
      </nav>

      <div
        style={{
          width: '260px',
          maxWidth: '100%',
          background: 'rgba(255,255,255,0.12)',
          borderRadius: '12px',
          padding: '12px 14px',
          marginTop: '20px',
          marginBottom: '10px',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          boxSizing: 'border-box',
        }}
      >
        <div
          style={{
            width: '38px',
            height: '38px',
            borderRadius: '50%',
            background: user?.avatarUrl
              ? 'transparent'
              : 'rgba(255,255,255,0.25)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            overflow: 'hidden',
          }}
        >
          {user?.avatarUrl ? (
            <ProfileAvatar
              src={user.avatarUrl}
              alt={user.fullName ?? 'المستخدم'}
              size={38}
              borderClassName=""
            />
          ) : (
            <User size={20} color="#fff" />
          )}
        </div>
        <div style={{ minWidth: 0, flex: 1 }}>
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
            }}
          >
            {user?.fullName || '...'}
          </p>
          <span
            className={`inline-block text-xs font-bold px-2 py-0.5 rounded-full mt-1 ${badge.bg} ${badge.text}`}
          >
            {roleLabel(role)}
          </span>
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
          id="logout-btn"
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
