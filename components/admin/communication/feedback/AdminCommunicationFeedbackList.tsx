'use client'

import { User } from 'lucide-react'
import { useMemo, useState } from 'react'
import type {
  AdminCommunicationFeedbackFilter,
  AdminCommunicationFeedbackItem,
} from '@/schemas/adminCommunication'
import {
  ADMIN_COMM_CARD_SHADOW,
  ADMIN_COMM_CARD_SHELL,
  ADMIN_COMM_FONT,
  ADMIN_COMM_INPUT_BG,
  ADMIN_COMM_BLUE,
} from '../adminCommunicationStyles'

interface AdminCommunicationFeedbackListProps {
  items: AdminCommunicationFeedbackItem[]
}

function FeedbackCard({ item }: { item: AdminCommunicationFeedbackItem }) {
  return (
    <article
      className={ADMIN_COMM_CARD_SHELL}
      style={{ fontFamily: ADMIN_COMM_FONT, boxShadow: ADMIN_COMM_CARD_SHADOW }}
      dir="rtl"
    >
      <div className="mb-3 flex flex-col gap-2 min-[480px]:flex-row min-[480px]:items-start min-[480px]:justify-between min-[480px]:gap-3">
        <div className="flex min-w-0 items-center justify-start gap-3">
          <span
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full"
            style={{ background: ADMIN_COMM_INPUT_BG, color: ADMIN_COMM_BLUE }}
          >
            <User size={18} strokeWidth={2.5} />
          </span>
          <div className="min-w-0 text-right">
            <p className="text-sm font-bold text-[#0F172A] sm:text-base">{item.authorName}</p>
            <p className="text-xs font-medium text-[#64748B] sm:text-sm">{item.authorMeta}</p>
          </div>
        </div>

        <span
          className="self-start rounded-full px-2.5 py-0.5 text-[11px] font-bold sm:self-auto sm:text-xs"
          style={{ background: '#FEE2E2', color: '#EF4444' }}
        >
          {item.priorityLabel}
        </span>
      </div>

      <p className="text-right text-sm leading-relaxed text-[#334155] sm:text-base">
        {item.content}
      </p>
    </article>
  )
}

export default function AdminCommunicationFeedbackList({
  items,
}: AdminCommunicationFeedbackListProps) {
  const [filter, setFilter] = useState<AdminCommunicationFeedbackFilter>('latest')

  const filteredItems = useMemo(() => {
    const sorted = [...items]
    if (filter === 'latest') {
      sorted.sort((a, b) => a.createdAt - b.createdAt)
    } else {
      sorted.sort((a, b) => b.priorityRank - a.priorityRank)
    }
    return sorted
  }, [items, filter])

  return (
    <section style={{ fontFamily: ADMIN_COMM_FONT }} dir="rtl">
      <div className="mb-4 flex flex-col gap-3 min-[480px]:flex-row min-[480px]:items-center min-[480px]:justify-between">
        <h3 className="text-base font-bold text-[#0F172A] sm:text-lg">
          تحليل المقترحات والآراء
        </h3>

        <div className="flex shrink-0 flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setFilter('latest')}
            className="rounded-full px-3 py-1.5 text-xs font-bold transition-opacity sm:text-sm"
            style={{
              background: filter === 'latest' ? ADMIN_COMM_BLUE : ADMIN_COMM_INPUT_BG,
              color: filter === 'latest' ? '#fff' : ADMIN_COMM_BLUE,
            }}
          >
            الأحدث
          </button>
          <button
            type="button"
            onClick={() => setFilter('priority')}
            className="rounded-full px-3 py-1.5 text-xs font-bold transition-opacity sm:text-sm"
            style={{
              background: filter === 'priority' ? ADMIN_COMM_BLUE : ADMIN_COMM_INPUT_BG,
              color: filter === 'priority' ? '#fff' : ADMIN_COMM_BLUE,
            }}
          >
            الأعلى أولوية
          </button>
        </div>
      </div>

      <div className="flex flex-col gap-3 sm:gap-4">
        {filteredItems.map((item) => (
          <FeedbackCard key={item.id} item={item} />
        ))}
      </div>
    </section>
  )
}
