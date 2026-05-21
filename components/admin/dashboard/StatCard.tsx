'use client'

import type { LucideIcon } from 'lucide-react'

interface StatCardProps {
  title: string
  value: string
  icon: LucideIcon
  valueColor?: string
}

export default function StatCard({
  title,
  value,
  icon: Icon,
  valueColor = '#2196F3',
}: StatCardProps) {
  return (
    <div className="rounded-2xl bg-white p-5 shadow-[0_2px_12px_rgba(0,0,0,0.06)]">
      <div className="flex w-full flex-col items-start text-right">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#E3F2FD]">
          <Icon size={20} style={{ color: valueColor }} strokeWidth={2} />
        </div>
        <p
          className="mt-3 w-full text-sm font-medium text-black"
          style={{ fontFamily: "'Cairo', sans-serif" }}
        >
          {title}
        </p>
        <p
          className="mt-2 w-full text-[28px] font-bold leading-none sm:text-[32px]"
          style={{ color: valueColor, fontFamily: "'Cairo', sans-serif" }}
        >
          {value}
        </p>
      </div>
    </div>
  )
}
