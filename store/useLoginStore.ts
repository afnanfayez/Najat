import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { authAPI } from '@/lib/api/api'
import { saveToken } from '@/lib/api/auth'

// ─── Types ────────────────────────────────────────────────────────────────────

interface LoginState {
  // Form values
  email: string
  password: string

  // UI states
  showPassword: boolean
  isSubmitting: boolean
  isSuccess: boolean
  isError: boolean
  isForgot: boolean
  isCodeSent: boolean
  isResetting: boolean
  emailError: boolean
  passwordError: boolean

  // Derived
  isValid: boolean

  // Actions
  setEmail: (email: string) => void
  setPassword: (password: string) => void
  setShowPassword: (show: boolean) => void
  setIsSubmitting: (v: boolean) => void
  setIsSuccess: (v: boolean) => void
  setIsError: (v: boolean) => void
  setIsForgot: (v: boolean) => void
  setIsCodeSent: (v: boolean) => void
  setIsResetting: (v: boolean) => void
  setEmailError: (v: boolean) => void
  setPasswordError: (v: boolean) => void

  // Composite actions
  handleForgotClick: () => void
  handleLoginSuccess: () => void
  handleLoginFailure: (emailErr: boolean, passErr: boolean) => void
  verifyCode: (code: string) => Promise<void>
  resetLogin: () => void
}

// ─── Store ────────────────────────────────────────────────────────────────────

export const useLoginStore = create<LoginState>()(
  persist(
    (set, get) => ({
      // Initial values
      email: '',
      password: '',
      showPassword: false,
      isSubmitting: false,
      isSuccess: false,
      isError: false,
      isForgot: false,
      isCodeSent: false,
      isResetting: false,
      emailError: false,
      passwordError: false,

      // Derived — computed on-the-fly via getter
      get isValid() {
        const { email, password } = get()
        return email.includes('@') && password.length >= 8
      },

      // Basic setters
      setEmail: (email) =>
        set({ email, isValid: email.includes('@') && get().password.length >= 8 } as any),
      setPassword: (password) =>
        set({ password, isValid: get().email.includes('@') && password.length >= 8 } as any),
      setShowPassword: (showPassword) => set({ showPassword }),
      setIsSubmitting: (isSubmitting) => set({ isSubmitting }),
      setIsSuccess: (isSuccess) => set({ isSuccess }),
      setIsError: (isError) => set({ isError }),
      setIsForgot: (isForgot) => set({ isForgot }),
      setIsCodeSent: (isCodeSent) => set({ isCodeSent }),
      setIsResetting: (isResetting) => set({ isResetting }),
      setEmailError: (emailError) => set({ emailError }),
      setPasswordError: (passwordError) => set({ passwordError }),

      // Composite: navigate to forgot password
      handleForgotClick: () =>
        set({
          isForgot: true,
          isError: false,
          isSuccess: false,
          isCodeSent: false,
          isResetting: false,
        }),

      // Composite: successful login → make API call
      handleLoginSuccess: async () => {
        const { email, password } = get()
        set({ isSubmitting: true, isError: false, emailError: false, passwordError: false })
        try {
          const res = await authAPI.login({ email, password })
          if (res.token) {
            saveToken(res.token)
          }
          set({
            isSuccess: true,
            isSubmitting: false,
          })
        } catch (err: any) {
          set({
            isError: true,
            emailError: true,
            passwordError: true,
            isSubmitting: false,
          })
        }
      },

      // Composite: failed login → show error state
      handleLoginFailure: (emailErr, passErr) =>
        set({
          emailError: emailErr,
          passwordError: passErr,
          isError: true,
          isSuccess: false,
        }),

      // Verify code
      verifyCode: async (code: string) => {
        const { email } = get()
        set({ isSubmitting: true, isError: false })
        try {
          await authAPI.verify({ email, code })
          set({
            isCodeSent: false,
            isResetting: true,
            isSubmitting: false,
          })
        } catch (err: any) {
          set({
            isError: true,
            isSubmitting: false,
          })
          throw err
        }
      },

      // Reset entire login flow
      resetLogin: () =>
        set({
          email: '',
          password: '',
          showPassword: false,
          isSubmitting: false,
          isSuccess: false,
          isError: false,
          isForgot: false,
          isCodeSent: false,
          isResetting: false,
          emailError: false,
          passwordError: false,
        }),
    }),
    {
      name: 'login-storage',
      partialize: (state) => ({ email: state.email }), // Only persist the email for security
    }
  )
)
