'use client'

import { MapPin, Phone } from 'lucide-react'
import { Input } from '@/components/ui/input'
import AdminUsersSelectField from '../../users/AdminUsersSelectField'
import SetupSectionCard from './SetupSectionCard'
import { FACILITY_REGION_OPTIONS, FACILITY_TYPE_OPTIONS } from './setupConstants'
import type { FacilitySetupForm } from './types'
import type { AdminHealthFacilityType } from '@/schemas/adminHealth'
import {
  SETUP_FONT,
  SETUP_INPUT_BG,
  SETUP_INPUT_CLASS,
  SETUP_LABEL_STYLE,
  SETUP_BLUE,
} from './setupStyles'

interface BasicInfoSectionProps {
  form: FacilitySetupForm
  onChange: <K extends keyof FacilitySetupForm>(
    key: K,
    value: FacilitySetupForm[K],
  ) => void
  facilityType?: AdminHealthFacilityType
  onFacilityTypeChange?: (type: AdminHealthFacilityType) => void
}

export default function BasicInfoSection({ form, onChange, facilityType, onFacilityTypeChange }: BasicInfoSectionProps) {
  return (
    <SetupSectionCard title="المعلومات الأساسية">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {onFacilityTypeChange && (
          <div className="md:col-span-2">
            <AdminUsersSelectField
              label="نوع المنشأة"
              value={facilityType ?? 'hospital'}
              onValueChange={(v) => onFacilityTypeChange(v as AdminHealthFacilityType)}
              options={FACILITY_TYPE_OPTIONS}
            />
          </div>
        )}

        <div className="flex flex-col gap-2 text-right">
          <label style={SETUP_LABEL_STYLE}>اسم المنشأة</label>
          <Input
            value={form.name}
            onChange={(e) => onChange('name', e.target.value)}
            placeholder="مستشفى الأمل التخصصي"
            className={SETUP_INPUT_CLASS}
            style={{ fontFamily: SETUP_FONT, background: SETUP_INPUT_BG }}
          />
        </div>

        <AdminUsersSelectField
          label="المنطقة"
          value={form.region}
          onValueChange={(v) => onChange('region', v)}
          options={FACILITY_REGION_OPTIONS}
        />

        <div className="flex flex-col gap-2 text-right md:col-span-2">
          <label style={SETUP_LABEL_STYLE}>العنوان التفصيلي</label>
          <div className="relative">
            <MapPin
              size={18}
              className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2"
              style={{ color: SETUP_BLUE }}
            />
            <Input
              value={form.address}
              onChange={(e) => onChange('address', e.target.value)}
              placeholder="غزة، الرمال، شارع النصر"
              className={`${SETUP_INPUT_CLASS} pr-10`}
              style={{ fontFamily: SETUP_FONT, background: SETUP_INPUT_BG }}
            />
          </div>
        </div>

        <div className="flex flex-col gap-2 text-right md:col-span-2">
          <label style={SETUP_LABEL_STYLE}>رقم الهاتف</label>
          <div className="relative">
            <Phone
              size={18}
              className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2"
              style={{ color: SETUP_BLUE }}
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
