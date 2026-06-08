'use client'

import React, { useState, useRef, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { useLoginStore } from '@/store/useLoginStore'
import ResetPasswordForm from './ResetPasswordForm'
import { toast } from 'sonner'

const ResetPassword = () => {
  const [code, setCode] = useState(['', '', '', '', '', ''])
  const [error, setError] = useState(false)
  const inputs = useRef([])
  const {
    verifyForgotCode,
    isSubmitting,
    isResetting,
    forgotError,
    setIsCodeSent,
    sendForgotPasswordCode,
    forgotEmail,
  } = useLoginStore()

  useEffect(() => {
    if (inputs.current[0]) {
      inputs.current[0].focus()
    }
  }, [])

  const handleSubmit = async (e) => {
    if (e) e.preventDefault()
    const fullCode = code.join('')
    if (fullCode.length === 6) {
      setError(false)
      const success = await verifyForgotCode(fullCode)
      if (!success) {
        setError(true)
      }
    }
  }

  const handleChange = (e, index) => {
    const value = e.target.value

    if (isNaN(value) || value === ' ') return

    if (error) setError(false)

    const newCode = [...code]

    newCode[index] = value.substring(value.length - 1)
    setCode(newCode)

    if (value !== '' && index < 5) {
      inputs.current[index + 1].focus()
    } else if (value !== '' && index === 5) {
      const fullCode = newCode.join('')
      if (fullCode.length === 6) {
        // Option to auto-submit here, or let user click submit.
        // We will just let them click submit to avoid unexpected loading spinners.
      }
    }
  }

  const handleResend = async () => {
    setCode(['', '', '', '', '', ''])
    setError(false)
    if (inputs.current[0]) {
      inputs.current[0].focus()
    }
    if (forgotEmail) {
      await sendForgotPasswordCode(forgotEmail)
    } else {
      toast.error('البريد الإلكتروني غير معروف. يرجى البدء من جديد.')
      setIsCodeSent(false) // Go back to forgot password page
    }
  }

  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace' && code[index] === '' && index > 0) {
      inputs.current[index - 1].focus()
    }
  }

  const handlePaste = (e) => {
    e.preventDefault()
    const pastedData = e.clipboardData
      .getData('text')
      .replace(/\D/g, '')
      .slice(0, 6)
      .split('')

    if (pastedData.length === 0) return

    if (error) setError(false)

    const newCode = [...code]
    pastedData.forEach((char, i) => {
      newCode[i] = char
    })
    setCode(newCode)

    const focusIndex = pastedData.length < 6 ? pastedData.length : 5
    inputs.current[focusIndex].focus()

    if (pastedData.length === 6) {
      const fullCode = pastedData.join('')
      // Let the user click submit
    }
  }

  // If user has verified the code, show password reset form
  if (isResetting) {
    return <ResetPasswordForm />
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
          unoptimized
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
                ادخال الكود
              </h1>
              <p
                className="mx-auto mt-8 max-w-[450px] text-base font-bold text-white/90 sm:mt-12 sm:text-[18px]"
                style={{ lineHeight: '140%' }}
              >
                قم بإدخال الكود الذي قمنا بارساله
              </p>
            </div>

            <form
              onSubmit={handleSubmit}
              className="mt-4 w-full max-w-[580px] space-y-8 sm:mt-6 sm:space-y-10"
            >
              <div className="flex w-full flex-col items-center gap-2">
                <div
                  className="flex w-full items-center justify-center gap-2 sm:gap-4"
                  dir="ltr"
                >
                  {code.map((digit, index) => (
                    <input
                      key={index}
                      ref={(el) => (inputs.current[index] = el)}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleChange(e, index)}
                      onKeyDown={(e) => handleKeyDown(e, index)}
                      onPaste={handlePaste}
                      className={`h-12 w-12 rounded-[12px] bg-white/90 text-center text-[24px] font-bold shadow-[0px_4px_7.6px_0px_#0000001A] transition-all focus:ring-2 focus:ring-[#2496FF] focus:outline-none sm:h-16 sm:w-16 sm:rounded-[15px] sm:text-[28px] ${
                        error
                          ? 'border-2 border-[#F44336] text-[#F44336]'
                          : 'border-none text-black'
                      }`}
                    />
                  ))}
                </div>

                <div className="mt-1 w-full max-w-[340px] sm:max-w-[440px]">
                  <button
                    type="button"
                    onClick={handleResend}
                    className="float-left text-[13px] font-bold text-white transition-opacity hover:opacity-80 sm:text-[15px]"
                  >
                    اعد ارسال الكود؟
                  </button>
                  <div className="clear-both"></div>
                </div>

                {error && (
                  <p className="mt-2 text-center text-[14px] font-bold text-[#F44336]">
                    {forgotError || 'الكود غير صحيح أو انتهت صلاحيته'}
                  </p>
                )}
              </div>

              <Button
                disabled={isSubmitting}
                className={`mx-auto flex h-11 w-full items-center justify-center rounded-[10px] text-[18px] font-bold text-white shadow-lg transition-all active:scale-[0.98] sm:h-[50px] sm:w-[350px] sm:text-[20px] ${
                  isSubmitting
                    ? 'bg-[#459F49] shadow-[#459F49]/20 hover:bg-[#3A8A3F]'
                    : 'bg-[#2496FF] shadow-[#2496FF]/10 hover:bg-[#1C7ED6]'
                }`}
                style={{ lineHeight: '100%' }}
              >
                {isSubmitting ? 'جاري التحقق...' : 'ارسال'}
              </Button>
            </form>

            <div className="flex flex-col items-center gap-4 pt-2">
              <button
                onClick={() => {
                  setIsCodeSent(false)
                }}
                className="flex items-center gap-2 pb-2 text-[14px] font-bold text-white/60 transition-colors hover:text-white"
              >
                <ArrowRight className="h-4 w-4" />
                العودة
              </button>
            </div>
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

export default ResetPassword
