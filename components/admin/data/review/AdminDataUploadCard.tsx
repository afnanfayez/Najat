'use client'

import { Upload } from 'lucide-react'
import {
  ADMIN_DATA_CARD_SHADOW,
  ADMIN_DATA_FONT,
} from '../adminDataStyles'

export default function AdminDataUploadCard() {
  return (
    <article
      className="rounded-2xl border border-[#E8EEF5] bg-white p-4 sm:p-5"
      style={{ boxShadow: ADMIN_DATA_CARD_SHADOW }}
      dir="rtl"
    >
      <h2
        className="mb-4 text-right text-base font-bold text-[#0F172A] sm:text-lg"
        style={{ fontFamily: ADMIN_DATA_FONT }}
      >
        الصور والوثائق الداعمة
      </h2>
      <div className="flex min-h-[160px] flex-col items-center justify-center rounded-2xl border-2 border-dashed border-[#CBD5E1] bg-[#FAFBFC] px-4 py-8 text-center sm:min-h-[180px]">
        <Upload size={32} className="mb-3 text-[#94A3B8]" strokeWidth={2} />
        <p
          className="text-sm font-bold text-[#64748B]"
          style={{ fontFamily: ADMIN_DATA_FONT }}
        >
          اسحب وأفلت الصور أو الوثائق هنا
        </p>
        <p
          className="mt-1 text-xs font-medium text-[#94A3B8]"
          style={{ fontFamily: ADMIN_DATA_FONT }}
        >
          الحد الأقصى 50MB — JPG, PNG, PDF
        </p>
      </div>
    </article>
  )
}
