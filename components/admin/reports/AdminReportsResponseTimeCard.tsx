'use client'

import { useState } from 'react'
import type { AdminReportsResponseTime } from '@/schemas/adminReports'
import {
  ADMIN_REPORTS_BLUE,
  ADMIN_REPORTS_CARD_SHELL,
  ADMIN_REPORTS_CARD_SHADOW,
  ADMIN_REPORTS_FONT,
  ADMIN_REPORTS_INPUT_BG,
} from './adminReportsStyles'
import AdminReportsLineChart from './AdminReportsLineChart'

interface AdminReportsResponseTimeCardProps {
  data: AdminReportsResponseTime
}

export default function AdminReportsResponseTimeCard({
  data,
}: AdminReportsResponseTimeCardProps) {
  const [audience, setAudience] = useState<'volunteers' | 'beneficiaries'>('volunteers')
  const points = audience === 'volunteers' ? data.volunteers : data.beneficiaries

  return (
    <section
      className={ADMIN_REPORTS_CARD_SHELL}
      style={{ boxShadow: ADMIN_REPORTS_CARD_SHADOW, fontFamily: ADMIN_REPORTS_FONT }}
      dir="rtl"
    >
      <div className="mb-3 flex flex-col gap-3 min-[480px]:flex-row min-[480px]:items-center min-[480px]:justify-between">
        <h3 className="text-sm font-bold text-[#0F172A] sm:text-base">{data.title}</h3>

        <div className="flex shrink-0 gap-2">
          {(
            [
              { id: 'volunteers' as const, label: 'المتطوعين' },
              { id: 'beneficiaries' as const, label: 'المستفيدين' },
            ] as const
          ).map((item) => {
            const active = audience === item.id
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setAudience(item.id)}
                className="rounded-full px-3 py-1.5 text-xs font-bold sm:text-sm"
                style={{
                  background: active ? ADMIN_REPORTS_BLUE : ADMIN_REPORTS_INPUT_BG,
                  color: active ? '#fff' : ADMIN_REPORTS_BLUE,
                }}
              >
                {item.label}
              </button>
            )
          })}
        </div>
      </div>

      <AdminReportsLineChart
        labels={points.map((p) => p.month)}
        values={points.map((p) => p.value)}
        ariaLabel={data.title}
        heightClass="h-[130px] sm:h-[150px]"
      />
    </section>
  )
}
