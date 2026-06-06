'use client'

import { AlertTriangle } from 'lucide-react'
import type { AdminSecurityAlert } from '@/schemas/adminSecurity'
import { ADMIN_SECURITY_CARD_SHADOW, ADMIN_SECURITY_FONT } from '../adminSecurityStyles'

interface AdminSecurityAlertsCardProps {
  title: string
  activeCount: number
  alerts: AdminSecurityAlert[]
  onBlockIp?: (alertId: string) => void
  onIgnore?: (alertId: string) => void
}

export default function AdminSecurityAlertsCard({
  title,
  activeCount,
  alerts,
  onBlockIp,
  onIgnore,
}: AdminSecurityAlertsCardProps) {
  return (
    <section
      className="min-w-0 overflow-hidden rounded-xl border border-[#FECACA]"
      style={{ boxShadow: ADMIN_SECURITY_CARD_SHADOW, fontFamily: ADMIN_SECURITY_FONT }}
      dir="rtl"
    >
      <div
        className="flex min-w-0 items-center justify-between gap-2 px-3 py-2.5 sm:px-4 sm:py-3"
        style={{ background: '#EF4444' }}
      >
        <h3 className="min-w-0 break-words text-sm font-bold text-white sm:text-base">{title}</h3>
        <span
          className="shrink-0 rounded-full px-2.5 py-0.5 text-[10px] font-bold sm:text-[11px]"
          style={{ background: '#F97316', color: '#fff' }}
        >
          {activeCount} نشط
        </span>
      </div>

      <div className="flex flex-col gap-2 bg-white p-3 sm:p-4">
        {alerts.map((alert) => (
          <div
            key={alert.id}
            className="flex flex-col gap-2.5 rounded-xl bg-[#FEF2F2] px-3 py-2.5 min-[520px]:flex-row min-[520px]:items-center min-[520px]:justify-between sm:px-4 sm:py-3"
          >
            <div className="flex min-w-0 items-start gap-2">
              <AlertTriangle className="mt-0.5 shrink-0 text-[#EF4444]" size={18} />
              <div className="min-w-0 text-right">
                <p className="break-words text-xs font-bold text-[#0F172A] sm:text-sm">{alert.title}</p>
                <p className="mt-0.5 break-words text-[10px] font-medium text-[#64748B] sm:text-xs">
                  {alert.description}
                </p>
              </div>
            </div>
            <div className="flex w-full shrink-0 items-center gap-2 min-[520px]:w-auto">
              <button
                type="button"
                onClick={() => onBlockIp?.(alert.id)}
                className="flex-1 rounded-lg px-3 py-1.5 text-[10px] font-bold text-white min-[520px]:flex-none sm:text-xs"
                style={{ background: '#EF4444', fontFamily: ADMIN_SECURITY_FONT }}
              >
                {alert.blockIpLabel}
              </button>
              <button
                type="button"
                onClick={() => onIgnore?.(alert.id)}
                className="flex-1 rounded-lg bg-[#E2E8F0] px-3 py-1.5 text-[10px] font-bold text-[#64748B] min-[520px]:flex-none sm:text-xs"
                style={{ fontFamily: ADMIN_SECURITY_FONT }}
              >
                {alert.ignoreLabel}
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
