'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Mail, Key, Eye, EyeOff, LogIn, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { Separator } from '@/components/ui/separator'
import { Card } from '@/components/ui/card'

const AppleAppStoreIcon = ({ size = 40, opacity = 1, className = '' }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 256 256"
    width={size}
    height={size}
    fill="none"
    className={className}
    style={{ opacity }}
  >
    <path
      fill="#FFFFFF"
      d="m82.042 185.81l.024.008l-8.753 15.16c-3.195 5.534-10.271 7.43-15.805 4.235s-7.43-10.271-4.235-15.805l6.448-11.168l.619-1.072c1.105-1.588 3.832-4.33 9.287-3.814c0 0 12.837 1.393 13.766 8.065c0 0 .126 2.195-1.351 4.391m124.143-38.72h-27.294c-1.859-.125-2.67-.789-2.99-1.175l-.02-.035l-29.217-50.606l-.038.025l-1.752-2.512c-2.872-4.392-7.432 6.84-7.432 6.84c-5.445 12.516.773 26.745 2.94 31.046l40.582 70.29c3.194 5.533 10.27 7.43 15.805 4.234c5.533-3.195 7.43-10.271 4.234-15.805l-10.147-17.576c-.197-.426-.539-1.582 1.542-1.587h13.787c6.39 0 11.57-5.18 11.57-11.57s-5.18-11.57-11.57-11.57m-53.014 15.728s1.457 7.411-4.18 7.411H48.092c-6.39 0-11.57-5.18-11.57-11.57s5.18-11.57 11.57-11.57h25.94c4.188-.242 5.18-2.66 5.18-2.66l.024.012l33.86-58.648l-.01-.002c.617-1.133.103-2.204.014-2.373l-11.183-19.369c-3.195-5.533-1.299-12.61 4.235-15.804s12.61-1.3 15.805 4.234l5.186 8.983l5.177-8.967c3.195-5.533 10.271-7.43 15.805-4.234s7.43 10.27 4.235 15.804l-47.118 81.61c-.206.497-.269 1.277 1.264 1.414h28.164l.006.275s16.278.253 18.495 15.454"
    />
  </svg>
)

