'use client'

import { LogOut } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import { roleLabel, roleBadgeStyle } from '@/lib/auth/roleUtils'
import ProfileAvatar from '../shared/ProfileAvatar'

export default function UserSummaryCard() {
  const { user, role, logout, isLoading } = useAuth()
  const badge = roleBadgeStyle(role)

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-4 md:p-6 flex flex-col md:flex-row items-center md:items-start justify-between gap-6">
      <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 md:gap-6 text-center sm:text-right">
        <ProfileAvatar
          src={user?.avatarUrl}
          size={96}
          borderClassName="border-4 border-slate-50"
        />
        <div className="flex flex-col pt-2">
          <h2 className="text-xl md:text-2xl font-bold text-slate-800 mb-1">
            {isLoading ? '...' : (user?.fullName ?? '—')}
          </h2>
          {user?.nationalId ? (
            <p className="text-slate-500 text-sm mb-1">
              رقم الهوية: {user.nationalId}
            </p>
          ) : null}
          {user?.email ? (
            <p className="text-slate-500 text-sm mb-4">{user.email}</p>
          ) : null}
          <div className="flex flex-wrap justify-center sm:justify-start gap-2">
            {user?.region ? (
              <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-xs font-semibold">
                {user.region}
              </span>
            ) : null}
            <span
              className={`px-3 py-1 rounded-full text-xs font-semibold ${badge.bg} ${badge.text}`}
            >
              {roleLabel(role)}
            </span>
          </div>
        </div>
      </div>

      <button
        type="button"
        onClick={logout}
        className="flex items-center justify-center gap-2 px-4 py-2 bg-red-50 text-red-500 rounded-lg text-sm font-semibold hover:bg-red-100 transition-colors w-full md:w-auto"
      >
        تسجيل خروج
        <LogOut size={16} />
      </button>
    </div>
  )
}
