'use client'

import {
  FORM_FONT,
  FORM_INPUT_STYLE,
  FORM_LABEL_STYLE,
  SECTION_TITLE_STYLE,
  type UpdateField,
  type VolunteerFormData,
} from '../types'
import VolunteerTypeSelect from '../VolunteerTypeSelect'

interface Props {
  data: VolunteerFormData
  onChange: UpdateField
}

const inputClass =
  'h-11 w-full rounded-xl border-none px-3 text-right text-sm outline-none focus:ring-2 focus:ring-[#2196F3]/40'
const selectClass =
  'h-11 w-full appearance-none rounded-xl border-none px-3 text-right text-sm outline-none focus:ring-2 focus:ring-[#2196F3]/40'

export default function StepContactInfo({ data, onChange }: Props) {
  return (
    <div className="flex flex-col gap-6">
      {/* Volunteer type */}
      <section className="flex flex-col gap-3 text-right">
        <div>
          <h3 style={SECTION_TITLE_STYLE}>نوع التطوع</h3>
          <p className="mt-1 text-xs" style={{ fontFamily: FORM_FONT, color: '#94A3B8' }}>
            بمكنك اختيار أكثر من نوع بناءً على خبرتك
          </p>
        </div>
        <VolunteerTypeSelect
          selected={data.volunteerTypes}
          onChange={(values) => onChange('volunteerTypes', values)}
        />
      </section>

      {/* Contact info */}
      <section className="flex flex-col gap-4 text-right">
        <div>
          <h3 style={SECTION_TITLE_STYLE}>بيانات التواصل</h3>
          <p className="mt-1 text-xs" style={{ fontFamily: FORM_FONT, color: '#94A3B8' }}>
            كيف يمكننا الوصول إليك؟
          </p>
        </div>

        {/* Primary + Backup phone */}
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <label style={FORM_LABEL_STYLE}>
              رقم الجوال الأساسي <span style={{ color: '#F44336' }}>*</span>
            </label>
            <input
              value={data.primaryPhone}
              onChange={(e) => onChange('primaryPhone', e.target.value)}
              placeholder="05XXXXXXXX"
              type="tel"
              className={inputClass}
              style={{ ...FORM_INPUT_STYLE, direction: 'ltr', textAlign: 'right' }}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label style={FORM_LABEL_STYLE}>رقم جوال احتياطي</label>
            <input
              value={data.backupPhone}
              onChange={(e) => onChange('backupPhone', e.target.value)}
              placeholder="05XXXXXXXX"
              type="tel"
              className={inputClass}
              style={{ ...FORM_INPUT_STYLE, direction: 'ltr', textAlign: 'right' }}
            />
          </div>
        </div>

        {/* Email */}
        <div className="flex flex-col gap-1.5">
          <label style={FORM_LABEL_STYLE}>
            البريد الإلكتروني <span style={{ color: '#F44336' }}>*</span>
          </label>
          <input
            value={data.email}
            onChange={(e) => onChange('email', e.target.value)}
            placeholder="example@email.com"
            type="email"
            className={inputClass}
            style={{ ...FORM_INPUT_STYLE, direction: 'ltr', textAlign: 'right' }}
          />
        </div>

        {/* Social media */}
        <div className="flex flex-col gap-1.5">
          <label style={FORM_LABEL_STYLE}>حسابات التواصل الاجتماعي</label>
          <input
            value={data.socialMedia}
            onChange={(e) => onChange('socialMedia', e.target.value)}
            placeholder="ساعدنا في معرفة نشاطك الاجتماعي بشكل أفضل"
            className={inputClass}
            style={FORM_INPUT_STYLE}
          />
        </div>
      </section>
    </div>
  )
}
