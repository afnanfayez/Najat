'use client'

import type { AdminUrgentAlert } from '../data/adminDashboardService'
import UrgentAlertItem from './UrgentAlertItem'

interface UrgentAlertsProps {
  alerts: AdminUrgentAlert[]
}

export default function UrgentAlerts({ alerts }: UrgentAlertsProps) {
  return (
    <div className="rounded-2xl bg-white p-5 shadow-[0_2px_12px_rgba(0,0,0,0.06)]">
      <div className="mb-4 flex items-center justify-between gap-3">
        <h2
          className="text-right text-base font-bold text-[#1E293B] sm:text-lg"
          style={{ fontFamily: "'Cairo', sans-serif" }}
        >
          أهم التنبيهات العاجلة
        </h2>
        <button
          type="button"
          className="shrink-0 text-sm font-semibold text-[#2196F3] transition-colors hover:text-[#1976D2]"
          style={{ fontFamily: "'Cairo', sans-serif" }}
        >
          عرض الكل
        </button>
      </div>

      <div className="space-y-3">
        {alerts.map((alert) => (
          <UrgentAlertItem key={alert.id} alert={alert} />
        ))}
      </div>
    </div>
  )
}
