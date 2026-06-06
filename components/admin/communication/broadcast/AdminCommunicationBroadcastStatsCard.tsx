'use client'

import type { AdminCommunicationBroadcastStats } from '@/schemas/adminCommunication'
import { ADMIN_COMM_CARD_SHADOW, ADMIN_COMM_FONT } from '../adminCommunicationStyles'

interface AdminCommunicationBroadcastStatsCardProps {
  stats: AdminCommunicationBroadcastStats
}

export default function AdminCommunicationBroadcastStatsCard({
  stats,
}: AdminCommunicationBroadcastStatsCardProps) {
  return (
    <div
      className="overflow-hidden rounded-xl"
      style={{
        fontFamily: ADMIN_COMM_FONT,
        boxShadow: ADMIN_COMM_CARD_SHADOW,
        background: 'linear-gradient(160deg, #2196F3 0%, #1976D2 100%)',
      }}
    >
      <div className="px-4 py-4 sm:px-5 sm:py-5">
        <h3 className="mb-4 text-right text-base font-bold text-white sm:text-lg">
          تجهيز بث جديد
        </h3>

        <div className="mb-4 grid grid-cols-2 gap-3">
          <div className="text-right">
            <p className="text-xl font-bold text-white sm:text-2xl">{stats.totalReach}</p>
            <p className="mt-0.5 text-xs font-medium text-white/80 sm:text-sm">
              إجمالي الوصول
            </p>
          </div>
          <div className="text-right">
            <p className="text-xl font-bold text-white sm:text-2xl">{stats.responseRate}</p>
            <p className="mt-0.5 text-xs font-medium text-white/80 sm:text-sm">
              معدل الاستجابة
            </p>
          </div>
        </div>
      </div>

      <div
        className="px-4 py-3 sm:px-5 sm:py-4"
        style={{ background: 'rgba(0,0,0,0.15)' }}
      >
        <div className="mb-2 flex items-center justify-between">
          <span className="text-xs font-semibold text-white/90 sm:text-sm">
            كفاءة الشبكة
          </span>
          <span className="text-xs font-bold text-white sm:text-sm">
            {stats.networkEfficiencyLabel}
          </span>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-white/20">
          <div
            className="h-full rounded-full bg-[#4ADE80] transition-all"
            style={{ width: `${stats.networkEfficiency}%` }}
          />
        </div>
      </div>
    </div>
  )
}
