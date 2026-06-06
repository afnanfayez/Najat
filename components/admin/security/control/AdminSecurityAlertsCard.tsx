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
      className="overflow-hidden rounded-xl border border-[#FECACA]"
      style={{ boxShadow: ADMIN_SECURITY_CARD_SHADOW, fontFamily: ADMIN_SECURITY_FONT }}
      dir="rtl"
    >
      <div
        className="flex items-center justify-between gap-3 px-4 py-3 sm:px-5"
        style={{ background: '#EF4444' }}
      >
        <h3 className="text-sm font-bold text-white sm:text-base">{title}</h3>
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
            className="flex flex-col gap-3 rounded-xl bg-[#FEF2F2] px-3 py-3 min-[560px]:flex-row min-[560px]:items-center min-[560px]:justify-between sm:px-4"
          >
            <div className="flex min-w-0 items-start gap-2.5">
              <AlertTriangle className="mt-0.5 shrink-0 text-[#EF4444]" size={18} />
              <div className="min-w-0 text-right">
                <p className="text-xs font-bold text-[#0F172A] sm:text-sm">{alert.title}</p>
                <p className="mt-0.5 text-[10px] font-medium text-[#64748B] sm:text-xs">
                  {alert.description}
                </p>
              </div>
            </div>
            <div className="flex shrink-0 items-center gap-2 self-end min-[560px]:self-center">
              <button
                type="button"
                onClick={() => onBlockIp?.(alert.id)}
                className="rounded-lg px-3 py-1.5 text-[10px] font-bold text-white sm:text-xs"
                style={{ background: '#EF4444', fontFamily: ADMIN_SECURITY_FONT }}
              >
                {alert.blockIpLabel}
              </button>
              <button
                type="button"
                onClick={() => onIgnore?.(alert.id)}
                className="rounded-lg bg-[#E2E8F0] px-3 py-1.5 text-[10px] font-bold text-[#64748B] sm:text-xs"
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
