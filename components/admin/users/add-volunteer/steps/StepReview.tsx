'use client'

import { AlertCircle, CheckCircle2 } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import { FORM_BLUE, FORM_FONT, VOLUNTEER_TYPE_OPTIONS, type UpdateField, type VolunteerFormData } from '../types'

interface Props {
  data: VolunteerFormData
  onChange: UpdateField
  submitted?: boolean
}

const CARD_TITLE = {
  fontFamily: FORM_FONT,
  fontWeight: 700,
  fontSize: '17px',
  color: '#1e293b',
} as const

function InfoCol({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-1 text-right">
      <span className="text-xs font-semibold" style={{ fontFamily: FORM_FONT, color: FORM_BLUE }}>
        {label}
      </span>
      <span className="text-sm font-bold text-[#1e293b]" style={{ fontFamily: FORM_FONT }}>
        {value || '—'}
      </span>
    </div>
  )
}

function SkillChip({ label }: { label: string }) {
  return (
    <span
      className="rounded-lg px-3 py-1.5 text-sm font-semibold"
      style={{
        background: '#459F493B',
        color: '#2E7D32',
        fontFamily: FORM_FONT,
      }}
    >
      {label}
    </span>
  )
}

export default function StepReview({ data, onChange, submitted = false }: Props) {
  const { user } = useAuth()
  const today = new Date().toLocaleDateString('ar-EG', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  const skills = data.specialSkills

  const cardClass = 'rounded-xl border border-[#E8EEF5] bg-white p-5 shadow-sm'

  return (
    <div className="flex flex-col gap-4">

      {/* Card 1 — Personal info */}
      <div className={cardClass}>
        <h4 className="mb-4 text-right" style={CARD_TITLE}>المعلومات الشخصية</h4>
        <div className="grid grid-cols-2 gap-x-6 gap-y-4 sm:grid-cols-4">
          <InfoCol label="الاسم الكامل"       value={data.fullName} />
          <InfoCol label="رقم الهوية"          value={data.idNumber} />
          <InfoCol label="البريد الإلكتروني"   value={data.email} />
          <InfoCol label="رقم الجوال"          value={data.primaryPhone} />
        </div>
      </div>

      {/* Cards row */}
      <div className="flex flex-wrap items-stretch gap-4">

        {/* RIGHT — الخبرات والمهارات (grows to fill space) */}
        <div className={`${cardClass} flex-1 min-w-0`}>
          <h4 className="mb-4 text-right" style={CARD_TITLE}>الخبرات والمهارات</h4>
          <div className="flex flex-wrap gap-2">
            {skills.map((chip) => (
              <SkillChip key={chip} label={chip} />
            ))}
          </div>
          {data.workExperience && (
            <p
              className="mt-3 text-right text-sm leading-relaxed text-[#334155]"
              style={{ fontFamily: FORM_FONT }}
            >
              {data.workExperience}
            </p>
          )}
        </div>

        {/* LEFT — تفاصيل الإدارة */}
        <div className={`${cardClass} shrink-0`} style={{ minWidth: '340px' }}>
          <h4 className="mb-5 text-right" style={CARD_TITLE}>تفاصيل الإدارة</h4>
          <div className="flex items-start justify-around gap-6 px-2">
            <InfoCol label="المنطقة الجغرافية" value={data.currentAddress || '—'} />
            <InfoCol label="تاريخ الانضمام"    value={today} />
          </div>
        </div>
      </div>

      {/* Terms */}
      <label className="flex cursor-pointer items-start gap-3 text-right">
        <input
          type="checkbox"
          checked={data.agreedToTerms}
          onChange={(e) => !submitted && onChange('agreedToTerms', e.target.checked)}
          className="mt-0.5 h-4 w-4 shrink-0 accent-[#2196F3]"
        />
        <span className="flex-1 text-sm leading-relaxed text-[#334155]" style={{ fontFamily: FORM_FONT }}>
          أقر بصحة البيانات وأوافق على{' '}
          <button type="button" className="font-bold underline" style={{ color: FORM_BLUE }}>
            الشروط والأحكام
          </button>
          {' '}والالتزام ببرنامج التطوع القائم على موارد الطوارئ المهنية
        </span>
      </label>

      {/* Warning or Success */}
      {submitted ? (
        <div
          className="flex items-center gap-3 rounded-xl p-4 text-right"
          style={{ background: '#F0FDF4', border: '1.5px solid #86EFAC' }}
        >
          <CheckCircle2 size={22} className="shrink-0" color="#16A34A" />
          <p
            className="flex-1 font-bold"
            style={{ fontFamily: FORM_FONT, color: '#16A34A', fontSize: '16px' }}
          >
            تم إرسال طلبك بنجاح سيتم الرد بأسرع وقت
          </p>
        </div>
      ) : (
        <div
          className="flex items-start gap-3 rounded-xl p-4 text-right"
          style={{ background: '#FEF2F2' }}
        >
          <AlertCircle size={22} className="mt-0.5 shrink-0" color="#DC2626" />
          <p
            className="flex-1 font-bold leading-relaxed"
            style={{ fontFamily: FORM_FONT, color: '#DC2626', fontSize: '17px' }}
          >
            يرجى التأكد من دقة البيانات المدخلة قبل إرسال الطلب النهائي
          </p>
        </div>
      )}
    </div>
  )
}
