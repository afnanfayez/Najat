'use client'

import React, { useState } from 'react'
import { Eye, EyeOff, LogIn, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'
import { useRegisterStore } from '@/store/useRegisterStore'

const StepFour = () => {
  const { formData, updateFormData, nextStep } = useRegisterStore()
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const getPasswordWarning = () => {
    if (!formData.password) return null
    if (formData.password === '12345678')
      return { text: 'كلمة المرور مستخدمة سابقا', color: 'text-red-500' }
    if (formData.password.length < 8)
      return {
        text: 'يجب ان الا تقل كلمة المرور عن 8 احرف ويجب ان تتضمن ارقام ورموز',
        color: 'text-[#FDB022]',
      }
    const hasNumbers = /\d/.test(formData.password)
    const hasSymbols = /[!@#$%^&*(),.?":{}|<>]/.test(formData.password)
    if (!hasNumbers || !hasSymbols)
      return { text: 'كلمة المرور ليست قوية ايضا', color: 'text-red-500' }
    return null
  }

  const warning = getPasswordWarning()

  const handleSubmit = (e) => {
    e.preventDefault()

    if (
      formData.password.trim() === '' ||
      formData.confirmPassword.trim() === ''
    ) {
      toast.error('يرجى تعبئة حقلي كلمة المرور')
      return
    }

    if (formData.password.length < 6) {
      toast.error('كلمة المرور قصيرة', {
        description: 'يجب أن تحتوي كلمة المرور على 6 أحرف على الأقل.',
      })
      return
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error('كلمتا المرور غير متطابقتين', {
        description: 'تأكد من كتابة كلمة المرور نفسها في الحقلين.',
      })
      return
    }

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
            onChange={(e) => updateFormData({ password: e.target.value })}
            placeholder="********"
            className="h-11 rounded-[10px] border-none bg-white/95 px-12 text-right text-[14px] text-black shadow-[0px_4px_7.6px_0px_#0000001A] placeholder:text-gray-400 sm:h-[50px] sm:px-14 sm:text-[15px]"
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
        {warning && (
          <p
            className={`text-left text-[11px] font-bold ${warning.color} mt-1 sm:text-[12px]`}
            dir="rtl"
          >
            {warning.text}
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
            onChange={(e) =>
              updateFormData({ confirmPassword: e.target.value })
            }
            placeholder="********"
            className="h-11 rounded-[10px] border-none bg-white/95 px-12 text-right text-[14px] text-black shadow-[0px_4px_7.6px_0px_#0000001A] placeholder:text-gray-400 sm:h-[50px] sm:px-14 sm:text-[15px]"
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
