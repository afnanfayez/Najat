import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { authAPI } from '@/lib/api/api'
import { saveToken } from '@/lib/api/auth'

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

  // API Call
  isSubmitting: boolean
  error: string | null
  submitRegistration: () => Promise<void>
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
        set((state) => ({
          formData: { ...state.formData, ...partial },
        })),

      resetRegister: () => set({ step: 1, formData: initialFormData, isSubmitting: false, error: null }),

      isSubmitting: false,
      error: null,
      submitRegistration: async () => {
        set({ isSubmitting: true, error: null })
        try {
          const state = get()
          // Map frontend form data to backend expected format
          const payload = {
            email: state.formData.email,
            password: state.formData.password,
            fullName: state.formData.name,
            phoneNumber: state.formData.phone,
            gender: state.formData.gender === 'ذكر' ? 'male' : 'female',
            ageGroup: state.formData.age,
            maritalStatus: state.formData.maritalStatus,
            healthStatus: state.formData.healthStatus,
            nationalId: state.formData.identityNumber,
            housingStatus: state.formData.housingStatus,
            familyMembersCount: parseInt(state.formData.currentMembers) || 1,
            femalesCount: parseInt(state.formData.femaleCount) || 0,
            malesCount: parseInt(state.formData.maleCount) || 0,
            region: state.formData.region,
            role: 'resident'
          }

          const res = await authAPI.register(payload)
          if (res.token) {
            saveToken(res.token)
          }
          set({ isSubmitting: false, step: 6 }) // Move to SuccessStep
        } catch (err: any) {
          set({ isSubmitting: false, error: err.message || 'حدث خطأ أثناء إنشاء الحساب' })
        }
      },
    }),
    {
      name: 'register-storage',
    }
  )
)
