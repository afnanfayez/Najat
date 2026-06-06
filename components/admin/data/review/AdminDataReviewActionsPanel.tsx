'use client'

import { useState } from 'react'
import type { AdminDataReviewDecision } from '@/schemas/adminData'
import {
  ADMIN_DATA_BLUE,
  ADMIN_DATA_CARD_SHADOW,
  ADMIN_DATA_FONT,
  ADMIN_DATA_INPUT_BG,
} from '../adminDataStyles'
import { Ban, CheckCircle2, Pencil } from 'lucide-react'

const DECISIONS: {
  id: AdminDataReviewDecision
  label: string
  subtitle: string
  icon: typeof CheckCircle2
  color: string
  bg: string
}[] = [
  {
    id: 'approve',
    label: 'موافقة على البيانات',
    subtitle: 'سيتم النشر فوراً',
    icon: CheckCircle2,
    color: '#22C55E',
    bg: '#F0FDF4',
  },
  {
    id: 'needs_review',
    label: 'بحاجة إلى مراجعة',
    subtitle: 'إعادة الطلب للمدخل',
    icon: Pencil,
    color: '#FF9800',
    bg: '#FFF8E1',
  },
  {
    id: 'reject',
    label: 'رفض الطلب',
    subtitle: 'بيانات غير دقيقة أو مكررة',
    icon: Ban,
    color: '#EF4444',
    bg: '#FEF2F2',
  },
]

interface AdminDataReviewActionsPanelProps {
  saving?: boolean
  onSaveDraft?: (notes: string, decision: AdminDataReviewDecision) => void | Promise<void>
  onPublish?: (notes: string, decision: AdminDataReviewDecision) => void | Promise<void>
}

export default function AdminDataReviewActionsPanel({
  saving = false,
  onSaveDraft,
  onPublish,
}: AdminDataReviewActionsPanelProps) {
  const [decision, setDecision] = useState<AdminDataReviewDecision>('approve')
  const [notes, setNotes] = useState('')

  return (
    <aside
      className="rounded-2xl border border-[#E8EEF5] bg-white p-4 sm:p-5"
      style={{ boxShadow: ADMIN_DATA_CARD_SHADOW }}
      dir="rtl"
    >
      <h2
        className="text-right text-base font-bold text-[#0F172A] sm:text-lg"
        style={{ fontFamily: ADMIN_DATA_FONT }}
      >
        قسم المراجعة والتدقيق
      </h2>
      <p
        className="mt-1 mb-4 text-right text-sm font-bold text-[#2196F3]"
        style={{ fontFamily: ADMIN_DATA_FONT }}
      >
        تحديد حالة الطلب
      </p>

      <div className="mb-5 flex flex-col gap-2.5">
        {DECISIONS.map((opt) => {
          const Icon = opt.icon
          const selected = decision === opt.id
          return (
            <button
              key={opt.id}
              type="button"
              onClick={() => setDecision(opt.id)}
              className="flex w-full items-center gap-3 rounded-2xl border-2 px-4 py-3.5 text-right transition-all"
              style={{
                borderColor: selected ? opt.color : '#E8EEF5',
                background: selected ? opt.bg : '#fff',
              }}
            >
              <Icon size={22} className="shrink-0" style={{ color: opt.color }} strokeWidth={2.5} />
              <div className="min-w-0 flex-1 text-right">
                <p
                  className="text-sm font-bold"
                  style={{
                    fontFamily: ADMIN_DATA_FONT,
                    color: selected ? opt.color : '#0F172A',
                  }}
                >
                  {opt.label}
                </p>
                <p
                  className="mt-0.5 text-xs font-medium text-[#94A3B8]"
                  style={{ fontFamily: ADMIN_DATA_FONT }}
                >
                  {opt.subtitle}
                </p>
              </div>
            </button>
          )
        })}
      </div>

      <p
        className="mb-2 text-right text-sm font-bold text-[#2196F3]"
        style={{ fontFamily: ADMIN_DATA_FONT }}
      >
        مقارنة مع المصادر الخارجية
      </p>
      <textarea
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        placeholder="أضف ملاحظاتك حول توافق هذه البيانات مع المصادر الرسمية أو التقارير الأخرى..."
        rows={4}
        className="mb-4 w-full resize-y rounded-2xl border-none px-4 py-3 text-right text-sm leading-7 text-[#334155] outline-none placeholder:text-[#94A3B8] focus-visible:ring-2 focus-visible:ring-[#2196F3]/30"
        style={{ fontFamily: ADMIN_DATA_FONT, background: ADMIN_DATA_INPUT_BG }}
      />

      <div className="flex flex-col gap-2.5">
        <button
          type="button"
          disabled={saving}
          onClick={() => onPublish?.(notes, decision)}
          className="w-full rounded-xl py-3 text-sm font-bold text-white transition-opacity hover:opacity-90 disabled:opacity-60"
          style={{ background: ADMIN_DATA_BLUE, fontFamily: ADMIN_DATA_FONT }}
        >
          {saving ? 'جاري الحفظ...' : 'اعتماد ونشر العموم'}
        </button>
        <button
          type="button"
          disabled={saving}
          onClick={() => onSaveDraft?.(notes, decision)}
          className="w-full rounded-xl border border-[#E8EEF5] bg-white py-3 text-sm font-bold text-[#0F172A] transition-opacity hover:opacity-80 disabled:opacity-60"
          style={{ fontFamily: ADMIN_DATA_FONT }}
        >
          حفظ المسودة
        </button>
      </div>
    </aside>
  )
}
