import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { createClient } from '@/lib/supabase/client'
import { mapSupabaseAuthError } from '@/lib/auth/supabaseAuthErrors'
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

function isOffline(): boolean {
  return typeof navigator !== 'undefined' && !navigator.onLine
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

      // Step 1: Submit registration with all user data and send verification code.
      // All demographic fields ride along in auth metadata so the
      // handle_new_user() trigger (supabase/migrations/0015_handle_new_user_full_profile.sql)
      // can populate the full profiles row in one shot — the user isn't
      // authenticated yet (email not confirmed), so we can't UPDATE the row
      // ourselves under RLS until after verifyAccount() signs them in.
      submitRegistration: async () => {
        if (isOffline()) {
          const msg = 'إنشاء الحساب غير متاح حالياً بدون إنترنت. يرجى الانتظار حتى يعود الاتصال.'
          set({ isSubmitting: false, error: msg })
          toast.error(msg, { id: 'register-offline-action', position: 'top-center' })
          return false
        }

        set({ isSubmitting: true, error: null, fieldErrors: {} })
        const state = get()

        if (!state.formData.password || state.formData.password.trim() === '') {
          const msg = 'كلمة المرور مطلوبة لإنشاء الحساب'
          set({
            isSubmitting: false,
            error: msg,
            step: 4,
            fieldErrors: { password: msg },
          })
          toast.error(msg)
          return false
        }

        const supabase = createClient()

        const { error } = await supabase.auth.signUp({
          email: state.formData.email,
          password: state.formData.password,
          options: {
            data: {
              full_name: state.formData.name,
              phone_number: formatPhone(state.formData.phone),
              gender: state.formData.gender,
              age_group: mapAgeGroup(state.formData.age),
              marital_status: state.formData.maritalStatus,
              health_status: mapHealthStatus(state.formData.healthStatus),
              national_id: state.formData.identityNumber,
              housing_status: state.formData.housingStatus,
              family_members_count: state.formData.currentMembers,
              females_count: state.formData.femaleCount,
              males_count: state.formData.maleCount,
              region: state.formData.region,
            },
          },
        })

        if (error) {
          const isDuplicateEmail =
            error.code === 'user_already_exists' ||
            error.message.toLowerCase().includes('already registered')
          const message = mapSupabaseAuthError(error)
          set({
            isSubmitting: false,
            error: message,
            fieldErrors: isDuplicateEmail ? { email: message } : {},
            ...(isDuplicateEmail ? { step: 1 } : {}),
          })
          toast.error(message)
          return false
        }

        set({ isSubmitting: false })
        return true
      },

      // Step 2: Verify account with the signup OTP code — this both confirms
      // the email and signs the user in (AuthContext picks up SIGNED_IN).
      verifyAccount: async (code: string) => {
        set({ isSubmitting: true, error: null, fieldErrors: {} })
        const state = get()
        const supabase = createClient()

        const { error } = await supabase.auth.verifyOtp({
          email: state.formData.email,
          token: code,
          type: 'signup',
        })

        if (error) {
          const msg = mapSupabaseAuthError(error)
          set({ isSubmitting: false, error: msg })
          return false
        }

        set({ isSubmitting: false })
        return true
      },

      // Resend code: re-sends the signup confirmation OTP.
      resendVerificationCode: async () => {
        set({ isSubmitting: true, error: null })
        const email = get().formData.email
        if (!email) {
          toast.error('البريد الإلكتروني غير موجود')
          set({ isSubmitting: false })
          return false
        }

        const supabase = createClient()
        const { error } = await supabase.auth.resend({ type: 'signup', email })
        if (error) {
          const msg = mapSupabaseAuthError(error)
          set({ isSubmitting: false, error: msg })
          toast.error(msg)
          return false
        }

        set({ isSubmitting: false })
        toast.info('تم إعادة إرسال كود التحقق')
        return true
      },
    }),
    {
      name: 'register-storage',
      // Don't persist sensitive fields to localStorage, but do NOT corrupt in-memory password
      partialize: (state) => {
        const { password, confirmPassword, ...safeFormData } = state.formData
        return {
          step: state.step,
          formData: safeFormData,
        }
      },
      merge: (persistedState, currentState) => {
        const persisted = persistedState as Partial<RegisterState> | undefined
        return {
          ...currentState,
          ...persisted,
          formData: {
            ...currentState.formData,
            ...(persisted?.formData ?? {}),
            password: currentState.formData.password || '',
            confirmPassword: currentState.formData.confirmPassword || '',
          },
        }
      },
    },
  ),
)
