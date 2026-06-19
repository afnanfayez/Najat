'use client'

import { useRouter } from 'next/navigation'
import { AlertTriangle } from 'lucide-react'
import type { AdminUrgentAlert } from '../data/adminDashboardService'

interface UrgentAlertItemProps {
  alert: AdminUrgentAlert
}

export default function UrgentAlertItem({ alert }: UrgentAlertItemProps) {
  const router = useRouter()
  const accent = alert.accentColor

  return (
    <div className="flex items-start justify-between gap-4 rounded-xl border border-[#E2E8F0] p-4">
      <div className="flex min-w-0 flex-1 items-start gap-3 text-right">
        <div
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full"
          style={{ backgroundColor: `${accent}20` }}
        >
          <AlertTriangle size={18} style={{ color: accent }} strokeWidth={2} />
        </div>
        <div className="min-w-0 flex-1">
          <p
            className="text-sm font-bold"
            style={{ color: accent, fontFamily: "'Cairo', sans-serif" }}
          >
            {alert.title}
          </p>
          <p
            className="mt-1 text-xs sm:text-sm"
            style={{ color: accent, fontFamily: "'Cairo', sans-serif", opacity: 0.85 }}
          >
            {alert.description}
          </p>
          <p
            className="mt-2 text-xs"
            style={{ color: accent, fontFamily: "'Cairo', sans-serif", opacity: 0.7 }}
          >
            {alert.time}
          </p>
        </div>
      </div>

      <button
        type="button"
        onClick={() => router.push('/admin/alerts')}
        className="shrink-0 self-center rounded-lg px-4 py-2 text-sm font-semibold text-white transition-opacity hover:opacity-90"
        style={{ backgroundColor: accent, fontFamily: "'Cairo', sans-serif" }}
      >
        اتخذ إجراء
      </button>
    </div>
  )
}
