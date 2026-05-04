'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Mail, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card } from '@/components/ui/card'
import { useLoginStore } from '@/store/useLoginStore'
import { useRegisterStore } from '@/store/useRegisterStore'
import { toast } from 'sonner'

const ForgotPassword = () => {
  const [email, setEmail] = useState('')
  const [emailError, setEmailError] = useState(false)
  const { sendForgotPasswordCode, isSubmitting, forgotError, setIsForgot } = useLoginStore()
  const { resetRegister } = useRegisterStore()

  const handleSubmit = async (e) => {
    e.preventDefault()
    const isEmailValid = email.includes('@') && email.includes('.')
    if (!isEmailValid) {
      setEmailError(true)
      return
    }
    setEmailError(false)

    const success = await sendForgotPasswordCode(email)
    // We don't need to show toast here because it's handled in the store
    // if (success) {
    //   toast.success('تم إرسال رمز الاستعادة إلى بريدك الإلكتروني')
    // } else {
    //   toast.error(forgotError || 'حدث خطأ أثناء إرسال الرمز')
    // }
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
                نسيت كلمة المرور
              </h1>
              <p
                className="mx-auto mt-8 max-w-[450px] text-base font-bold text-white/90 sm:mt-12 sm:text-[18px]"
                style={{ lineHeight: '140%' }}
              >
                ارسل لنا البريد الالكتروني لنرسل لك الرمز الخاص لاسترداد حسابك
              </p>
            </div>

            <form
              onSubmit={handleSubmit}
              noValidate
              className="w-full max-w-[580px] space-y-8 sm:space-y-10"
            >
              <div className="space-y-2 sm:space-y-3">
                <Label
                  htmlFor="email"
                  className="mr-1 block text-right text-[14px] font-bold text-white sm:text-[15px]"
                  style={{ lineHeight: '100%' }}
                >
                  البريد الإلكتروني
                </Label>
                <div className="relative">
                  <Input
                    id="email"
                    type="text"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value)
                      if (emailError) setEmailError(false)
                    }}
                    placeholder="name@example.com"
                    className={`h-11 rounded-[10px] bg-white pr-12 pl-4 text-right text-[15px] text-black shadow-[0px_4px_7.6px_0px_#0000001A] transition-all placeholder:text-gray-400 sm:h-[50px] sm:pr-14 sm:text-[16px] ${
                      emailError ? 'border-2 border-[#F44336]' : 'border-none'
                    }`}
                  />
                  <div className="pointer-events-none absolute top-1/2 right-4 flex -translate-y-1/2 items-center">
                    <Mail className="h-5 w-5 text-[#2496FF] sm:h-6 sm:w-6" />
                  </div>
                </div>

                {emailError && (
                  <div dir="ltr" className="flex w-full justify-start">
                    <p
                      className="text-[13px] font-bold text-[#F44336] sm:text-[14px]"
                      style={{ lineHeight: '100%' }}
                    >
                      البريد الإلكتروني غير صحيح
                    </p>
                  </div>
                )}
              </div>

              <Button
                type="submit"
                disabled={isSubmitting}
                className="mx-auto flex h-11 w-full items-center justify-center rounded-[10px] bg-[#2496FF] text-[18px] font-bold text-white shadow-lg shadow-[#2496FF]/10 transition-all hover:bg-[#1C7ED6] active:scale-[0.98] sm:h-[50px] sm:w-[350px] sm:text-[20px]"
                style={{ lineHeight: '100%' }}
              >
                {isSubmitting ? 'جاري الإرسال...' : 'ارسال'}
              </Button>
            </form>

            <div className="flex flex-col items-center gap-4 pt-2">
              <div className="text-center">
                <span
                  className="text-[14px] font-bold text-white sm:text-[15px]"
                  style={{ lineHeight: '100%' }}
                >
                  ليس لديك حساب؟{' '}
                </span>
                <Link
                  href="/register"
                  onClick={() => resetRegister()}
                  className="text-[14px] font-bold transition-opacity hover:opacity-80 sm:text-[15px]"
                  style={{ color: '#FDB022', lineHeight: '100%' }}
                >
                  إنشاء حساب جديد
                </Link>
              </div>

              <button
                onClick={() => setIsForgot(false)}
                className="flex items-center gap-2 pb-2 text-[14px] font-bold text-white/60 transition-colors hover:text-white"
              >
                <ArrowRight className="h-4 w-4" />
                العودة لتسجيل الدخول
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

export default ForgotPassword
