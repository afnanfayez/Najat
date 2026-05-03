'use client'

import React, { useState } from 'react'
import { Eye, EyeOff, LogIn } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'
import { useRegisterStore } from '@/store/useRegisterStore'
import { registerStepFourSchema } from '@/schemas/registerStepFour'

const StepFour = () => {
  const { formData, updateFormData, nextStep, fieldErrors, clearErrors } = useRegisterStore()
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [localErrors, setLocalErrors] = useState({})

  const getError = (field) => {
    if (localErrors[field]) return localErrors[field]
    if (fieldErrors[field]) return fieldErrors[field]
    return null
  }

  const getPasswordHint = () => {
    if (getError('password')) return null // Don't show hint if there's an error
    if (!formData.password) return null
    if (formData.password.length < 8)
      return {
        text: 'يجب ان لا تقل كلمة المرور عن 8 أحرف ويجب أن تتضمن أرقام ورموز',
        color: 'text-[#FDB022]',
      }
    const hasNumbers = /\d/.test(formData.password)
    const hasSymbols = /[!@#$%^&*(),.?":{}|<>]/.test(formData.password)
    if (!hasNumbers || !hasSymbols)
      return { text: 'كلمة المرور يجب أن تحتوي على أرقام ورموز خاصة', color: 'text-[#FDB022]' }
    return { text: 'كلمة المرور قوية ✓', color: 'text-green-400' }
  }

  const hint = getPasswordHint()

  const handleSubmit = (e) => {
    e.preventDefault()
    setLocalErrors({})

    const result = registerStepFourSchema.safeParse({
      password: formData.password,
      confirmPassword: formData.confirmPassword,
    })

    if (!result.success) {
      const errs = {}
      result.error.issues.forEach((err) => {
        const field = err.path[0]
        if (field && !errs[field]) {
          errs[field] = err.message
        }
      })
      setLocalErrors(errs)
      // Show the first error as a toast
      const firstMsg = result.error.issues[0]?.message
      if (firstMsg) toast.error(firstMsg)
      return
    }

    clearErrors()
    nextStep()
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mx-auto w-full max-w-[580px] space-y-3 sm:space-y-4"
    >
      <div className="space-y-1">
        <Label
          htmlFor="reg-password"
          className="block text-right text-[13px] font-bold text-white sm:text-[14px]"
          style={{ lineHeight: '100%' }}
        >
          كلمة المرور
        </Label>
        <div className="relative">
          <Input
            id="reg-password"
            type={showPassword ? 'text' : 'password'}
            value={formData.password}
            onChange={(e) => {
              updateFormData({ password: e.target.value })
              setLocalErrors((prev) => { const n = {...prev}; delete n.password; return n })
            }}
            placeholder="********"
            className={`h-11 rounded-[10px] bg-white/95 px-12 text-right text-[14px] text-black shadow-[0px_4px_7.6px_0px_#0000001A] placeholder:text-gray-400 sm:h-[50px] sm:px-14 sm:text-[15px] ${getError('password') ? 'border-2 border-red-500' : 'border-none'}`}
          />
          <div className="pointer-events-none absolute top-1/2 right-4 -translate-y-1/2">
            <i className="bx bx-key text-[18px] text-[#2496FF] sm:text-[20px]" />
          </div>
          <div className="absolute top-1/2 left-4 flex -translate-y-1/2 items-center">
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="text-gray-400 transition-colors hover:text-[#2496FF]"
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4 sm:h-5 sm:w-5" />
              ) : (
                <Eye className="h-4 w-4 sm:h-5 sm:w-5" />
              )}
            </button>
          </div>
        </div>
        {getError('password') && (
          <p className="mt-1 text-right text-[11px] font-bold text-red-500 sm:text-[12px]" dir="rtl">
            {getError('password')}
          </p>
        )}
        {!getError('password') && hint && (
          <p
            className={`text-right text-[11px] font-bold ${hint.color} mt-1 sm:text-[12px]`}
            dir="rtl"
          >
            {hint.text}
          </p>
        )}
      </div>

      <div className="space-y-1">
        <Label
          htmlFor="confirmPassword"
          className="block text-right text-[13px] font-bold text-white sm:text-[14px]"
          style={{ lineHeight: '100%' }}
        >
          تأكيد كلمة المرور
        </Label>
        <div className="relative">
          <Input
            id="confirmPassword"
            type={showConfirmPassword ? 'text' : 'password'}
            value={formData.confirmPassword}
            onChange={(e) => {
              updateFormData({ confirmPassword: e.target.value })
              setLocalErrors((prev) => { const n = {...prev}; delete n.confirmPassword; return n })
            }}
            placeholder="********"
            className={`h-11 rounded-[10px] bg-white/95 px-12 text-right text-[14px] text-black shadow-[0px_4px_7.6px_0px_#0000001A] placeholder:text-gray-400 sm:h-[50px] sm:px-14 sm:text-[15px] ${getError('confirmPassword') ? 'border-2 border-red-500' : 'border-none'}`}
          />
          <div className="pointer-events-none absolute top-1/2 right-4 -translate-y-1/2">
            <i className="bx bx-key text-[18px] text-[#2496FF] sm:text-[20px]" />
          </div>
          <div className="absolute top-1/2 left-4 flex -translate-y-1/2 items-center">
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="text-gray-400 transition-colors hover:text-[#2496FF]"
            >
              {showConfirmPassword ? (
                <EyeOff className="h-4 w-4 sm:h-5 sm:w-5" />
              ) : (
                <Eye className="h-4 w-4 sm:h-5 sm:w-5" />
              )}
            </button>
          </div>
        </div>
        {getError('confirmPassword') && (
          <p className="mt-1 text-right text-[11px] font-bold text-red-500 sm:text-[12px]" dir="rtl">
            {getError('confirmPassword')}
          </p>
        )}
      </div>

      <div className="flex items-center justify-start gap-2 pt-1">
        <Checkbox
          id="rememberMe"
          checked={formData.rememberMe}
          onCheckedChange={(checked) =>
            updateFormData({ rememberMe: Boolean(checked) })
          }
          className="h-4 w-4 rounded-md border-white/30 bg-white/5 transition-all data-[state=checked]:border-[#2496FF] data-[state=checked]:bg-[#2496FF] sm:h-5 sm:w-5"
        />
        <Label
          htmlFor="rememberMe"
          className="cursor-pointer text-[12px] font-semibold text-white sm:text-[14px]"
          style={{ lineHeight: '100%' }}
        >
          تذكرني على هذا الجهاز
        </Label>
      </div>

      <Button
        type="submit"
        className="mx-auto mt-2 flex h-11 w-full items-center justify-center gap-2 rounded-[10px] bg-[#2496FF] text-[18px] font-bold text-white shadow-lg shadow-[#2496FF]/10 transition-all hover:bg-[#1C7ED6] active:scale-[0.98] sm:h-[50px] sm:w-[350px] sm:gap-[10px] sm:text-[20px]"
        style={{ lineHeight: '100%' }}
      >
        دخول
        <LogIn className="h-5 w-5 sm:h-6 sm:w-6" />
      </Button>
    </form>
  )
}

export default StepFour
