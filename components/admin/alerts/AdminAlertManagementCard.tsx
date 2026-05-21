'use client'

import { MapPin, Map as MapIcon, Users } from 'lucide-react'
import type { AdminManagedAlert } from '@/schemas/adminAlert'

interface AdminAlertManagementCardProps {
  alert: AdminManagedAlert
}

export default function AdminAlertManagementCard({ alert }: AdminAlertManagementCardProps) {
  return (
    <div className="rounded-2xl bg-white p-4 shadow-[0_2px_12px_rgba(0,0,0,0.06)] sm:p-5">
      <div className="mb-3 flex items-start justify-between gap-3">
        <h3
          className="text-right text-base font-bold text-[#1E293B] sm:text-lg"
          style={{ fontFamily: "'Cairo', sans-serif" }}
        >
          {alert.title}
        </h3>
        <span
          className="shrink-0 rounded-lg px-3 py-1 text-xs font-bold text-white"
          style={{ backgroundColor: alert.accentColor, fontFamily: "'Cairo', sans-serif" }}
        >
          {alert.badgeLabel}
        </span>
      </div>

      <div className="mb-4 flex items-center justify-start gap-2 text-right">
        <MapPin size={16} className="shrink-0 text-[#94A3B8]" />
        <span
          className="text-sm text-black"
          style={{ fontFamily: "'Cairo', sans-serif" }}
        >
          {alert.location}
        </span>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center justify-start gap-2">
          <button
            type="button"
            className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#F1F5F9] text-[#64748B] transition-colors hover:bg-[#E2E8F0]"
            aria-label="عرض على الخريطة"
          >
            <MapIcon size={18} />
          </button>
          <button
            type="button"
            className="flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-bold text-white transition-opacity hover:opacity-90"
            style={{ backgroundColor: alert.accentColor, fontFamily: "'Cairo', sans-serif" }}
          >
            <Users size={16} />
            إسناد فريق
          </button>
        </div>

        <span className="text-right text-xs text-[#94A3B8] sm:text-sm">{alert.time}</span>
      </div>
    </div>
  )
}
