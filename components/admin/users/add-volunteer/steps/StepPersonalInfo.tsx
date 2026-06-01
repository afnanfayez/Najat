'use client'

import { useRef } from 'react'
import { Camera } from 'lucide-react'
import { ADMIN_USER_REGION_OPTIONS } from '@/lib/mocks/adminUsersMockData'
import {
  ADDRESS_OPTIONS,
  FORM_BLUE,
  FORM_FONT,
  FORM_INPUT_BG,
  FORM_INPUT_STYLE,
  FORM_LABEL_STYLE,
  type UpdateField,
  type VolunteerFormData,
} from '../types'
import SelectField from '../SelectField'

interface Props {
  data: VolunteerFormData
  onChange: UpdateField
}

const inputClass =
  'h-11 w-full rounded-xl border-none px-3 text-right text-sm outline-none focus:ring-2 focus:ring-[#2196F3]/40'
const selectClass =
  'h-11 w-full appearance-none rounded-xl border-none px-3 text-right text-sm outline-none focus:ring-2 focus:ring-[#2196F3]/40'

export default function StepPersonalInfo({ data, onChange }: Props) {
  const fileRef = useRef<HTMLInputElement>(null)

  function handlePhotoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    const url = URL.createObjectURL(file)
    onChange('photo', url)
  }

  return (
    <div className="flex flex-col gap-5">
      {/* Photo upload */}
      <div className="flex flex-col items-center gap-2">
        <div className="relative">
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-full border-2 border-dashed border-[#2196F3]/40 bg-[#2196F31A] transition-opacity hover:opacity-80"
          >
            {data.photo ? (
              <img src={data.photo} alt="صورة المستخدم" className="h-full w-full object-cover" />
            ) : (
              <Camera size={32} style={{ color: FORM_BLUE }} />
            )}
          </button>
          {/* Camera edit button — positioned on the right side */}
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            className="absolute bottom-0 right-0 flex h-7 w-7 items-center justify-center rounded-full border-2 border-white shadow"
            style={{ background: FORM_BLUE }}
          >
            <Camera size={13} color="white" />
          </button>
        </div>
        <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handlePhotoChange} />
        <p className="text-sm font-bold" style={{ fontFamily: FORM_FONT, color: '#1e293b' }}>
          صورة الملف الشخصي
        </p>
        <p className="text-xs" style={{ fontFamily: FORM_FONT, color: '#94A3B8' }}>
          يرجى رفع صورة واضحة
        </p>
      </div>

      {/* Full name */}
      <div className="flex flex-col gap-1.5 text-right">
        <label style={FORM_LABEL_STYLE}>
          الاسم الكامل <span style={{ color: '#F44336' }}>*</span>
        </label>
        <input
          value={data.fullName}
          onChange={(e) => onChange('fullName', e.target.value)}
          placeholder="أدخل الاسم الرباعي كاملاً"
          className={inputClass}
          style={FORM_INPUT_STYLE}
        />
      </div>

      {/* ID + Birth date */}
      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-1.5 text-right">
          <label style={FORM_LABEL_STYLE}>
            رقم الهوية <span style={{ color: '#F44336' }}>*</span>
          </label>
          <input
            value={data.idNumber}
            onChange={(e) => onChange('idNumber', e.target.value)}
            placeholder="رقم"
            className={inputClass}
            style={FORM_INPUT_STYLE}
          />
        </div>
        <div className="flex flex-col gap-1.5 text-right">
          <label style={FORM_LABEL_STYLE}>
            تاريخ الميلاد <span style={{ color: '#F44336' }}>*</span>
          </label>
          <input
            type="date"
            value={data.birthDate}
            onChange={(e) => onChange('birthDate', e.target.value)}
            className={inputClass}
            style={{ ...FORM_INPUT_STYLE, direction: 'ltr', textAlign: 'right' }}
          />
        </div>
      </div>

      {/* Current address */}
      <div className="flex flex-col gap-1.5 text-right">
        <label style={FORM_LABEL_STYLE}>
          عنوان السكن الحالي <span style={{ color: '#F44336' }}>*</span>
        </label>
        <SelectField
          value={data.currentAddress}
          onChange={(v) => onChange('currentAddress', v)}
          placeholder="الشارع والمحافظة"
          options={ADDRESS_OPTIONS}
        />
      </div>

      {/* Detailed address */}
      <div className="flex flex-col gap-1.5 text-right">
        <label style={FORM_LABEL_STYLE}>
          العنوان بالتفصيل <span style={{ color: '#F44336' }}>*</span>
        </label>
        <textarea
          value={data.detailedAddress}
          onChange={(e) => onChange('detailedAddress', e.target.value)}
          placeholder="أدخل العنوان بالتفصيل..."
          rows={3}
          className="w-full resize-none rounded-xl border-none px-3 py-2.5 text-right text-sm outline-none focus:ring-2 focus:ring-[#2196F3]/40"
          style={FORM_INPUT_STYLE}
        />
      </div>
    </div>
  )
}
