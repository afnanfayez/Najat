'use client'

import { AlertTriangle } from 'lucide-react'
import { SETUP_FONT } from './setupStyles'

interface DangerZoneSectionProps {
  onDelete?: () => void
  deleting?: boolean
}

export default function DangerZoneSection({
  onDelete,
  deleting = false,
}: DangerZoneSectionProps) {
  return (
    <section
      className="mt-6 flex flex-col gap-4 rounded-2xl border border-[#FECACA] bg-[#FEF2F2] p-5 sm:flex-row sm:items-center sm:justify-between"
      dir="rtl"
    >
      <div className="flex items-start gap-3 text-right">
        <AlertTriangle size={22} className="mt-0.5 shrink-0 text-[#EF4444]" />
        <div>
          <p
            className="text-sm font-bold text-[#991B1B]"
            style={{ fontFamily: SETUP_FONT }}
          >
            حذف نقطة التوزيع
          </p>
          <p
            className="mt-1 text-xs font-medium text-[#B91C1C]"
            style={{ fontFamily: SETUP_FONT }}
          >
            سيتم أرشفة السجلات التاريخية المرتبطة بهذه النقطة ولا يمكن التراجع عن
            هذا الإجراء.
          </p>
        </div>
      </div>

      <button
        type="button"
        onClick={onDelete}
        disabled={deleting}
        className="shrink-0 rounded-xl px-5 py-3 text-sm font-bold text-white transition-opacity hover:opacity-90 disabled:opacity-60"
        style={{ background: '#EF4444', fontFamily: SETUP_FONT }}
      >
        {deleting ? 'جاري الحذف...' : 'إيقاف الخدمة / حذف'}
      </button>
    </section>
  )
}
