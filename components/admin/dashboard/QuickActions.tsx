'use client'

import { useRouter } from 'next/navigation'
import type { AdminQuickAction } from '../data/adminDashboardService'

interface QuickActionsProps {
  actions: AdminQuickAction[]
}

export default function QuickActions({ actions }: QuickActionsProps) {
  const router = useRouter()

  return (
    <div className="rounded-2xl bg-white p-5 shadow-[0_2px_12px_rgba(0,0,0,0.06)]">
      <h2
        className="mb-4 text-right text-base font-bold text-[#1E293B] sm:text-lg"
        style={{ fontFamily: "'Cairo', sans-serif" }}
      >
        إجراءات سريعة
      </h2>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {actions.map((action) => {
          const Icon = action.icon
          return (
            <button
              key={action.id}
              type="button"
              onClick={() => router.push(action.href)}
              className="flex items-center justify-start gap-3 rounded-xl bg-[#E3F2FD] px-4 py-3.5 text-right transition-colors hover:bg-[#BBDEFB]"
            >
              <Icon size={20} className="shrink-0 text-[#2196F3]" strokeWidth={2} />
              <span
                className="text-sm font-semibold text-[#2196F3]"
                style={{ fontFamily: "'Cairo', sans-serif" }}
              >
                {action.label}
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
