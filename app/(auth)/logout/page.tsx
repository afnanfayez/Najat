'use client'

import React, { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { CheckCircle2 } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { useLoginStore } from '@/store/useLoginStore'

import { useAuth } from '@/context/AuthContext'

export default function LogoutPage() {
  const router = useRouter()
  const resetLogin = useLoginStore((s) => s.resetLogin)
  const { performSessionCleanup } = useAuth()

  useEffect(() => {
    performSessionCleanup()
    resetLogin()
    const timer = setTimeout(() => {
      window.location.replace('/login')
    }, 3000)
    return () => clearTimeout(timer)
  }, [resetLogin, performSessionCleanup])

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
          style={{ fontFamily: 'Cairo, sans-serif', height: '700px' }}
        >
          <div className="flex h-full w-full flex-col items-center justify-center space-y-4 text-center">
            <div className="rounded-full bg-white/20 p-4 shadow-lg backdrop-blur-sm">
              <CheckCircle2 className="h-24 w-24 text-[#2496FF]" />
            </div>
            <div className="space-y-4">
              <h2
                className="text-[26px] font-extrabold text-white sm:text-[32px]"
                style={{ lineHeight: '100%' }}
              >
                تم تسجيل خروجك بنجاح
              </h2>
              <p className="text-[16px] font-bold text-white/90 sm:text-[18px]">
                جاري تحويلك إلى صفحة تسجيل الدخول...
              </p>
            </div>

            <div className="mt-8 flex items-center justify-center gap-2">
              <div
                className="h-3 w-3 animate-bounce rounded-full bg-[#2496FF]"
                style={{ animationDelay: '0ms' }}
              ></div>
              <div
                className="h-3 w-3 animate-bounce rounded-full bg-[#2496FF]"
                style={{ animationDelay: '150ms' }}
              ></div>
              <div
                className="h-3 w-3 animate-bounce rounded-full bg-[#2496FF]"
                style={{ animationDelay: '300ms' }}
              ></div>
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
