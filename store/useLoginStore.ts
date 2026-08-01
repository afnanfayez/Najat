import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { createClient } from '@/lib/supabase/client'
import { decodeRoleClaim } from '@/lib/supabase/decodeRoleClaim'
import { mapSupabaseAuthError } from '@/lib/auth/supabaseAuthErrors'
import { normalizeUserRole, type UserRole } from '@/lib/auth/roleUtils'
import { saveLoginRedirect, routeForRole } from '@/lib/auth/currentAuthRole'
import { precacheAppRoute, precacheRoutesForRole } from '@/lib/pwa/precacheRoute'
import { syncAllData } from '@/lib/offline/sync'
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

function isOffline(): boolean {
  return typeof navigator !== 'undefined' && !navigator.onLine
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

      // Composite: sign in via Supabase Auth
      handleLoginSuccess: async () => {
        const { email, password } = get()
        set({
          isSubmitting: true,
          isError: false,
          emailError: false,
          passwordError: false,
        })

        // If offline, check if we have a saved offline session profile for this user
        if (isOffline()) {
          const { getOfflineCachedProfile } = await import('@/lib/auth/offlineLogin')
          const cachedProfile = await getOfflineCachedProfile()

          if (cachedProfile) {
            const userEmail = (email ?? '').trim().toLowerCase()
            const cachedEmail = (cachedProfile.email ?? '').trim().toLowerCase()

            if (!userEmail || userEmail === cachedEmail) {
              const resolvedRole = normalizeUserRole(cachedProfile.role) ?? 'resident'
              const destination = routeForRole(resolvedRole)

              saveLoginRedirect(destination)
              toast.success('تم تسجيل الدخول بنجاح في وضع الأوفلاين (بيانات محليّة محفوظة)', {
                id: 'login-offline-success',
                position: 'top-center',
              })
              set({ isSuccess: true, isSubmitting: false, postLoginRole: resolvedRole })
              return
            }
          }

          const msg = 'لا توجد بيانات محفوطة مسبقاً لهذا الحساب في وضع الأوفلاين. يرجى الاتصال بالإنترنت أولاً.'
          toast.error(msg, { id: 'login-offline', position: 'top-center' })
          set({ isSubmitting: false, isError: true, emailError: true, passwordError: true })
          return
        }

        const supabase = createClient()
        const { data, error } = await supabase.auth.signInWithPassword({ email, password })

        if (error || !data.session) {
          const msg = error ? mapSupabaseAuthError(error) : 'تعذّر تسجيل الدخول'
          toast.error(msg)
          set({ isError: true, emailError: true, passwordError: true, isSubmitting: false })
          return
        }

        // role is written into the JWT's claims by the Custom Access Token
        // Hook (supabase/migrations/0014_auth_hook.sql) — decode it from the
        // access token, NOT data.user.app_metadata (which does not reflect
        // the hook's injected claim — see lib/supabase/decodeRoleClaim.ts).
        const resolvedRole =
          normalizeUserRole(decodeRoleClaim(data.session.access_token)) ?? 'resident'

        const destination = routeForRole(resolvedRole)
        void precacheAppRoute(destination)
        void precacheRoutesForRole(resolvedRole)
        void syncAllData(true)
        saveLoginRedirect(destination)
        set({ isSuccess: true, isSubmitting: false, postLoginRole: resolvedRole })
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

      /** Step 1: Send a password reset code to the user's email. */
      sendForgotPasswordCode: async (email: string) => {
        if (isOffline()) {
          const msg =
            'استعادة كلمة المرور تحتاج اتصالاً بالإنترنت. يرجى الانتظار حتى يعود الاتصال ثم المحاولة مرة أخرى.'
          set({ isSubmitting: false, forgotError: msg })
          toast.error(msg, { id: 'forgot-offline-action', position: 'top-center' })
          return false
        }

        set({ isSubmitting: true, forgotError: null })
        const supabase = createClient()
        const { error } = await supabase.auth.resetPasswordForEmail(email)
        if (error) {
          const msg = mapSupabaseAuthError(error)
          set({ forgotError: msg, isSubmitting: false })
          toast.error(msg)
          return false
        }
        set({ forgotEmail: email, isCodeSent: true, isSubmitting: false })
        toast.success('تم إرسال رمز الاستعادة إلى بريدك الإلكتروني')
        return true
      },

      /**
       * Step 2: Store the 6-digit code and advance to the new password screen.
       * The code itself is verified in step 3 together with the password
       * change, in a single short-lived recovery session that's signed out
       * of immediately after — see resetPasswordWithCode.
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
       * Step 3: Verify the code (establishing a brief recovery session),
       * set the new password, then immediately sign out of the recovery
       * session so it can't be mistaken for a normal login by middleware.ts.
       */
      resetPasswordWithCode: async (newPassword: string) => {
        if (isOffline()) {
          const msg = 'تعيين كلمة مرور جديدة يحتاج اتصالاً بالإنترنت. يرجى المحاولة بعد عودة الاتصال.'
          set({ isSubmitting: false, forgotError: msg })
          toast.error(msg, { id: 'forgot-offline-action', position: 'top-center' })
          return false
        }

        const { forgotEmail, forgotCode } = get()
        set({ isSubmitting: true, forgotError: null })

        const supabase = createClient()
        const { error: verifyError } = await supabase.auth.verifyOtp({
          email: forgotEmail,
          token: forgotCode,
          type: 'recovery',
        })
        if (verifyError) {
          const msg = mapSupabaseAuthError(verifyError)
          set({ forgotError: msg, isSubmitting: false })
          return false
        }

        const { error: updateError } = await supabase.auth.updateUser({ password: newPassword })
        await supabase.auth.signOut()

        if (updateError) {
          const msg = mapSupabaseAuthError(updateError)
          set({ forgotError: msg, isSubmitting: false })
          return false
        }

        set({
          isSubmitting: false,
          isResetting: false,
          isSuccess: true,
          forgotCode: '',
          forgotError: null,
        })
        return true
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
