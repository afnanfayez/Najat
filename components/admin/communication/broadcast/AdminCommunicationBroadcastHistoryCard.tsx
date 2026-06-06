'use client'

import type { AdminCommunicationBroadcastHistoryItem } from '@/schemas/adminCommunication'
import {
  ADMIN_COMM_CARD_SHADOW,
  ADMIN_COMM_CARD_SHELL,
  ADMIN_COMM_FONT,
  ADMIN_COMM_INPUT_BG,
} from '../adminCommunicationStyles'

interface AdminCommunicationBroadcastHistoryCardProps {
  history: AdminCommunicationBroadcastHistoryItem[]
  onViewArchive?: () => void
}

const TAG_STYLES = {
  emergency: { bg: '#FEE2E2', color: '#EF4444' },
  service: { bg: '#E8F5E9', color: '#22C55E' },
}

function HistoryItem({ item }: { item: AdminCommunicationBroadcastHistoryItem }) {
  const tagStyle = TAG_STYLES[item.tagTone]
  const metrics = [item.reach, item.openRate, item.confirmations]

  return (
    <article className="border-b border-[#E8EEF5] py-4 last:border-b-0">
      <div className="mb-2 flex items-center justify-between gap-2">
        <span className="text-[11px] font-medium text-[#94A3B8] sm:text-xs">
          {item.timeLabel}
        </span>
        <span
          className="shrink-0 rounded-full px-2.5 py-0.5 text-[11px] font-bold sm:text-xs"
          style={{ background: tagStyle.bg, color: tagStyle.color }}
        >
          {item.tagLabel}
        </span>
      </div>

      <h4 className="mb-3 text-right text-sm font-bold text-[#0F172A] sm:text-base">
        {item.title}
      </h4>

      <div className="grid grid-cols-3 gap-2">
        {metrics.map((metric) => (
          <div
            key={metric}
            className="rounded-lg px-2 py-1.5 text-center text-[11px] font-semibold sm:text-xs"
            style={{
              background: ADMIN_COMM_INPUT_BG,
              color: '#2196F3',
              fontFamily: ADMIN_COMM_FONT,
            }}
          >
            {metric}
          </div>
        ))}
      </div>
    </article>
  )
}

export default function AdminCommunicationBroadcastHistoryCard({
  history,
  onViewArchive,
}: AdminCommunicationBroadcastHistoryCardProps) {
  return (
    <div
      className={ADMIN_COMM_CARD_SHELL}
      style={{ fontFamily: ADMIN_COMM_FONT, boxShadow: ADMIN_COMM_CARD_SHADOW }}
    >
      <h3 className="mb-1 text-right text-base font-bold text-[#0F172A] sm:text-lg">
        تجهيز بث جديد
      </h3>

      <div className="mt-2">
        {history.map((item) => (
          <HistoryItem key={item.id} item={item} />
        ))}
      </div>

      <button
        type="button"
        onClick={onViewArchive}
        className="mt-2 w-full text-center text-sm font-bold text-[#2196F3] transition-opacity hover:opacity-80"
      >
        استعراض الأرشيف الكامل
      </button>
    </div>
  )
}
