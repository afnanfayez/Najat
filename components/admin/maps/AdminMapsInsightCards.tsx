'use client'

import { AlertTriangle } from 'lucide-react'
import type { AdminMapsInsight } from '@/schemas/adminMaps'
import {
  ADMIN_MAPS_CARD_SHADOW,
  ADMIN_MAPS_FONT,
} from './adminMapsStyles'

interface AdminMapsInsightCardsProps {
  insights: AdminMapsInsight[]
}

export default function AdminMapsInsightCards({ insights }: AdminMapsInsightCardsProps) {
  return (
    <section className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3">
      {insights.map((item) => {
        const isWarning = item.variant === 'warning'
        return (
          <article
            key={item.id}
            className={`rounded-2xl border p-4 sm:p-5 ${
              isWarning
                ? 'border-[#FECACA] bg-[#FEF2F2]'
                : 'border-[#E8EEF5] bg-white'
            }`}
            style={{ boxShadow: isWarning ? 'none' : ADMIN_MAPS_CARD_SHADOW }}
            dir="rtl"
          >
            <div className="mb-2 flex items-center justify-start gap-2">
              {isWarning && (
                <AlertTriangle size={18} className="shrink-0 text-[#EF4444]" />
              )}
              <h3
                className={`text-sm font-bold sm:text-base ${
                  isWarning ? 'text-[#991B1B]' : 'text-[#1E293B]'
                }`}
                style={{ fontFamily: ADMIN_MAPS_FONT }}
              >
                {item.title}
              </h3>
            </div>
            <p
              className={`text-xs leading-6 sm:text-sm ${
                isWarning ? 'text-[#B91C1C]' : 'text-[#64748B]'
              }`}
              style={{ fontFamily: ADMIN_MAPS_FONT }}
            >
              {item.description}
            </p>
          </article>
        )
      })}
    </section>
  )
}
