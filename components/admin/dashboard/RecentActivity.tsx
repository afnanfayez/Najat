'use client'

import { useRouter } from 'next/navigation'
import type { AdminActivity } from '../data/adminDashboardService'

interface RecentActivityProps {
  activities: AdminActivity[]
}

export default function RecentActivity({ activities }: RecentActivityProps) {
  const router = useRouter()

  return (
    <div className="rounded-2xl bg-white p-5 shadow-[0_2px_12px_rgba(0,0,0,0.06)]">
      <h2
        className="mb-4 text-right text-base font-bold text-[#1E293B] sm:text-lg"
        style={{ fontFamily: "'Cairo', sans-serif" }}
      >
        آخر النشاطات
      </h2>

      <ul className="space-y-4">
        {activities.map((activity) => {
          const Icon = activity.icon
          return (
            <li key={activity.id} className="flex items-start gap-3 text-right">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#E3F2FD]">
                <Icon size={16} className="text-[#2196F3]" strokeWidth={2} />
              </div>
              <div className="min-w-0 flex-1">
                <p
                  className="text-sm font-semibold text-[#1E293B]"
                  style={{ fontFamily: "'Cairo', sans-serif" }}
                >
                  {activity.title}
                </p>
                <p className="mt-1 text-xs text-[#94A3B8]">{activity.time}</p>
              </div>
            </li>
          )
        })}
      </ul>

      <button
        type="button"
        onClick={() => router.push('/admin/audit')}
        className="mt-5 w-full rounded-xl bg-[#E3F2FD] py-3 text-sm font-semibold text-[#2196F3] transition-colors hover:bg-[#BBDEFB]"
        style={{ fontFamily: "'Cairo', sans-serif" }}
      >
        سجل النشاطات الكامل
      </button>
    </div>
  )
}

