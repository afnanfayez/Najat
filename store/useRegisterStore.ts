import { create } from 'zustand'

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

export const useRegisterStore = create<RegisterState>((set, get) => ({
  step: 1,
  formData: initialFormData,

  nextStep: () => set((state) => ({ step: state.step + 1 })),
  prevStep: () => set((state) => ({ step: Math.max(1, state.step - 1) })),
  goToStep: (step) => set({ step }),

  updateFormData: (partial) =>
    set((state) => ({
      formData: { ...state.formData, ...partial },
    })),

  resetRegister: () => set({ step: 1, formData: initialFormData }),
}))
