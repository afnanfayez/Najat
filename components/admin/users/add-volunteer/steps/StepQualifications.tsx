'use client'

import {
  FORM_BLUE,
  FORM_FONT,
  FORM_INPUT_STYLE,
  FORM_LABEL_STYLE,
  QUALIFICATION_OPTIONS,
  SECTION_TITLE_STYLE,
  type UpdateField,
  type VolunteerFormData,
} from '../types'

interface Props {
  data: VolunteerFormData
  onChange: UpdateField
}

const inputClass =
  'h-11 w-full rounded-xl border-none px-3 text-right text-sm outline-none focus:ring-2 focus:ring-[#2196F3]/40'
const selectClass =
  'h-11 w-full appearance-none rounded-xl border-none px-3 text-right text-sm outline-none focus:ring-2 focus:ring-[#2196F3]/40'
const textareaClass =
  'w-full resize-none rounded-xl border-none px-3 py-2.5 text-right text-sm outline-none focus:ring-2 focus:ring-[#2196F3]/40'

export default function StepQualifications({ data, onChange }: Props) {
  return (
    <div className="flex flex-col gap-6">
      {/* Academic qualifications */}
      <section className="flex flex-col gap-4 text-right">
        <h3 style={SECTION_TITLE_STYLE}>المؤهلات الأكاديمية</h3>

        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <label style={FORM_LABEL_STYLE}>
              المؤهل العلمي <span style={{ color: '#F44336' }}>*</span>
            </label>
            <div className="relative">
              <select
                value={data.academicQualification}
                onChange={(e) => onChange('academicQualification', e.target.value)}
                className={selectClass}
                style={FORM_INPUT_STYLE}
              >
                <option value="">بكالوريوس</option>
                {QUALIFICATION_OPTIONS.map((opt) => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
              <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#94A3B8]">▾</span>
            </div>
          </div>
          <div className="flex flex-col gap-1.5">
            <label style={FORM_LABEL_STYLE}>التخصص العلمي</label>
            <input
              value={data.specialization}
              onChange={(e) => onChange('specialization', e.target.value)}
              placeholder="مثال: طب بشري، هندسة..."
              className={inputClass}
              style={FORM_INPUT_STYLE}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <label style={FORM_LABEL_STYLE}>الجامعة / المعهد</label>
            <input
              value={data.university}
              onChange={(e) => onChange('university', e.target.value)}
              placeholder="اسم المؤسسة التعليمية"
              className={inputClass}
              style={FORM_INPUT_STYLE}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label style={FORM_LABEL_STYLE}>سنة التخرج</label>
            <input
              value={data.graduationYear}
              onChange={(e) => onChange('graduationYear', e.target.value)}
              placeholder="2024"
              type="number"
              min="1970"
              max="2030"
              className={inputClass}
              style={{ ...FORM_INPUT_STYLE, direction: 'ltr', textAlign: 'right' }}
            />
          </div>
        </div>
      </section>

      {/* Previous experience */}
      <section className="flex flex-col gap-4 text-right">
        <h3 style={SECTION_TITLE_STYLE}>الخبرات السابقة</h3>

        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <label style={FORM_LABEL_STYLE}>تطوع سابق</label>
            <p className="text-xs" style={{ fontFamily: FORM_FONT, color: '#94A3B8' }}>
              هل سبق لك التطوع في مجالات مشابهة؟
            </p>
            <div className="relative">
              <select
                value={data.previousVolunteering}
                onChange={(e) => onChange('previousVolunteering', e.target.value)}
                className={selectClass}
                style={FORM_INPUT_STYLE}
              >
                <option value="">اختر</option>
                <option value="نعم">نعم</option>
                <option value="لا">لا</option>
              </select>
              <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#94A3B8]">▾</span>
            </div>
          </div>
          <div className="flex flex-col gap-1.5">
            <label style={FORM_LABEL_STYLE}>الخبرة المهنية</label>
            <textarea
              value={data.workExperience}
              onChange={(e) => onChange('workExperience', e.target.value)}
              placeholder="اذكر خبراتك المهنية السابقة..."
              rows={3}
              className={textareaClass}
              style={FORM_INPUT_STYLE}
            />
          </div>
        </div>
      </section>

      {/* Special skills */}
      <section className="flex flex-col gap-4 text-right">
        <h3 style={SECTION_TITLE_STYLE}>المهارات الخاصة</h3>

        <div className="flex flex-col gap-1.5">
          <label style={FORM_LABEL_STYLE}>المهارات الخاصة</label>
          <input
            value={data.specialSkills}
            onChange={(e) => onChange('specialSkills', e.target.value)}
            placeholder="مثال: الإسعافات الأولية، التمريض، إدارة الكوارث..."
            className={inputClass}
            style={FORM_INPUT_STYLE}
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label style={FORM_LABEL_STYLE}>الدورات التدريبية</label>
          <input
            value={data.trainingCourses}
            onChange={(e) => onChange('trainingCourses', e.target.value)}
            placeholder="اذكر الدورات التدريبية التي أتممتها..."
            className={inputClass}
            style={FORM_INPUT_STYLE}
          />
        </div>
      </section>

      {/* Info box */}
      <div
        className="rounded-xl p-4 text-right"
        style={{ background: `${FORM_BLUE}15`, border: `1px solid ${FORM_BLUE}30` }}
      >
        <p className="mb-1 text-sm font-bold" style={{ fontFamily: FORM_FONT, color: FORM_BLUE }}>
          لماذا هذه البيانات؟
        </p>
        <p className="text-xs leading-relaxed" style={{ fontFamily: FORM_FONT, color: '#334155' }}>
          تساعدنا هذه المعلومات في توجيهك للمهام التي تناسب خبراتك العلمية والعملية لضمان أفضل استجابة.
        </p>
      </div>
    </div>
  )
}
