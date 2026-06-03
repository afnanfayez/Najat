'use client'

import { Input } from '@/components/ui/input'
import SetupSectionCard from '../../setup/SetupSectionCard'
import type { AdminAidDonorDetail } from '@/schemas/adminAid'
import {
  SETUP_FONT,
  SETUP_INPUT_BG,
  SETUP_INPUT_CLASS,
  SETUP_LABEL_STYLE,
} from '../../setup/setupStyles'

interface DonorNotesSectionProps {
  form: AdminAidDonorDetail
  onChange: <K extends keyof AdminAidDonorDetail>(
    key: K,
    value: AdminAidDonorDetail[K],
  ) => void
}

export default function DonorNotesSection({ form, onChange }: DonorNotesSectionProps) {
  return (
    <SetupSectionCard title="ملاحظات إضافية">
      <div className="flex flex-col gap-2 text-right">
        <label style={SETUP_LABEL_STYLE}>ملاحظات حول الشراكة</label>
        <textarea
          value={form.notes}
          onChange={(e) => onChange('notes', e.target.value)}
          placeholder="أدخل أي تفاصيل إضافية حول الاتفاقية أو شروط التبرع..."
          rows={4}
          className="w-full resize-none rounded-xl border-none p-3 text-right text-sm shadow-none outline-none focus-visible:ring-0"
          style={{ fontFamily: SETUP_FONT, background: SETUP_INPUT_BG }}
        />
      </div>
    </SetupSectionCard>
  )
}
