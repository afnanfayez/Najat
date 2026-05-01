import { create } from 'zustand'

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
  resetLogin: () => void
}

// ─── Store ────────────────────────────────────────────────────────────────────

export const useLoginStore = create<LoginState>((set, get) => ({
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

  // Composite: successful login → start green animation
  handleLoginSuccess: () => {
    set({ isSubmitting: true })
    setTimeout(() => {
      set({
        isSuccess: true,
        isError: false,
        emailError: false,
        passwordError: false,
        isSubmitting: false,
      })
    }, 2000)
  },

  // Composite: failed login → show error state
  handleLoginFailure: (emailErr, passErr) =>
    set({
      emailError: emailErr,
      passwordError: passErr,
      isError: true,
      isSuccess: false,
    }),

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
}))
