'use client'

import { Phone } from 'lucide-react'
import { Input } from '@/components/ui/input'
import AdminUsersSelectField from '../../users/AdminUsersSelectField'
import SetupSectionCard from './SetupSectionCard'
import { ADMIN_AID_REGION_OPTIONS, AID_POINT_TYPE_OPTIONS } from '@/lib/mocks/adminAidMockData'
import type { AdminAidDistributionPoint } from '@/schemas/adminAid'
import {
  SETUP_FONT,
  SETUP_INPUT_BG,
  SETUP_INPUT_CLASS,
  SETUP_LABEL_STYLE,
} from './setupStyles'

interface BasicInfoSectionProps {
  form: AdminAidDistributionPoint
  onChange: <K extends keyof AdminAidDistributionPoint>(
    key: K,
    value: AdminAidDistributionPoint[K],
  ) => void
}

export default function BasicInfoSection({ form, onChange }: BasicInfoSectionProps) {
  return (
    <SetupSectionCard title="المعلومات الأساسية">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="flex flex-col gap-2 text-right">
          <label style={SETUP_LABEL_STYLE}>اسم النقطة</label>
          <Input
            value={form.name}
            onChange={(e) => onChange('name', e.target.value)}
            placeholder="مركز الشفاء الطبي - ب"
            className={SETUP_INPUT_CLASS}
            style={{ fontFamily: SETUP_FONT, background: SETUP_INPUT_BG }}
          />
        </div>

        <AdminUsersSelectField
          label="المنطقة"
          value={form.region}
          onValueChange={(v) => onChange('region', v)}
          options={ADMIN_AID_REGION_OPTIONS}
        />

        <AdminUsersSelectField
          label="نوع النقطة"
          value={form.category}
          onValueChange={(v) => onChange('category', v)}
          options={AID_POINT_TYPE_OPTIONS}
        />

        <div className="flex flex-col gap-2 text-right md:col-span-2">
          <label style={SETUP_LABEL_STYLE}>العنوان بالتفصيل</label>
          <Input
            value={form.address}
            onChange={(e) => onChange('address', e.target.value)}
            placeholder="غزة، حي الرمال، شارع النصر"
            className={SETUP_INPUT_CLASS}
            style={{ fontFamily: SETUP_FONT, background: SETUP_INPUT_BG }}
          />
        </div>

        <div className="flex flex-col gap-2 text-right">
          <label style={SETUP_LABEL_STYLE}>المسؤول المختص</label>
          <Input
            value={form.manager}
            onChange={(e) => onChange('manager', e.target.value)}
            placeholder="أ. خالد محمود"
            className={SETUP_INPUT_CLASS}
            style={{ fontFamily: SETUP_FONT, background: SETUP_INPUT_BG }}
          />
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
      </div>
    </SetupSectionCard>
  )
}
