import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { authAPI } from '@/lib/api/api'
import { extractAuthPayload } from '@/lib/api/extractAuth'
import { saveToken } from '@/lib/api/auth'
import { notifyAuthSessionChanged } from '@/lib/auth/authEvents'
import { resetBrowserSession } from '@/lib/auth/resetBrowserSession'
import { saveUserRole } from '@/lib/auth/sessionRole'
import { toast } from 'sonner'

// ─── Types ────────────────────────────────────────────────────────────────────

export interface RegisterFormData {
  name: string
  phone: string
  email: string
  gender: string
  age: string
  maritalStatus: string
  healthStatus: string
  identityNumber: string
  housingStatus: string
  currentMembers: string
  maleCount: string
  femaleCount: string
  region: string
  password: string
  confirmPassword: string
  rememberMe: boolean
}

interface RegisterState {
  step: number
  formData: RegisterFormData

  // Step navigation
  nextStep: () => void
  prevStep: () => void
  goToStep: (step: number) => void

  // Form data updater
  updateFormData: (partial: Partial<RegisterFormData>) => void

  // Reset
  resetRegister: () => void

  // API Call — only used at the FINAL submit (Step 5 / TermsStep)
  isSubmitting: boolean
  error: string | null
  fieldErrors: Record<string, string>
  submitRegistration: () => Promise<boolean>
  verifyAccount: (code: string) => Promise<boolean>
  resendVerificationCode: () => Promise<boolean>
  setFieldError: (field: string, error: string) => void
  clearErrors: () => void
}

// ─── Initial form data ────────────────────────────────────────────────────────

