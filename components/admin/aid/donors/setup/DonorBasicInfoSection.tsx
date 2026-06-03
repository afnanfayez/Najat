'use client'

import { Mail, Phone } from 'lucide-react'
import { Input } from '@/components/ui/input'
import AdminUsersSelectField from '../../../users/AdminUsersSelectField'
import SetupSectionCard from '../../setup/SetupSectionCard'
import { ADMIN_AID_DONOR_TYPE_OPTIONS } from '@/lib/mocks/adminAidMockData'
import type { AdminAidDonorDetail } from '@/schemas/adminAid'
import {
  SETUP_FONT,
  SETUP_INPUT_BG,
  SETUP_INPUT_CLASS,
  SETUP_LABEL_STYLE,
} from '../../setup/setupStyles'

const COUNTRY_OPTIONS = [
  { value: 'فلسطين', label: 'فلسطين' },
  { value: 'قطر', label: 'قطر' },
  { value: 'سويسرا', label: 'سويسرا' },
  { value: 'الإمارات', label: 'الإمارات' },
  { value: 'أخرى', label: 'أخرى' },
]

interface DonorBasicInfoSectionProps {
  form: AdminAidDonorDetail
  onChange: <K extends keyof AdminAidDonorDetail>(
    key: K,
    value: AdminAidDonorDetail[K],
  ) => void
}

export default function DonorBasicInfoSection({
  form,
  onChange,
}: DonorBasicInfoSectionProps) {
  return (
    <SetupSectionCard title="المعلومات الأساسية">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="flex flex-col gap-2 text-right md:col-span-2">
          <label style={SETUP_LABEL_STYLE}>اسم الجهة المانحة</label>
          <Input
            value={form.name}
            onChange={(e) => onChange('name', e.target.value)}
            placeholder="الهلال الأحمر القطري"
            className={SETUP_INPUT_CLASS}
            style={{ fontFamily: SETUP_FONT, background: SETUP_INPUT_BG }}
          />
        </div>

        <AdminUsersSelectField
          label="نوع المانح"
          value={form.donorType}
          onValueChange={(v) =>
            onChange('donorType', v as AdminAidDonorDetail['donorType'])
          }
          options={ADMIN_AID_DONOR_TYPE_OPTIONS.map((o) => ({
            value: o.value,
            label: o.label,
          }))}
        />

        <div className="flex flex-col gap-2 text-right">
          <label style={SETUP_LABEL_STYLE}>القطاع / مجال الدعم</label>
          <Input
            value={form.sector}
            onChange={(e) => onChange('sector', e.target.value)}
            placeholder="قطاع الصحة"
            className={SETUP_INPUT_CLASS}
            style={{ fontFamily: SETUP_FONT, background: SETUP_INPUT_BG }}
          />
        </div>

        <div className="flex flex-col gap-2 text-right">
          <label style={SETUP_LABEL_STYLE}>مسؤول التواصل</label>
          <Input
            value={form.contactPerson}
            onChange={(e) => onChange('contactPerson', e.target.value)}
            placeholder="د. أحمد المنصور"
            className={SETUP_INPUT_CLASS}
            style={{ fontFamily: SETUP_FONT, background: SETUP_INPUT_BG }}
          />
        </div>

        <AdminUsersSelectField
          label="الدولة"
          value={form.country}
          onValueChange={(v) => onChange('country', v)}
          options={COUNTRY_OPTIONS}
        />

        <div className="flex flex-col gap-2 text-right">
          <label style={SETUP_LABEL_STYLE}>البريد الإلكتروني</label>
          <div className="relative">
            <Mail
              size={18}
              className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-[#2196F3]"
            />
            <Input
              value={form.email}
              onChange={(e) => onChange('email', e.target.value)}
              placeholder="contact@example.org"
              className={`${SETUP_INPUT_CLASS} pr-10 text-right`}
              style={{ fontFamily: SETUP_FONT, background: SETUP_INPUT_BG }}
            />
          </div>
        </div>

        <div className="flex flex-col gap-2 text-right">
          <label style={SETUP_LABEL_STYLE}>رقم الهاتف</label>
          <div className="relative">
            <Phone
              size={18}
              className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-[#2196F3]"
            />
            <Input
              value={form.phone}
              onChange={(e) => onChange('phone', e.target.value)}
              placeholder="+970 59 123 4567"
              className={`${SETUP_INPUT_CLASS} pr-10 text-right`}
              style={{ fontFamily: SETUP_FONT, background: SETUP_INPUT_BG }}
            />
          </div>
        </div>

        <div className="flex flex-col gap-2 text-right md:col-span-2">
          <label style={SETUP_LABEL_STYLE}>الموقع الإلكتروني</label>
          <Input
            value={form.website}
            onChange={(e) => onChange('website', e.target.value)}
            placeholder="www.example.org"
            className={SETUP_INPUT_CLASS}
            style={{ fontFamily: SETUP_FONT, background: SETUP_INPUT_BG }}
          />
        </div>
      </div>
    </SetupSectionCard>
  )
}