const LoginError = ({
  initialEmail,
  initialPassword,
  emailError,
  passwordError,
  onLogin,
  onForgot,
}) => {
  const [email, setEmail] = useState(initialEmail || '')
  const [password, setPassword] = useState(initialPassword || '')
  const [showPassword, setShowPassword] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    if (onLogin) onLogin(email, password)
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
          style={{ fontFamily: 'Cairo, sans-serif', height: '700px' }}
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

            <div className="mb-2 flex w-full max-w-[580px] items-center gap-3 rounded-[12px] border border-[#F44336]/20 bg-[#F44336]/10 p-3 sm:mb-4 sm:p-4">
              <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-[#F44336] shadow-lg shadow-[#F44336]/20 sm:h-10 sm:w-10">
                <AlertCircle className="h-5 w-5 text-white sm:h-6 sm:w-6" />
              </div>
              <div>
                <h3 className="text-[14px] font-bold text-white sm:text-[16px]">
                  خطأ في تسجيل الدخول
                </h3>
                <p className="text-[12px] font-semibold text-white/70 sm:text-[13px]">
                  يرجى التأكد من البريد الإلكتروني وكلمة المرور
                </p>
              </div>
            </div>

            <form
              onSubmit={handleSubmit}
              noValidate
              className="w-full max-w-[580px] space-y-4 sm:space-y-5"
            >
              <div className="space-y-1.5 sm:space-y-2">
                <Label
                  htmlFor="email"
                  className="mr-1 block text-right text-[13px] font-bold text-white sm:text-[14px]"
                >
                  البريد الإلكتروني
                </Label>
                <div className="relative">
                  <Input
                    id="email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    className={`h-11 rounded-[10px] bg-white/95 pr-12 pl-4 text-right text-[14px] text-black shadow-[0px_4px_7.6px_0px_#0000001A] transition-all placeholder:text-gray-400 sm:h-[50px] sm:pr-14 sm:text-[15px] ${emailError ? 'border-2 border-[#F44336]' : 'border-none'}`}
                  />
                  <div className="pointer-events-none absolute top-1/2 right-4 flex -translate-y-1/2 items-center">
                    <i
                      className={`bx bx-envelope text-[18px] sm:text-[20px] ${emailError ? 'text-[#F44336]' : 'text-[#2496FF]'}`}
                    />
                  </div>
                </div>
                {emailError && (
                  <p className="mr-1 text-[11px] font-bold text-[#F44336] sm:text-[12px]">
                    تنسيق البريد الإلكتروني غير صحيح
                  </p>
                )}
              </div>

              <div className="space-y-1.5 sm:space-y-2">
                <Label
                  htmlFor="password"
                  dir="rtl"
                  className="mr-1 block text-right text-[13px] font-bold text-white sm:text-[14px]"
                >
                  كلمة المرور
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="********"
                    className={`h-11 rounded-[10px] bg-white/95 px-12 text-right text-[14px] text-black shadow-[0px_4px_7.6px_0px_#0000001A] transition-all placeholder:text-gray-400 sm:h-[50px] sm:px-14 sm:text-[15px] ${passwordError ? 'border-2 border-[#F44336]' : 'border-none'}`}
                  />
                  <div className="absolute top-1/2 right-4 flex -translate-y-1/2 items-center">
                    <i
                      className={`bx bx-key text-[18px] sm:text-[20px] ${passwordError ? 'text-[#F44336]' : 'text-[#2496FF]'}`}
                    />
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
                {passwordError && (
                  <p className="mr-1 text-[11px] font-bold text-[#F44336] sm:text-[12px]">
                    كلمة المرور يجب أن تكون 8 أحرف على الأقل
                  </p>
                )}
              </div>

              <div className="flex items-center justify-between pt-1">
                <div className="flex items-center gap-2 sm:gap-3">
                  <Checkbox
                    id="remember"
                    className="h-4 w-4 rounded-md border-white/30 bg-white/5 transition-all data-[state=checked]:border-[#2496FF] data-[state=checked]:bg-[#2496FF] sm:h-5 sm:w-5"
                  />
                  <Label
                    htmlFor="remember"
                    className="cursor-pointer text-[12px] font-semibold text-white sm:text-[14px]"
                  >
                    تذكرني على هذا الجهاز
                  </Label>
                </div>
                <button
                  type="button"
                  onClick={onForgot}
                  className="text-[12px] font-bold transition-opacity hover:opacity-80 sm:text-[14px]"
                  style={{ color: '#E8B006' }}
                >
                  نسيت كلمة المرور؟
                </button>
              </div>

              <Button
                type="submit"
                className="mx-auto mt-3 flex h-11 w-full items-center justify-center gap-2 rounded-[10px] bg-[#2496FF] text-[18px] font-bold text-white shadow-lg shadow-[#2496FF]/10 transition-all hover:bg-[#1C7ED6] active:scale-[0.98] sm:h-[50px] sm:w-[300px] sm:gap-[10px] sm:text-[20px]"
              >
                دخول <LogIn className="h-5 w-5 sm:h-6 sm:w-6" />
              </Button>
            </form>

            <div className="pt-3 text-center sm:pt-2">
              <span className="text-[13px] font-bold text-white sm:text-[14px]">
                ليس لديك حساب؟{' '}
              </span>
              <Link
                href="/register"
                className="text-[13px] font-bold transition-opacity hover:opacity-80 sm:text-[14px]"
                style={{ color: '#FDB022' }}
              >
                إنشاء حساب جديد
              </Link>
            </div>

            <div className="mx-auto flex w-full max-w-[300px] items-center gap-3 py-2 sm:gap-4">
              <Separator className="flex-1 bg-white" />
              <span
                className="shrink-0 text-[10px] font-bold text-white sm:text-[11px]"
                style={{ fontFamily: 'Inter, sans-serif' }}
              >
                المتابعة باستخدام
              </span>
              <Separator className="flex-1 bg-white" />
            </div>

            <div className="flex items-center justify-center gap-4 pb-2 sm:gap-6">
              <button
                type="button"
                className="flex h-12 w-12 items-center justify-center rounded-full transition-transform hover:scale-110 sm:h-[50px] sm:w-[50px]"
              >
                <Image
                  src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/google/google-original.svg"
                  alt="Google"
                  width={28}
                  height={28}
                  className="sm:h-8 sm:w-8"
                  unoptimized
                />
              </button>
              <button
                type="button"
                className="flex h-12 w-12 items-center justify-center rounded-full transition-transform hover:scale-110 sm:h-[50px] sm:w-[50px]"
              >
                <AppleAppStoreIcon size={28} className="sm:h-9 sm:w-9" />
              </button>
            </div>
          </div>
        </Card>

        <div className="mt-8 flex w-full flex-col items-center space-y-2 px-4 text-white sm:mt-8">
          <div className="flex flex-wrap items-center justify-center gap-3 text-[13px] font-semibold sm:gap-4 sm:text-[14px]">
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
          <p className="text-center text-[11px] font-semibold text-white/60 sm:text-[12px]">
            © 2024 نظام نجاة للمواطنين. جميع الحقوق محفوظة.
          </p>
        </div>
      </div>
    </div>
  )
}

export default LoginError
