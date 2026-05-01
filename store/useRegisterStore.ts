import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { authAPI } from '@/lib/api/api'
import { saveToken } from '@/lib/api/auth'
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

  // API Call
  isSubmitting: boolean
  error: string | null
  fieldErrors: Record<string, string>
  submitRegistration: () => Promise<void>
  validateStep: (currentStep: number) => Promise<boolean>
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
            if (key === 'identityNumber' && newFieldErrors['nationalId']) delete newFieldErrors['nationalId']
          })
          return {
            formData: { ...state.formData, ...partial },
            fieldErrors: newFieldErrors,
          }
        }),

      resetRegister: () => set({ step: 1, formData: initialFormData, isSubmitting: false, error: null, fieldErrors: {} }),

      isSubmitting: false,
      error: null,
      fieldErrors: {},

      setFieldError: (field, error) => set((state) => ({ 
        fieldErrors: { ...state.fieldErrors, [field]: error } 
      })),

      clearErrors: () => set({ fieldErrors: {}, error: null }),

      validateStep: async (currentStep) => {
        set({ isSubmitting: true, error: null, fieldErrors: {} })
        const state = get()
        
        // Prepare a "validation" payload
        // We use a dummy invalid password to prevent actual registration
        // but trigger validation for other fields.
        const payload: any = {
          email: state.formData.email || 'test@test.com',
          fullName: state.formData.name || 'Test User',
          phoneNumber: state.formData.phone.startsWith('+') ? state.formData.phone : `+970${state.formData.phone.replace(/^0+/, '')}`,
          password: '1', // Invalid password to ensure registration fails but triggers validation
          role: 'resident'
        }

        if (currentStep >= 2) {
          payload.gender = state.formData.gender || 'male'
          payload.ageGroup = state.formData.age === '40+' ? 'above 40' : '18-40'
          payload.maritalStatus = state.formData.maritalStatus || 'married'
          payload.healthStatus = 
            state.formData.healthStatus === 'chronic' ? 'Chronically Ill' :
            state.formData.healthStatus === 'injured' ? 'Injured' :
            state.formData.healthStatus === 'amputated' ? 'Amputee' : 'Healthy'
          payload.nationalId = state.formData.identityNumber || '000000000'
        }

        if (currentStep >= 3) {
          payload.housingStatus = state.formData.housingStatus || 'owned'
          payload.familyMembersCount = parseInt(state.formData.currentMembers) || 1
          payload.femalesCount = parseInt(state.formData.femaleCount) || 0
          payload.malesCount = parseInt(state.formData.malesCount) || 0
          payload.region = state.formData.region || 'Gaza'
        }

        try {
          await authAPI.register(payload)
          set({ isSubmitting: false })
          return true
        } catch (err: any) {
          const messages = Array.isArray(err.message) ? err.message : [err.message]
          const fieldErrors: Record<string, string> = {}
          let hasCurrentStepErrors = false

          messages.forEach((msg: string) => {
            const m = msg.toLowerCase()
            let arabicMsg = msg

            // Translation mapping
            if (m.includes('email already exists')) arabicMsg = 'البريد الإلكتروني مستخدم بالفعل'
            if (m.includes('phone') && (m.includes('exists') || m.includes('unique'))) arabicMsg = 'رقم الجوال مستخدم بالفعل'
            if (m.includes('invalid email')) arabicMsg = 'البريد الإلكتروني غير صالح'
            if (m.includes('nationalid') || m.includes('identitynumber')) {
              if (m.includes('exists') || m.includes('unique')) arabicMsg = 'رقم الهوية مستخدم بالفعل'
              else if (m.includes('digits')) arabicMsg = 'رقم الهوية يجب أن يتكون من 9 أرقام'
              else arabicMsg = 'خطأ في رقم الهوية'
            }
            if (m.includes('password')) {
              if (m.includes('short')) arabicMsg = 'كلمة المرور قصيرة جداً'
              else arabicMsg = 'كلمة المرور يجب أن تحتوي على حروف وأرقام ورموز'
            }
            if (m.includes('fullname') || m.includes('name')) {
              if (m.includes('required')) arabicMsg = 'الاسم الكامل مطلوب'
              else arabicMsg = 'الاسم غير صالح'
            }
            if (m.includes('marital')) arabicMsg = 'يرجى اختيار الحالة الاجتماعية'
            if (m.includes('health')) arabicMsg = 'يرجى اختيار الحالة الصحية'
            if (m.includes('housing')) arabicMsg = 'يرجى اختيار حالة السكن'
            if (m.includes('region')) arabicMsg = 'يرجى تحديد المنطقة'
            if (m.includes('gender')) arabicMsg = 'يرجى اختيار الجنس'
            if (m.includes('age')) arabicMsg = 'يرجى اختيار الفئة العمرية'

            // Step 1 fields
            if (currentStep === 1) {
              if (m.includes('phone')) { fieldErrors.phone = arabicMsg; hasCurrentStepErrors = true; }
              if (m.includes('email')) { fieldErrors.email = arabicMsg; hasCurrentStepErrors = true; }
              if (m.includes('fullname') || m.includes('name')) { fieldErrors.name = arabicMsg; hasCurrentStepErrors = true; }
            }
            // Step 2 fields
            if (currentStep === 2) {
              if (m.includes('nationalid')) { fieldErrors.identityNumber = arabicMsg; hasCurrentStepErrors = true; }
              if (m.includes('marital')) { fieldErrors.maritalStatus = arabicMsg; hasCurrentStepErrors = true; }
              if (m.includes('health')) { fieldErrors.healthStatus = arabicMsg; hasCurrentStepErrors = true; }
              if (m.includes('gender')) { fieldErrors.gender = arabicMsg; hasCurrentStepErrors = true; }
              if (m.includes('age')) { fieldErrors.ageGroup = arabicMsg; hasCurrentStepErrors = true; }
            }
            // Step 3 fields
            if (currentStep === 3) {
              if (m.includes('housing')) { fieldErrors.housingStatus = arabicMsg; hasCurrentStepErrors = true; }
              if (m.includes('region')) { fieldErrors.region = arabicMsg; hasCurrentStepErrors = true; }
              if (m.includes('members')) { fieldErrors.familyMembersCount = arabicMsg; hasCurrentStepErrors = true; }
            }
          })

          set({ isSubmitting: false, fieldErrors })
          
          if (hasCurrentStepErrors) {
            toast.error('يرجى تصحيح الأخطاء المطلوبة من النظام')
            return false
          }

          return true
        }
      },

      submitRegistration: async () => {
        set({ isSubmitting: true, error: null, fieldErrors: {} })
        try {
          const state = get()
          const payload = {
            email: state.formData.email,
            password: state.formData.password,
            fullName: state.formData.name,
            phoneNumber: state.formData.phone.startsWith('+') ? state.formData.phone : `+970${state.formData.phone.replace(/^0+/, '')}`,
            gender: state.formData.gender === 'ذكر' ? 'male' : state.formData.gender,
            ageGroup: state.formData.age === '40+' ? 'above 40' : '18-40',
            maritalStatus: state.formData.maritalStatus,
            healthStatus: 
              state.formData.healthStatus === 'chronic' ? 'Chronically Ill' :
              state.formData.healthStatus === 'injured' ? 'Injured' :
              state.formData.healthStatus === 'amputated' ? 'Amputee' : 'Healthy',
            nationalId: state.formData.identityNumber,
            housingStatus: state.formData.housingStatus,
            familyMembersCount: parseInt(state.formData.currentMembers) || 1,
            femalesCount: parseInt(state.formData.femaleCount) || 0,
            malesCount: parseInt(state.formData.maleCount) || 0,
            region: state.formData.region,
            role: 'resident'
          }

          console.log('Registration Payload:', payload)
          const res = await authAPI.register(payload)
          if (res.token) {
            saveToken(res.token)
          }
          set({ isSubmitting: false, step: 6 })
        } catch (err: any) {
          console.error('Registration Error Status:', err.status)
          console.error('Registration Error Message:', err.message)
          console.error('Registration Full Error:', err)
          
          const messages = Array.isArray(err.message) ? err.message : [err.message]
          const fieldErrors: Record<string, string> = {}
          
          messages.forEach((msg: string) => {
            const m = msg.toLowerCase()
            let arabicMsg = msg

            if (m.includes('email already exists')) arabicMsg = 'البريد الإلكتروني مستخدم بالفعل'
            if (m.includes('phone') && m.includes('exists')) arabicMsg = 'رقم الجوال مستخدم بالفعل'
            if (m.includes('invalid email')) arabicMsg = 'البريد الإلكتروني غير صالح'
            if (m.includes('nationalid') || m.includes('identitynumber')) {
              if (m.includes('exists')) arabicMsg = 'رقم الهوية مستخدم بالفعل'
              else if (m.includes('digits')) arabicMsg = 'رقم الهوية يجب أن يتكون من 9 أرقام'
            }
            if (m.includes('password')) arabicMsg = 'خطأ في كلمة المرور (يجب أن تحتوي على أرقام ورموز)'

            if (m.includes('phone')) fieldErrors.phone = arabicMsg
            if (m.includes('marital')) fieldErrors.maritalStatus = arabicMsg
            if (m.includes('health')) fieldErrors.healthStatus = arabicMsg
            if (m.includes('nationalid')) fieldErrors.identityNumber = arabicMsg
            if (m.includes('fullname') || m.includes('name')) fieldErrors.name = arabicMsg
            if (m.includes('email')) fieldErrors.email = arabicMsg
            if (m.includes('password')) fieldErrors.password = arabicMsg
          })

          set({ 
            isSubmitting: false, 
            error: fieldErrors.email || fieldErrors.phone || 'حدث خطأ أثناء إنشاء الحساب',
            fieldErrors
          })

          if (messages[0]) {
            toast.error(fieldErrors.email || fieldErrors.phone || messages[0])
          }
        }
      },
    }),
    {
      name: 'register-storage',
    }
  )
)