const initialFormData: RegisterFormData = {
  name: '',
  phone: '',
  email: '',
  gender: '',
  age: '',
  maritalStatus: '',
  healthStatus: '',
  identityNumber: '',
  housingStatus: '',
  currentMembers: '',
  maleCount: '',
  femaleCount: '',
  region: '',
  password: '',
  confirmPassword: '',
  rememberMe: false,
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function mapAgeGroup(age: string): string {
  switch (age) {
    case '40+':
      return 'above 40'
    case 'under-18':
      return 'under 18'
    case '18-40':
    default:
      return '18-40'
  }
}

function mapHealthStatus(status: string): string {
  switch (status) {
    case 'chronic':
      return 'Chronically Ill'
    case 'injured':
      return 'Injured'
    case 'amputated':
      return 'Amputee'
    case 'good':
    default:
      return 'Healthy'
  }
}

function formatPhone(phone: string): string {
  return phone.startsWith('+') ? phone : `+970${phone.replace(/^0+/, '')}`
}

/**
 * Parse backend error messages and map them to form field keys + Arabic messages.
 * Returns { fieldErrors, generalError } so the caller can decide what to display.
 */
function parseRegistrationErrors(err: any): {
  fieldErrors: Record<string, string>
  generalError: string
  /** Suggest which step the user should be sent back to */
  errorStep: number | null
} {
  const messages: string[] = Array.isArray(err.message)
    ? err.message
    : [err.message ?? 'حدث خطأ غير متوقع']
  const fieldErrors: Record<string, string> = {}
  let errorStep: number | null = null

  messages.forEach((msg: string) => {
    const m = msg.toLowerCase()
    let arabicMsg = msg

    // ── Translate known error patterns ──
    if (
      m.includes('email already exists') ||
      (m.includes('email') &&
        (m.includes('exists') ||
          m.includes('unique') ||
          m.includes('taken') ||
          m.includes('duplicate')))
    ) {
      arabicMsg = 'البريد الإلكتروني مستخدم بالفعل'
    }
    if (
      m.includes('phone') &&
      (m.includes('exists') ||
        m.includes('unique') ||
        m.includes('taken') ||
        m.includes('duplicate'))
    ) {
      arabicMsg = 'رقم الجوال مستخدم بالفعل'
    }
    if (m.includes('invalid email')) arabicMsg = 'البريد الإلكتروني غير صالح'
    if (
      m.includes('nationalid') ||
      m.includes('identitynumber') ||
      m.includes('national_id')
    ) {
      if (
        m.includes('exists') ||
        m.includes('unique') ||
        m.includes('taken') ||
        m.includes('duplicate')
      )
        arabicMsg = 'رقم الهوية مستخدم بالفعل'
      else if (m.includes('digits'))
        arabicMsg = 'رقم الهوية يجب أن يتكون من 9 أرقام'
      else arabicMsg = 'خطأ في رقم الهوية'
    }
    if (m.includes('password')) {
      if (m.includes('short') || m.includes('min') || m.includes('least'))
        arabicMsg = 'كلمة المرور قصيرة جداً'
      else arabicMsg = 'كلمة المرور يجب أن تحتوي على حروف وأرقام ورموز'
    }
    if (
      (m.includes('fullname') || m.includes('full_name')) &&
      !m.includes('password')
    ) {
      if (m.includes('required')) arabicMsg = 'الاسم الكامل مطلوب'
      else arabicMsg = 'الاسم غير صالح'
    }
    if (m.includes('marital')) arabicMsg = 'يرجى اختيار الحالة الاجتماعية'
    if (m.includes('health')) arabicMsg = 'يرجى اختيار الحالة الصحية'
    if (m.includes('housing')) arabicMsg = 'يرجى اختيار حالة السكن'
    if (m.includes('region')) arabicMsg = 'يرجى تحديد المنطقة'
    if (m.includes('gender')) arabicMsg = 'يرجى اختيار الجنس'
    if (m.includes('age')) arabicMsg = 'يرجى اختيار الفئة العمرية'

    // ── Map to field keys + determine which step ──
    // Step 1 fields
    if (m.includes('email')) {
      fieldErrors.email = arabicMsg
      if (!errorStep || errorStep > 1) errorStep = 1
    }
    if (m.includes('phone') || m.includes('mobile')) {
      fieldErrors.phone = arabicMsg
      if (!errorStep || errorStep > 1) errorStep = 1
    }
    if (
      (m.includes('fullname') ||
        m.includes('full_name') ||
        (m.includes('name') && !m.includes('username'))) &&
      !m.includes('password')
    ) {
      fieldErrors.name = arabicMsg
      if (!errorStep || errorStep > 1) errorStep = 1
    }

    // Step 2 fields
    if (
      m.includes('nationalid') ||
      m.includes('national_id') ||
      m.includes('identitynumber')
    ) {
      fieldErrors.identityNumber = arabicMsg
      if (!errorStep || errorStep > 2) errorStep = 2
    }
    if (m.includes('marital')) {
      fieldErrors.maritalStatus = arabicMsg
      if (!errorStep || errorStep > 2) errorStep = 2
    }
    if (m.includes('health')) {
      fieldErrors.healthStatus = arabicMsg
      if (!errorStep || errorStep > 2) errorStep = 2
    }
    if (m.includes('gender')) {
      fieldErrors.gender = arabicMsg
      if (!errorStep || errorStep > 2) errorStep = 2
    }
    if (m.includes('age')) {
      fieldErrors.ageGroup = arabicMsg
      if (!errorStep || errorStep > 2) errorStep = 2
    }

    // Step 3 fields
    if (m.includes('housing')) {
      fieldErrors.housingStatus = arabicMsg
      if (!errorStep || errorStep > 3) errorStep = 3
    }
    if (m.includes('region')) {
      fieldErrors.region = arabicMsg
      if (!errorStep || errorStep > 3) errorStep = 3
    }
    if (m.includes('members') || m.includes('family')) {
      fieldErrors.familyMembersCount = arabicMsg
      if (!errorStep || errorStep > 3) errorStep = 3
    }

    // Step 4 fields
    if (m.includes('password')) {
      fieldErrors.password = arabicMsg
      if (!errorStep || errorStep > 4) errorStep = 4
    }
  })

  const generalError =
    fieldErrors.email ||
    fieldErrors.phone ||
    fieldErrors.name ||
    fieldErrors.identityNumber ||
    fieldErrors.password ||
    'حدث خطأ أثناء إنشاء الحساب'

  return { fieldErrors, generalError, errorStep }
}

// ─── Store ────────────────────────────────────────────────────────────────────

export const useRegisterStore = create<RegisterState>()(
  persist(
    (set, get) => ({
      step: 1,
      formData: initialFormData,

      nextStep: () => set((state) => ({ step: state.step + 1 })),
      prevStep: () => set((state) => ({ step: Math.max(1, state.step - 1) })),
      goToStep: (step) => set({ step }),

      updateFormData: (partial) =>
        set((state) => {
          const newFieldErrors = { ...state.fieldErrors }
          Object.keys(partial).forEach((key) => {
            if (newFieldErrors[key]) {
              delete newFieldErrors[key]
            }
            // Handle special cases where field name in state doesn't match error key perfectly
            if (key === 'identityNumber' && newFieldErrors['nationalId'])
              delete newFieldErrors['nationalId']
          })
          return {
            formData: { ...state.formData, ...partial },
            fieldErrors: newFieldErrors,
          }
        }),

      resetRegister: () =>
        set({
          step: 1,
          formData: initialFormData,
          isSubmitting: false,
          error: null,
          fieldErrors: {},
        }),

      isSubmitting: false,
      error: null,
      fieldErrors: {},

      setFieldError: (field, error) =>
        set((state) => ({
          fieldErrors: { ...state.fieldErrors, [field]: error },
        })),

      clearErrors: () => set({ fieldErrors: {}, error: null }),

      // Step 1: Submit registration with all user data and send verification code
      submitRegistration: async () => {
        if (typeof navigator !== 'undefined' && !navigator.onLine) {
          const msg = 'إنشاء الحساب غير متاح حالياً بدون إنترنت. يرجى الانتظار حتى يعود الاتصال.'
          set({ isSubmitting: false, error: msg })
          toast.error(msg, { id: 'register-offline-action', position: 'top-center' })
          return false
        }

        set({ isSubmitting: true, error: null, fieldErrors: {} })
        try {
          const state = get()
          const payload = {
            email: state.formData.email,
            password: state.formData.password,
            fullName: state.formData.name,
            phoneNumber: formatPhone(state.formData.phone),
            gender: state.formData.gender,
            ageGroup: mapAgeGroup(state.formData.age),
            maritalStatus: state.formData.maritalStatus,
            healthStatus: mapHealthStatus(state.formData.healthStatus),
            nationalId: state.formData.identityNumber,
            housingStatus: state.formData.housingStatus,
            familyMembersCount: parseInt(state.formData.currentMembers) || 1,
            femalesCount: parseInt(state.formData.femaleCount) || 0,
            malesCount: parseInt(state.formData.maleCount) || 0,
            region: state.formData.region,
            role: 'resident',
          }

          const res = await authAPI.register(payload)
          const { token, role: authRole } = extractAuthPayload(res)
          if (token) {
            resetBrowserSession()
            saveToken(token)
            notifyAuthSessionChanged()
          }
          const role = authRole ?? (res as { role?: string })?.role
          saveUserRole(typeof role === 'string' ? role : 'resident')
          set({ isSubmitting: false })
          return true
        } catch (err: any) {
          const { fieldErrors, generalError, errorStep } =
            parseRegistrationErrors(err)

          set({
            isSubmitting: false,
            error: generalError,
            fieldErrors,
            ...(errorStep ? { step: errorStep } : {}),
          })

          toast.error(generalError)
          return false
        }
      },

      // Step 2: Verify account with code
      verifyAccount: async (code: string) => {
        set({ isSubmitting: true, error: null, fieldErrors: {} })
        try {
          const state = get()
          const payload = {
            email: state.formData.email,
            code: code,
          }
          const res = await authAPI.verify(payload)
          const { token, role: authRole } = extractAuthPayload(res)
          if (token) {
            resetBrowserSession()
            saveToken(token)
            notifyAuthSessionChanged()
          }
          const role =
            authRole ??
            (res as { role?: string })?.role ??
            (res as { user?: { role?: string } })?.user?.role
          if (typeof role === 'string') {
            saveUserRole(role)
          }
          set({ isSubmitting: false })
          return true
        } catch (err: any) {
          const errorMsg = err?.message || 'الكود غير صحيح أو انتهت صلاحيته'
          set({ isSubmitting: false, error: errorMsg })
          return false
        }
      },

      // Resend code: Send verification code again using the stored email
      resendVerificationCode: async () => {
        set({ isSubmitting: true, error: null })
        try {
          const email = get().formData.email
          if (!email) {
            toast.error('البريد الإلكتروني غير موجود')
            set({ isSubmitting: false })
            return false
          }
          // Use forgotPassword endpoint to resend code (it works for both scenarios)
          await authAPI.forgotPassword({ email })
          set({ isSubmitting: false })
          toast.info('تم إعادة إرسال كود التحقق')
          return true
        } catch (err: any) {
          const msg = err?.message ?? 'حدث خطأ أثناء إعادة إرسال الكود'
          set({ isSubmitting: false, error: msg })
          toast.error(msg)
          return false
        }
      },
    }),
    {
      name: 'register-storage',
      // Don't persist sensitive fields to localStorage
      partialize: (state) => ({
        step: state.step,
        formData: {
          ...state.formData,
          password: '',
          confirmPassword: '',
        },
      }),
    },
  ),
)
