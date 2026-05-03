'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Eye, EyeOff, LogIn, CheckCircle2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import LoginSuccess from './LoginSuccess'
import { useLoginStore } from '@/store/useLoginStore'

const ResetPasswordForm = () => {
  const [showPassword1, setShowPassword1] = useState(false)
  const [showPassword2, setShowPassword2] = useState(false)
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState(false)
  const [passwordError, setPasswordError] = useState('')
  const { resetPasswordWithCode, isSubmitting, forgotError } = useLoginStore()
  const [isSuccess, setIsSuccess] = useState(false)

  const getPasswordWarning = () => {
    if (!password) return null
    if (password === '12345678')
      return {
        text: 'كلمة المرور مستخدمة سابقاً، اختر كلمة مرور أخرى',
        color: 'text-red-500',
      }
    if (password.length < 8)
      return {
        text: 'يجب ألا تقل كلمة المرور عن 8 أحرف وتتضمن أرقاماً ورموزاً',
        color: 'text-[#FDB022]',
      }
    const hasNumbers = /\d/.test(password)
    const hasSymbols = /[!@#$%^&*(),.?":{}|<>]/.test(password)
    if (!hasNumbers || !hasSymbols)
      return {
        text: 'كلمة المرور يجب أن تحتوي على أرقام ورموز لتكون أقوى',
        color: 'text-red-500',
      }
    return null
  }

  const passwordWarning = getPasswordWarning()

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (password.trim() === '' || confirmPassword.trim() === '') {
      setPasswordError('يرجى تعبئة حقلي كلمة المرور')
      setError(true)
      return
    }

    if (password.length < 8) {
      setPasswordError('يجب أن تحتوي كلمة المرور على 8 أحرف على الأقل')
      setError(true)
      return
    }

    const hasNumbers = /\d/.test(password)
    const hasSymbols = /[!@#$%^&*(),.?":{}|<>]/.test(password)
    if (!hasNumbers || !hasSymbols) {
      setPasswordError('يجب أن تحتوي كلمة المرور على أرقام ورموز')
      setError(true)
      return
    }

    if (password !== confirmPassword) {
      setPasswordError('كلمات المرور غير متطابقة')
      setError(true)
      return
    }

    setError(false)
    setPasswordError('')

    const success = await resetPasswordWithCode(password)
    if (success) {
      setIsSuccess(true)
    } else {
      setPasswordError(forgotError || 'حدث خطأ أثناء إعادة تعيين كلمة المرور')
      setError(true)
    }
  }

  if (isSuccess) {
    return <LoginSuccess />
  }

  return (
    <div
      className="relative flex h-screen w-full flex-col items-center justify-center overflow-hidden bg-black px-4 font-sans sm:px-6 lg:px-8"
      dir="rtl"
    >
      <div className="absolute inset-0 z-0">
        <Image
          src="/assets/Photo1.png"
          alt="Background"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0"></div>
      </div>

      <div className="relative z-10 flex h-full w-full flex-col items-center justify-center">
        <Card
          className="scrollbar-hide flex w-full max-w-[750px] flex-col items-center justify-center overflow-y-auto rounded-[25px] border-white/[0.1] bg-white/[0.01] px-5 py-6 shadow-2xl backdrop-blur-md sm:px-8 sm:py-8"
          style={{
            fontFamily: 'Cairo, sans-serif',
            height: '700px',
          }}
        >
          <div className="flex h-full w-full flex-col items-center justify-between">
            <div className="relative -mt-10 -mb-6 flex h-32 w-32 items-center justify-center sm:-mt-[50px] sm:-mb-[40px] sm:h-[200px] sm:w-[200px]">
              <Image
                src="/assets/Logo1.png"
                alt="Logo"
                width={200}
                height={200}
                className="h-full w-full object-contain drop-shadow-[0_0_15px_rgba(36,150,255,0.1)]"
                priority
              />
            </div>

            <div className="w-full text-center">
              <h1
                className="text-xl font-bold tracking-tight text-white sm:text-[28px]"
                style={{ lineHeight: '100%' }}
              >
                اعادة تعيين كلمة مرور
              </h1>
            </div>

            <form
              onSubmit={handleSubmit}
              className="mt-4 w-full max-w-[580px] space-y-6 sm:mt-6 sm:space-y-8"
            >
              <div className="space-y-2 sm:space-y-3">
                <Label
                  htmlFor="new-password"
                  dir="rtl"
                  className="mr-1 block text-right text-[13px] font-bold text-white sm:text-[14px]"
                  style={{ lineHeight: '100%' }}
                >
                  كلمة المرور الجديدة
                </Label>
                <div className="relative">
                  <Input
                    id="new-password"
                    type={showPassword1 ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value)
                      if (error) {
                        setError(false)
                        setPasswordError('')
                      }
                    }}
                    placeholder="********"
                    className="h-11 rounded-[10px] bg-white px-12 text-right text-[14px] text-black shadow-[0px_4px_7.6px_0px_#0000001A] transition-all placeholder:text-gray-400 sm:h-[50px] sm:px-14 sm:text-[15px]"
                    style={
                      error
                        ? { border: '2.5px solid #F44336' }
                        : isSubmitting
                          ? { border: '2.5px solid #459F49' }
                          : { border: 'none' }
                    }
                  />
                  <div className="absolute top-1/2 right-4 flex -translate-y-1/2 items-center">
                    <i
                      className={`bx bx-key text-[18px] sm:text-[20px] ${error ? 'text-[#F44336]' : isSubmitting ? 'text-[#459F49]' : 'text-[#2496FF]'}`}
                    />
                  </div>
                  <div className="absolute top-1/2 left-4 flex -translate-y-1/2 items-center">
                    <button
                      type="button"
                      onClick={() => setShowPassword1(!showPassword1)}
                      className="text-gray-400 transition-colors hover:text-[#2496FF]"
                    >
                      {showPassword1 ? (
                        <EyeOff className="h-4 w-4 sm:h-5 sm:w-5" />
                      ) : (
                        <Eye className="h-4 w-4 sm:h-5 sm:w-5" />
                      )}
                    </button>
                  </div>
                </div>

                {passwordWarning && !error && (
                  <p
                    className={`mt-1 text-right text-[11px] font-bold ${passwordWarning.color} sm:text-[12px]`}
                  >
                    {passwordWarning.text}
                  </p>
                )}
              </div>

              <div className="space-y-2 sm:space-y-3">
                <Label
                  htmlFor="confirm-password"
                  dir="rtl"
                  className="mr-1 block text-right text-[13px] font-bold text-white sm:text-[14px]"
                  style={{ lineHeight: '100%' }}
                >
                  تأكيد كلمة المرور
                </Label>
                <div className="relative">
                  <Input
                    id="confirm-password"
                    type={showPassword2 ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => {
                      setConfirmPassword(e.target.value)
                      if (error) {
                        setError(false)
                        setPasswordError('')
                      }
                    }}
                    placeholder="********"
                    className="h-11 rounded-[10px] bg-white px-12 text-right text-[14px] text-black shadow-[0px_4px_7.6px_0px_#0000001A] transition-all placeholder:text-gray-400 sm:h-[50px] sm:px-14 sm:text-[15px]"
                    style={
                      error
                        ? { border: '2.5px solid #F44336' }
                        : isSubmitting
                          ? { border: '2.5px solid #459F49' }
                          : { border: 'none' }
                    }
                  />
                  <div className="absolute top-1/2 right-4 flex -translate-y-1/2 items-center">
                    <i
                      className={`bx bx-key text-[18px] sm:text-[20px] ${error ? 'text-[#F44336]' : isSubmitting ? 'text-[#459F49]' : 'text-[#2496FF]'}`}
                    />
                  </div>
                  <div className="absolute top-1/2 left-4 flex -translate-y-1/2 items-center">
                    <button
                      type="button"
                      onClick={() => setShowPassword2(!showPassword2)}
                      className="text-gray-400 transition-colors hover:text-[#2496FF]"
                    >
                      {showPassword2 ? (
                        <EyeOff className="h-4 w-4 sm:h-5 sm:w-5" />
                      ) : (
                        <Eye className="h-4 w-4 sm:h-5 sm:w-5" />
                      )}
                    </button>
                  </div>
                </div>

                {error && (
                  <p
                    className="mt-1 w-full text-left text-[13px] font-bold text-[#F44336] sm:text-[14px]"
                    style={{ lineHeight: '100%' }}
                  >
                    {passwordError}
                  </p>
                )}
              </div>

              <div className="flex items-center gap-2 sm:gap-3">
                <Checkbox
                  id="remember"
                  className={`h-4 w-4 rounded-md border-white/30 bg-white/5 transition-all sm:h-5 sm:w-5 ${
                    isSubmitting
                      ? 'data-[state=checked]:border-[#459F49] data-[state=checked]:bg-[#459F49]'
                      : 'data-[state=checked]:border-[#2496FF] data-[state=checked]:bg-[#2496FF]'
                  }`}
                />
                <Label
                  htmlFor="remember"
                  className="cursor-pointer text-[12px] font-semibold text-white sm:text-[14px]"
                  style={{ lineHeight: '100%' }}
                >
                  تذكرني على هذا الجهاز
                </Label>
              </div>

              <Button
                type="submit"
                disabled={isSubmitting}
                className={`mx-auto mt-6 flex h-11 w-full items-center justify-center gap-2 rounded-[10px] font-bold text-white shadow-lg transition-all active:scale-[0.98] sm:h-[50px] sm:w-[300px] sm:gap-[10px] sm:text-[20px] ${
                  isSubmitting
                    ? 'scale-[0.98] bg-[#459F49] text-[20px] shadow-[#459F49]/20'
                    : 'bg-[#2496FF] text-[18px] shadow-[#2496FF]/10 hover:bg-[#1C7ED6]'
                }`}
                style={{ lineHeight: '100%' }}
              >
                {isSubmitting ? (
                  <CheckCircle2
                    className="h-20 w-20 sm:h-24 sm:w-24"
                    style={{ width: '30px', height: '30px' }}
                  />
                ) : (
                  <>
                    دخول
                    <LogIn className="h-5 w-5 sm:h-6 sm:w-6" />
                  </>
                )}
              </Button>
            </form>

            <div className="h-4 sm:h-8"></div>
          </div>
        </Card>

        <div className="mt-8 flex w-full flex-col items-center space-y-2 px-4 text-white sm:mt-8">
          <div
            className="flex flex-wrap items-center justify-center gap-3 text-[13px] font-semibold sm:gap-4 sm:text-[14px]"
            style={{ lineHeight: '100%' }}
          >
            <Link href="#" className="transition-colors hover:text-white">
              سياسة الخصوصية
            </Link>
            <div className="hidden h-1 w-1 rounded-full bg-white sm:block"></div>
            <Link href="#" className="transition-colors hover:text-white">
              اتصل بنا
            </Link>
            <div className="hidden h-1 w-1 rounded-full bg-white sm:block"></div>
            <Link href="#" className="transition-colors hover:text-white">
              English Version
            </Link>
          </div>
          <p
            className="text-center text-[11px] font-semibold text-white/60 sm:text-[12px]"
            style={{ lineHeight: '100%' }}
          >
            © 2024 نظام نجاة للمواطنين. جميع الحقوق محفوظة.
          </p>
        </div>
      </div>
    </div>
  )
}

export default ResetPasswordForm
