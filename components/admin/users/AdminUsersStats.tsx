'use client'

import type { LucideIcon } from 'lucide-react'
import { ClipboardCheck, UserCog, Users } from 'lucide-react'
import { formatStatNumber } from '../data/adminUsersService'
import { ADMIN_USERS_FONT } from './adminUsersStyles'
import type { AdminUsersStatsDto } from '@/schemas/adminUser'

interface AdminUsersStatCardProps {
  title: string
  value: string
  icon: LucideIcon
}

function AdminUsersStatCard({ title, value, icon: Icon }: AdminUsersStatCardProps) {
  return (
    <div className="rounded-2xl border border-[#E8EEF5] bg-white p-5 shadow-[0_2px_12px_rgba(0,0,0,0.04)]">
      <div className="flex w-full items-center justify-start gap-3 text-right">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#E3F2FD]">
          <Icon size={20} style={{ color: '#2196F3' }} strokeWidth={2} />
        </div>
        <p
          className="text-sm font-medium text-black"
          style={{ fontFamily: ADMIN_USERS_FONT }}
        >
          {title}
        </p>
      </div>
      <p
        className="mt-3 w-full text-[28px] font-bold leading-none sm:text-[32px]"
        style={{ color: '#2196F3', fontFamily: ADMIN_USERS_FONT }}
      >
        {value}
      </p>
    </div>
  )
}

interface AdminUsersStatsProps {
  stats?: AdminUsersStatsDto
}

export default function AdminUsersStats({ stats }: AdminUsersStatsProps) {
  if (!stats) return null

  return (
    <section className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
      <AdminUsersStatCard
        title="إجمالي المستخدمين"
        value={formatStatNumber(stats.totalUsers)}
        icon={Users}
      />
      <AdminUsersStatCard
        title="مسؤولون"
        value={formatStatNumber(stats.admins)}
        icon={UserCog}
      />
      <AdminUsersStatCard
        title="بانتظار الموافقة"
        value={formatStatNumber(stats.pendingApproval, true)}
        icon={ClipboardCheck}
      />
    </section>
  )
}
