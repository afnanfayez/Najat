import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { authAPI } from '@/lib/api/api'
import { extractAuthPayload } from '@/lib/api/extractAuth'
import { saveToken } from '@/lib/api/auth'
import { notifyAuthSessionChanged } from '@/lib/auth/authEvents'
import { resetBrowserSession } from '@/lib/auth/resetBrowserSession'
import { saveUserRole } from '@/lib/auth/sessionRole'
import { getRoleFromJwt, normalizeUserRole, type UserRole } from '@/lib/auth/roleUtils'
import { saveLoginRedirect, routeForRole } from '@/lib/auth/currentAuthRole'
import {
  saveOfflineLoginSnapshot,
  tryOfflineLogin,
} from '@/lib/auth/offlineLogin'
import { precacheAppRoute, precacheResidentRoutes } from '@/lib/pwa/precacheRoute'
import { profileAPI } from '@/lib/api/profile'
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
  postLoginRole: UserRole | null

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
  setPostLoginRole: (role: UserRole | null) => void

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
      postLoginRole: null,

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
      setPostLoginRole: (postLoginRole) => set({ postLoginRole }),

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

        if (typeof navigator !== 'undefined' && !navigator.onLine) {
          try {
            const restored = await tryOfflineLogin(email, password)
            if (!restored) {
              set({
                isError: true,
                emailError: true,
                passwordError: true,
                isSubmitting: false,
              })
              return
            }
            notifyAuthSessionChanged()
            const destination = routeForRole(restored.role)
            saveLoginRedirect(destination)
            void precacheAppRoute(destination)
            if (restored.role === 'resident') void precacheResidentRoutes()
            set({
              isSuccess: true,
              isSubmitting: false,
              postLoginRole: restored.role,
            })
          } catch {
            set({
              isSubmitting: false,
              isError: true,
              emailError: true,
              passwordError: true,
            })
          }
          return
        }

        try {
          const res = await authAPI.login({ email, password })
          const { token, role } = extractAuthPayload(res)
          if (!token) {
            throw new Error('لم يتم استلام رمز الدخول من الخادم')
          }
          resetBrowserSession({ keepLoginEmail: true })
          saveToken(token)
          const resolvedRole =
            normalizeUserRole(role) ?? getRoleFromJwt(token)
          if (resolvedRole) {
            saveUserRole(resolvedRole)
          }
          notifyAuthSessionChanged()

          const profile = await profileAPI.me().catch(() => null)
          await saveOfflineLoginSnapshot(
            email,
            password,
            token,
            resolvedRole,
            profile,
          )

          const destination = routeForRole(resolvedRole)
          void precacheAppRoute(destination)
          if (resolvedRole === 'resident') void precacheResidentRoutes()
          saveLoginRedirect(destination)
          set({
            isSuccess: true,
            isSubmitting: false,
            postLoginRole: resolvedRole ?? null,
          })
        } catch (err: any) {
          // ── Network error → try offline credentials as fallback ────────────
          if (!err?.status || err.status === 0) {
            try {
              const restored = await tryOfflineLogin(email, password)
              if (restored) {
                notifyAuthSessionChanged()
                const destination = routeForRole(restored.role)
                saveLoginRedirect(destination)
                void precacheAppRoute(destination)
                if (restored.role === 'resident') void precacheResidentRoutes()
                set({
                  isSuccess: true,
                  isSubmitting: false,
                  postLoginRole: restored.role,
                })
                return
              }
            } catch {
              // offline snapshot not found – fall through to error state
            }
          }

          const msg = err?.message ?? 'تعذّر الاتصال بالخادم، حاول مرة أخرى'
          toast.error(msg)
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
        if (typeof navigator !== 'undefined' && !navigator.onLine) {
          const msg = 'استعادة كلمة المرور تحتاج اتصالاً بالإنترنت. يرجى الانتظار حتى يعود الاتصال ثم المحاولة مرة أخرى.'
          set({ isSubmitting: false, forgotError: msg })
          toast.error(msg, { id: 'forgot-offline-action', position: 'top-center' })
          return false
        }

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
        if (typeof navigator !== 'undefined' && !navigator.onLine) {
          const msg = 'تعيين كلمة مرور جديدة يحتاج اتصالاً بالإنترنت. يرجى المحاولة بعد عودة الاتصال.'
          set({ isSubmitting: false, forgotError: msg })
          toast.error(msg, { id: 'forgot-offline-action', position: 'top-center' })
          return false
        }

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
          postLoginRole: null,
        }),
    }),
    {
      name: 'login-storage',
      partialize: (state) => ({ email: state.email }), // Only persist the email for security
    },
  ),
)
