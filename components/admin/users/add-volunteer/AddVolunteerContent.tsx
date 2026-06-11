'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import AdminShell from '@/components/admin/AdminShell'
import {
  createVolunteerFromForm,
  getVolunteerCreateErrorMessage,
  validateVolunteerFormForApi,
} from '@/components/admin/data/adminVolunteerService'
import {
  ADMIN_PAGE_SUBTITLE_STYLE,
  ADMIN_PAGE_TITLE_STYLE,
} from '@/components/admin/layout/adminLayoutStyles'
import AddVolunteerProgress from './AddVolunteerProgress'
import StepPersonalInfo from './steps/StepPersonalInfo'
import StepContactInfo from './steps/StepContactInfo'
import StepQualifications from './steps/StepQualifications'
import StepReview from './steps/StepReview'
import { clearDraft, loadDraft, saveDraft } from './draftService'
import {
  FORM_BLUE,
  FORM_FONT,
  INITIAL_FORM_DATA,
  TOTAL_STEPS,
  type UpdateField,
  type VolunteerFormData,
} from './types'

const REQUIRED: Record<number, (keyof VolunteerFormData)[]> = {
  1: ['fullName', 'idNumber', 'birthDate', 'currentAddress', 'detailedAddress'],
  2: ['primaryPhone', 'email'],
  3: ['academicQualification'],
  4: ['agreedToTerms'],
}

export default function AddVolunteerContent() {
  const router = useRouter()
  const queryClient = useQueryClient()
  const [initialDraft] = useState(() => loadDraft())
  const [step, setStep] = useState(() => initialDraft?.step ?? 1)
  const [formData, setFormData] = useState<VolunteerFormData>(
    () => initialDraft?.data ?? INITIAL_FORM_DATA,
  )
  const [validationError, setValidationError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [savingDraft, setSavingDraft] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  // Restore draft on mount
  useEffect(() => {
    if (initialDraft) {
      toast.info('تم استعادة المسودة المحفوظة مسبقاً')
    }
  }, [initialDraft])

  const updateField: UpdateField = (key, value) => {
    setFormData((prev) => ({ ...prev, [key]: value }))
    setValidationError(null)
  }

  function validate(currentStep: number): boolean {
    const required = REQUIRED[currentStep] ?? []
    for (const field of required) {
      const val = formData[field]
      if (val === '' || val === null || val === false) {
        setValidationError('يرجى ملء جميع الحقول المطلوبة')
        return false
      }
    }
    if (currentStep === 1 || currentStep === 4) {
      const apiError = validateVolunteerFormForApi(formData)
      if (apiError) {
        setValidationError(apiError)
        return false
      }
    }
    return true
  }

  function handleNext() {
    if (!validate(step)) return
    setValidationError(null)
    setStep((s) => Math.min(s + 1, TOTAL_STEPS))
  }

  function handleBack() {
    setValidationError(null)
    setStep((s) => Math.max(s - 1, 1))
  }

  async function handleSaveDraft() {
    setSavingDraft(true)
    try {
      await saveDraft(formData, step)
      toast.success('تم حفظ المسودة بنجاح')
    } catch {
      toast.error('تعذّر حفظ المسودة')
    } finally {
      setSavingDraft(false)
    }
  }

  async function handleSubmit() {
    if (!validate(4)) return
    setSubmitting(true)
    try {
      const result = await createVolunteerFromForm(formData)
      await queryClient.invalidateQueries({ queryKey: ['admin-users'] })
      clearDraft()
      setSubmitted(true)
      toast.success(`تم إنشاء حساب المتطوع. كلمة المرور المؤقتة: ${result.temporaryPassword}`)
    } catch (err: unknown) {
      const message = getVolunteerCreateErrorMessage(err)
      setValidationError(message)
      toast.error(message)
    } finally {
      setSubmitting(false)
    }
  }

  const secondaryBtnClass =
    'flex h-11 items-center gap-2 rounded-xl border border-[#E8EEF5] bg-white px-6 text-sm font-bold text-[#64748B] transition-colors hover:bg-[#F8FAFC] disabled:opacity-60'
  const primaryBtnClass =
    'flex h-11 items-center gap-2 rounded-xl px-8 text-sm font-bold text-white transition-opacity hover:opacity-90 disabled:opacity-60'

  return (
    <AdminShell activeNav="users">
      <div dir="rtl">
        {/* Back button — same style as AdminAlertsBackButton */}
        <button
          type="button"
          onClick={() => router.push('/admin/users')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            color: '#2196F3',
            fontFamily: FORM_FONT,
            fontWeight: 700,
            fontSize: '15px',
            padding: '4px 0',
            marginBottom: '16px',
            direction: 'ltr',
            width: 'fit-content',
          }}
        >
          رجوع
          <span style={{ fontSize: '20px', lineHeight: 1 }}>›</span>
        </button>

        {/* Page title — same styles as alerts page */}
        <div className="mb-6" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <h1 style={ADMIN_PAGE_TITLE_STYLE}>تسجيل الكوادر الجديدة</h1>
          <p style={{ ...ADMIN_PAGE_SUBTITLE_STYLE, color: '#000000' }}>
            يرجى ملء البيانات التالية للانضمام إلى فريق الاستجابة وإدارة الأزمات
          </p>
        </div>

        {/* Progress */}
        <AddVolunteerProgress step={step} />

        <hr className="mb-6 border-[#F1F5F9]" />

        {/* Step content */}
        {step === 1 && <StepPersonalInfo data={formData} onChange={updateField} />}
        {step === 2 && <StepContactInfo data={formData} onChange={updateField} />}
        {step === 3 && <StepQualifications data={formData} onChange={updateField} />}
        {step === 4 && <StepReview data={formData} onChange={updateField} submitted={submitted} />}

        {validationError && (
          <p className="mt-4 text-right text-sm text-[#F44336]" style={{ fontFamily: FORM_FONT }}>
            {validationError}
          </p>
        )}

        {/* Navigation */}
        <div className="mt-8 flex items-center justify-between">

          {/* RIGHT side — primary action */}
          {submitted ? (
            <button
              type="button"
              onClick={() => router.push('/admin/users')}
              className={primaryBtnClass}
              style={{ background: FORM_BLUE, fontFamily: FORM_FONT }}
            >
              الرجوع للوحة التحكم
            </button>
          ) : step < TOTAL_STEPS ? (
            <button
              type="button"
              onClick={handleNext}
              className={primaryBtnClass}
              style={{ background: FORM_BLUE, fontFamily: FORM_FONT }}
            >
              الخطوة التالية
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSubmit}
              disabled={submitting}
              className={primaryBtnClass}
              style={{ background: FORM_BLUE, fontFamily: FORM_FONT }}
            >
              {submitting ? 'جاري الإرسال...' : 'إرسال الطلب'}
            </button>
          )}

          {/* LEFT side — secondary action (hidden after submit) */}
          {!submitted && step === 1 ? (
            <button
              type="button"
              onClick={handleSaveDraft}
              disabled={savingDraft}
              className={secondaryBtnClass}
              style={{ fontFamily: FORM_FONT }}
            >
              {savingDraft ? 'جاري الحفظ...' : 'حفظ كمسودة'}
            </button>
          ) : !submitted ? (
            <button
              type="button"
              onClick={handleBack}
              className={secondaryBtnClass}
              style={{ fontFamily: FORM_FONT }}
            >
              الخطوة السابقة
            </button>
          ) : (
            <span />
          )}
        </div>
      </div>
    </AdminShell>
  )
}
