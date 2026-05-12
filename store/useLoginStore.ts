import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { authAPI } from '@/lib/api/api'
import { extractAuthPayload } from '@/lib/api/extractAuth'
import { saveToken } from '@/lib/api/auth'
import { saveUserRole } from '@/lib/auth/sessionRole'
import { toast } from 'sonner'

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

  // Forgot password flow
  forgotEmail: string
  forgotCode: string
  forgotError: string | null

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
  sendForgotPasswordCode: (email: string) => Promise<boolean>
  verifyForgotCode: (code: string) => Promise<boolean>
  resetPasswordWithCode: (newPassword: string) => Promise<boolean>
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

      // Forgot password flow
      forgotEmail: '',
      forgotCode: '',
      forgotError: null,

      // Derived — computed on-the-fly via getter
      get isValid() {
        const { email, password } = get()
        return email.includes('@') && password.length >= 8
      },

      // Basic setters
      setEmail: (email) =>
        set({
          email,
          isValid: email.includes('@') && get().password.length >= 8,
        } as any),
      setPassword: (password) =>
        set({
          password,
          isValid: get().email.includes('@') && password.length >= 8,
        } as any),
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
          forgotEmail: '',
          forgotCode: '',
          forgotError: null,
        }),

      // Composite: successful login → make API call
      handleLoginSuccess: async () => {
        const { email, password } = get()
        set({
          isSubmitting: true,
          isError: false,
          emailError: false,
          passwordError: false,
        })
        try {
          const res = await authAPI.login({ email, password })
          const { token, role } = extractAuthPayload(res)
          if (!token) {
            throw new Error('لم يتم استلام رمز الدخول من الخادم')
          }
          saveToken(token)
          if (typeof role === 'string') {
            saveUserRole(role)
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

      // ─── Forgot Password Flow ──────────────────────────────────────────

      /**
       * Step 1: Send a password reset code to the user's email.
       * POST /v1/auth/forgot-password { email }
       */
      sendForgotPasswordCode: async (email: string) => {
        set({ isSubmitting: true, forgotError: null })
        try {
          await authAPI.forgotPassword({ email })
          set({
            forgotEmail: email,
            isCodeSent: true,
            isSubmitting: false,
          })
          toast.success('تم إرسال رمز الاستعادة إلى بريدك الإلكتروني')
          return true
        } catch (err: any) {
          const msg = err?.message ?? 'حدث خطأ أثناء إرسال الرمز'
          set({
            forgotError:
              typeof msg === 'string' ? msg : 'حدث خطأ أثناء إرسال الرمز',
            isSubmitting: false,
          })
          toast.error(msg)
          return false
        }
      },

      /**
       * Step 2: Store the 6-digit code and advance to the new password screen.
       * No API call is made here — /v1/auth/verify is for account registration only.
       * Calling it would consume/invalidate the OTP before /reset-password can use it,
       * causing a 410 error. The code is validated by the backend in step 3.
       */
      verifyForgotCode: async (code: string) => {
        set({
          forgotCode: code,
          isCodeSent: false,
          isResetting: true,
          forgotError: null,
        })
        return true
      },

      /**
       * Step 3: Reset the password using email + code + newPassword.
       * POST /v1/auth/reset-password { email, code, newPassword }
       */
      resetPasswordWithCode: async (newPassword: string) => {
        const { forgotEmail, forgotCode } = get()
        set({ isSubmitting: true, forgotError: null })
        try {
          await authAPI.resetPassword({
            email: forgotEmail,
            code: forgotCode,
            newPassword,
          })
          set({
            isSubmitting: false,
            isResetting: false,
            isSuccess: true,
            // Clear sensitive data
            forgotCode: '',
            forgotError: null,
          })
          return true
        } catch (err: any) {
          const msg = err?.message ?? 'حدث خطأ أثناء إعادة تعيين كلمة المرور'
          set({
            forgotError:
              typeof msg === 'string'
                ? msg
                : 'حدث خطأ أثناء إعادة تعيين كلمة المرور',
            isSubmitting: false,
          })
          return false
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
          forgotEmail: '',
          forgotCode: '',
          forgotError: null,
        }),
    }),
    {
      name: 'login-storage',
      partialize: (state) => ({ email: state.email }), // Only persist the email for security
    },
  ),
)
