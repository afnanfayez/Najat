'use client'

import { PieChart } from 'lucide-react'
import type { AdminCommunicationWordCloud } from '@/schemas/adminCommunication'
import {
  ADMIN_COMM_BLUE,
  ADMIN_COMM_CARD_SHADOW,
  ADMIN_COMM_CARD_SHELL,
  ADMIN_COMM_FONT,
  ADMIN_COMM_INPUT_BG,
} from '../adminCommunicationStyles'

interface AdminCommunicationWordCloudCardProps {
  wordCloud: AdminCommunicationWordCloud
  onRefresh?: () => void
}

export default function AdminCommunicationWordCloudCard({
  wordCloud,
  onRefresh,
}: AdminCommunicationWordCloudCardProps) {
  return (
    <div
      className={ADMIN_COMM_CARD_SHELL}
      style={{ fontFamily: ADMIN_COMM_FONT, boxShadow: ADMIN_COMM_CARD_SHADOW }}
      dir="rtl"
    >
      <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center justify-start gap-2">
          <PieChart size={18} style={{ color: ADMIN_COMM_BLUE }} strokeWidth={2.5} />
          <h3 className="text-base font-bold text-[#0F172A] sm:text-lg">
            سحابة الكلمات الذكية
          </h3>
        </div>

        <button
          type="button"
          onClick={onRefresh}
          className="w-full shrink-0 rounded-lg px-3 py-1.5 text-xs font-bold sm:w-auto sm:text-sm"
          style={{
            background: ADMIN_COMM_INPUT_BG,
            color: ADMIN_COMM_BLUE,
            fontFamily: ADMIN_COMM_FONT,
          }}
        >
          حدث لحظياً
        </button>
      </div>

      <div className="mb-5 flex flex-wrap justify-start gap-2">
        {wordCloud.tags.map((tag) => (
          <span
            key={tag}
            className="rounded-full px-3 py-1.5 text-xs font-bold sm:text-sm"
            style={{
              background: ADMIN_COMM_INPUT_BG,
              color: ADMIN_COMM_BLUE,
            }}
          >
            {tag}
          </span>
        ))}
      </div>

      <div className="rounded-xl border border-[#E8EEF5] bg-[#FAFBFC] p-3 sm:p-4">
        <div className="mb-2 flex flex-col gap-1 min-[400px]:flex-row min-[400px]:items-center min-[400px]:justify-between min-[400px]:gap-2">
          <span className="text-xs font-semibold text-[#64748B] sm:text-sm">
            معدل التغيير عن الأسبوع الماضي
          </span>
          <span className="text-sm font-bold text-[#22C55E]">
            {wordCloud.weeklyChangeRate}%
          </span>
        </div>
        <div
          className="h-2 overflow-hidden rounded-full bg-[#E2E8F0]"
          dir="rtl"
        >
          <div
            className="h-full rounded-full bg-[#22C55E] transition-all"
            style={{ width: `${Math.min(wordCloud.weeklyChangeRate, 100)}%` }}
          />
        </div>
      </div>
    </div>
  )
}
