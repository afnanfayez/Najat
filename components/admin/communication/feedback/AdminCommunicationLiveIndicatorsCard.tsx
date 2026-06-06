'use client'

import { Clock, Download } from 'lucide-react'
import type { AdminCommunicationLiveIndicator } from '@/schemas/adminCommunication'
import {
  ADMIN_COMM_BLUE,
  ADMIN_COMM_CARD_SHADOW,
  ADMIN_COMM_CARD_SHELL,
  ADMIN_COMM_FONT,
} from '../adminCommunicationStyles'
import AdminCommunicationCircularProgress from './AdminCommunicationCircularProgress'

interface AdminCommunicationLiveIndicatorsCardProps {
  indicators: AdminCommunicationLiveIndicator[]
  exporting?: boolean
  onExport?: () => void
  onSentimentAnalysis?: (id: string) => void
}

export default function AdminCommunicationLiveIndicatorsCard({
  indicators,
  exporting,
  onExport,
  onSentimentAnalysis,
}: AdminCommunicationLiveIndicatorsCardProps) {
  return (
    <div
      className={ADMIN_COMM_CARD_SHELL}
      style={{ fontFamily: ADMIN_COMM_FONT, boxShadow: ADMIN_COMM_CARD_SHADOW }}
      dir="rtl"
    >
      <div className="mb-5 flex items-center justify-start gap-2">
        <Clock size={18} className="text-[#0F172A]" strokeWidth={2.5} />
        <h3 className="text-base font-bold text-[#0F172A] sm:text-lg">مؤشرات حية</h3>
      </div>

      <div className="mb-5 flex flex-col gap-3">
        {indicators.map((indicator) => (
          <div
            key={indicator.id}
            className="flex items-center gap-4 rounded-xl border border-[#E8EEF5] bg-white p-3 sm:p-4"
            style={{ boxShadow: ADMIN_COMM_CARD_SHADOW }}
          >
            <div className="min-w-0 flex-1 text-right">
              <h4 className="mb-1 text-sm font-bold text-[#0F172A] sm:text-base">
                {indicator.title}
              </h4>
              <p className="text-xs font-semibold sm:text-sm" style={{ color: ADMIN_COMM_BLUE }}>
                {indicator.participationsLabel}
              </p>
            </div>

            <div className="flex shrink-0 flex-col items-center gap-1">
              <AdminCommunicationCircularProgress value={indicator.progress} />
              <button
                type="button"
                onClick={() => onSentimentAnalysis?.(indicator.id)}
                className="text-[11px] font-bold transition-opacity hover:opacity-80 sm:text-xs"
                style={{ color: ADMIN_COMM_BLUE }}
              >
                تحليل المشاعر
              </button>
            </div>
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={onExport}
        disabled={exporting}
        className="flex w-full items-center justify-center gap-2 rounded-full py-3 text-sm font-bold text-white transition-opacity hover:opacity-90 disabled:opacity-60"
        style={{ background: ADMIN_COMM_BLUE, fontFamily: ADMIN_COMM_FONT }}
      >
        <Download size={16} strokeWidth={2.5} />
        {exporting ? 'جاري التصدير...' : 'تصدير التقارير التفصيلية'}
      </button>
    </div>
  )
}
